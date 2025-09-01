import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { assignmentId, submission } = await req.json();

    // Get assignment details
    const { data: assignment } = await supabase
      .from('assignments')
      .select('*, students(*)')
      .eq('id', assignmentId)
      .single();

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Create AI prompt for grading and feedback
    const gradingPrompt = `You are an expert teacher grading a ${assignment.subject} assignment.
    
    Assignment: ${assignment.title}
    Description: ${assignment.description}
    Student Grade Level: ${assignment.students.grade_level}
    
    Student Submission:
    ${submission}
    
    Please provide:
    1. A grade out of 100
    2. Constructive feedback highlighting strengths
    3. Areas for improvement with specific suggestions
    4. Encouragement and next steps
    
    Format your response as JSON:
    {
      "grade": number,
      "feedback": "detailed feedback text",
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"],
      "encouragement": "encouraging message"
    }`;

    // Call OpenAI for grading
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: gradingPrompt }],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    const openAIData = await openAIResponse.json();
    let feedback;
    
    try {
      feedback = JSON.parse(openAIData.choices[0].message.content);
    } catch {
      feedback = {
        grade: 75,
        feedback: openAIData.choices[0].message.content,
        strengths: ["Good effort shown"],
        improvements: ["Continue practicing"],
        encouragement: "Keep up the great work!"
      };
    }

    // Update assignment with feedback and grade
    const { data: updatedAssignment } = await supabase
      .from('assignments')
      .update({
        submission_text: submission,
        ai_feedback: feedback.feedback,
        grade: feedback.grade,
        status: 'graded',
        submitted_at: new Date().toISOString(),
        graded_at: new Date().toISOString()
      })
      .eq('id', assignmentId)
      .select()
      .single();

    return new Response(
      JSON.stringify({ 
        assignment: updatedAssignment,
        feedback 
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );

  } catch (error) {
    console.error('Error processing assignment feedback:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process assignment feedback' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  }
});