export interface Student {
  id: string;
  user_id: string;
  full_name: string;
  grade_level: string;
  subjects: string[];
  profile_picture?: string;
  timezone: string;
  learning_goals: string[];
  study_preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  student_id: string;
  subject: string;
  assessment_type: string;
  questions: any;
  answers: any;
  score: number;
  max_score: number;
  weak_areas: string[];
  strong_areas: string[];
  recommendations: string[];
  time_taken?: number;
  created_at: string;
}

export interface Assignment {
  id: string;
  student_id: string;
  title: string;
  subject: string;
  description: string;
  submission_text?: string;
  submission_files?: string[];
  ai_feedback?: string;
  teacher_feedback?: string;
  grade: number;
  max_grade: number;
  status: 'pending' | 'submitted' | 'graded' | 'completed';
  due_date?: string;
  submitted_at?: string;
  graded_at?: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  student_id: string;
  subject: string;
  session_title?: string;
  messages: ChatMessage[];
  context_data: Record<string, any>;
  session_status: 'active' | 'completed' | 'archived';
  last_message_at: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ProgressTracking {
  id: string;
  student_id: string;
  subject: string;
  skill_area: string;
  current_level: number;
  max_level: number;
  experience_points: number;
  mastery_percentage: number;
  study_time_minutes: number;
  practice_sessions: number;
  achievements: string[];
  last_practiced?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  id: string;
  student_id: string;
  payment_provider: string;
  transaction_id: string;
  amount: number;
  currency: string;
  payment_type: 'subscription' | 'one_time' | 'upgrade';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  subscription_plan?: string;
  billing_cycle?: string;
  expires_at?: string;
  metadata: Record<string, any>;
  created_at: string;
}