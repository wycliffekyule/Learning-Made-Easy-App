import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface TutorRequest {
  message: string;
  subject: string;
  sessionId?: string;
  studentId: string;
  context?: any;
}

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

    const { message, subject, sessionId, studentId, context }: TutorRequest = await req.json();

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Get student profile for personalization
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    // Get recent assessments for context
    const { data: recentAssessments } = await supabase
      .from('assessments')
      .select('*')
      .eq('student_id', studentId)
      .eq('subject', subject)
      .order('created_at', { ascending: false })
      .limit(3);

    // Build context for AI
    let systemPrompt = `You are a friendly, encouraging virtual tutor specializing in ${subject}. 
    You're helping ${student?.full_name || 'a student'} who is in ${student?.grade_level || '9th grade'}.
    
    Your teaching style should be:
    - Patient and encouraging
    - Break down complex concepts into simple steps
    - Use analogies and real-world examples
    - Ask guiding questions to help the student think through problems
    - Provide positive reinforcement
    - Adapt to the student's learning pace
    
    `;

    if (recentAssessments && recentAssessments.length > 0) {
      const weakAreas = recentAssessments[0].weak_areas || [];
      if (weakAreas.length > 0) {
        systemPrompt += `The student has shown they need extra help with: ${weakAreas.join(', ')}. 
        Please be especially supportive and detailed when these topics come up.`;
      }
    }

    // Get or create chat session
    let chatSession;
    if (sessionId) {
      const { data } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      chatSession = data;
    } else {
      const { data } = await supabase
        .from('chat_sessions')
        .insert([{
          student_id: studentId,
          subject,
          session_title: `${subject} Help Session`,
          messages: []
        }])
        .select()
        .single();
      chatSession = data;
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(chatSession?.messages || []),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages.slice(-10), // Keep last 10 messages for context
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const openAIData = await openAIResponse.json();
    const aiResponse = openAIData.choices[0].message.content;

    // Update chat session with new messages
    const updatedMessages = [
      ...(chatSession?.messages || []),
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
    ];

    await supabase
      .from('chat_sessions')
      .update({ 
        messages: updatedMessages,
        last_message_at: new Date().toISOString()
      })
      .eq('id', chatSession.id);

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        sessionId: chatSession.id
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );

  } catch (error) {
    console.error('Error in AI tutor function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process tutor request' }),
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