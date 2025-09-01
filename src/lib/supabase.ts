import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          grade_level: string;
          subjects: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          grade_level: string;
          subjects: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          grade_level?: string;
          subjects?: string[];
          created_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          student_id: string;
          subject: string;
          questions: any;
          answers: any;
          score: number;
          weak_areas: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject: string;
          questions: any;
          answers: any;
          score: number;
          weak_areas: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject?: string;
          questions?: any;
          answers?: any;
          score?: number;
          weak_areas?: string[];
          created_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          subject: string;
          description: string;
          submission: string;
          feedback: string;
          grade: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          subject: string;
          description: string;
          submission?: string;
          feedback?: string;
          grade?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          title?: string;
          subject?: string;
          description?: string;
          submission?: string;
          feedback?: string;
          grade?: number;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};