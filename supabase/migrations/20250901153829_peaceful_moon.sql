/*
  # Complete Learning Made Easy Database Schema

  1. New Tables
    - `students` - Student profiles with personal information and subjects
    - `assessments` - Assessment results and weak area identification
    - `assignments` - Assignment submissions and feedback system
    - `chat_sessions` - Virtual tutor chat history and context
    - `progress_tracking` - Detailed progress analytics and achievements
    - `payment_history` - Transaction records for premium features

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Secure foreign key relationships

  3. Features
    - AI-powered assessment analysis
    - Virtual tutor conversation tracking
    - Assignment grading and feedback system
    - Progress monitoring with achievement unlocks
*/

-- Students table for user profiles
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  grade_level text NOT NULL DEFAULT '9th Grade',
  subjects text[] DEFAULT '{}',
  profile_picture text,
  timezone text DEFAULT 'UTC',
  learning_goals text[],
  study_preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessments table for tracking student evaluations
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject text NOT NULL,
  assessment_type text DEFAULT 'diagnostic',
  questions jsonb NOT NULL,
  answers jsonb NOT NULL,
  score integer NOT NULL DEFAULT 0,
  max_score integer NOT NULL DEFAULT 100,
  weak_areas text[] DEFAULT '{}',
  strong_areas text[] DEFAULT '{}',
  recommendations text[],
  time_taken integer, -- in seconds
  created_at timestamptz DEFAULT now()
);

-- Assignments table for homework and project submissions
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  submission_text text,
  submission_files text[], -- URLs to uploaded files
  ai_feedback text,
  teacher_feedback text,
  grade integer DEFAULT 0,
  max_grade integer DEFAULT 100,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'completed')),
  due_date timestamptz,
  submitted_at timestamptz,
  graded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Chat sessions for virtual tutor interactions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject text NOT NULL,
  session_title text,
  messages jsonb DEFAULT '[]',
  context_data jsonb DEFAULT '{}',
  session_status text DEFAULT 'active' CHECK (session_status IN ('active', 'completed', 'archived')),
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Progress tracking for detailed analytics
CREATE TABLE IF NOT EXISTS progress_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject text NOT NULL,
  skill_area text NOT NULL,
  current_level integer DEFAULT 1,
  max_level integer DEFAULT 10,
  experience_points integer DEFAULT 0,
  mastery_percentage integer DEFAULT 0,
  study_time_minutes integer DEFAULT 0,
  practice_sessions integer DEFAULT 0,
  achievements text[] DEFAULT '{}',
  last_practiced timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment history for subscription and feature tracking
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  payment_provider text NOT NULL,
  transaction_id text NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_type text NOT NULL CHECK (payment_type IN ('subscription', 'one_time', 'upgrade')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  subscription_plan text,
  billing_cycle text,
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students table
CREATE POLICY "Students can view own profile"
  ON students FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Students can update own profile"
  ON students FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Students can insert own profile"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for assessments table
CREATE POLICY "Students can view own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

CREATE POLICY "Students can insert own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

-- RLS Policies for assignments table
CREATE POLICY "Students can view own assignments"
  ON assignments FOR SELECT
  TO authenticated
  USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

CREATE POLICY "Students can manage own assignments"
  ON assignments FOR ALL
  TO authenticated
  USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

-- RLS Policies for chat_sessions table
CREATE POLICY "Students can view own chat sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

CREATE POLICY "Students can manage own chat sessions"
  ON chat_sessions FOR ALL
  TO authenticated
  USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

-- RLS Policies for progress_tracking table
CREATE POLICY "Students can view own progress"
  ON progress_tracking FOR SELECT
  TO authenticated
  USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

CREATE POLICY "Students can update own progress"
  ON progress_tracking FOR ALL
  TO authenticated
  USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

-- RLS Policies for payment_history table
CREATE POLICY "Students can view own payment history"
  ON payment_history FOR SELECT
  TO authenticated
  USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

CREATE POLICY "Students can insert own payment records"
  ON payment_history FOR INSERT
  TO authenticated
  WITH CHECK (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_student_id ON assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_student_id ON chat_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_student_id ON progress_tracking(student_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_student_id ON payment_history(student_id);