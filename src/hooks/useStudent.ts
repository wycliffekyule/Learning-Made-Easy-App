import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Student } from '../lib/types';

export const useStudent = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchStudent();
    } else {
      setStudent(null);
      setLoading(false);
    }
  }, [user]);

  const fetchStudent = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No student profile found, create one
          await createStudentProfile();
        } else {
          throw error;
        }
      } else {
        setStudent(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const createStudentProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          user_id: user.id,
          full_name: user.user_metadata?.full_name || 'Student',
          grade_level: '9th Grade',
          subjects: ['Mathematics', 'Science'],
          timezone: 'UTC',
          learning_goals: [],
          study_preferences: {}
        }])
        .select()
        .single();

      if (error) throw error;
      setStudent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create student profile');
    }
  };

  const updateStudent = async (updates: Partial<Student>) => {
    if (!student) return;

    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', student.id)
        .select()
        .single();

      if (error) throw error;
      setStudent(data);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update student';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  return {
    student,
    loading,
    error,
    updateStudent,
    refetchStudent: fetchStudent
  };
};