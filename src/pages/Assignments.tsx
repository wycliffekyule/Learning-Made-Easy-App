import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Clock, Award, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  submission_text: string | null;
  ai_feedback: string | null;
  grade: number;
  status: 'pending' | 'submitted' | 'graded' | 'completed';
  due_date: string | null;
  created_at: string;
}

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: 'Mathematics',
    description: '',
    dueDate: ''
  });

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'English Literature', 'History', 'Geography', 'Computer Science'
  ];

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const fetchAssignments = async () => {
    if (!user) return;

    const { data: studentData } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (studentData) {
      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select('*')
        .eq('student_id', studentData.id)
        .order('created_at', { ascending: false });

      setAssignments(assignmentsData || []);
    }
    setLoading(false);
  };

  const createAssignment = async () => {
    if (!user || !newAssignment.title || !newAssignment.description) return;

    const { data: studentData } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (studentData) {
      const { data } = await supabase
        .from('assignments')
        .insert([{
          student_id: studentData.id,
          title: newAssignment.title,
          subject: newAssignment.subject,
          description: newAssignment.description,
          due_date: newAssignment.dueDate || null,
        }])
        .select()
        .single();

      if (data) {
        setAssignments(prev => [data, ...prev]);
        setShowCreateForm(false);
        setNewAssignment({
          title: '',
          subject: 'Mathematics',
          description: '',
          dueDate: ''
        });
      }
    }
  };

  const submitAssignment = async () => {
    if (!selectedAssignment || !submissionText.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/assignment-feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          submission: submissionText
        }),
      });

      const data = await response.json();
      
      if (data.assignment) {
        setAssignments(prev => 
          prev.map(a => a.id === selectedAssignment.id ? data.assignment : a)
        );
        setSelectedAssignment(null);
        setSubmissionText('');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'graded': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'submitted': return Upload;
      case 'graded': return CheckCircle;
      case 'completed': return Award;
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Submit your work and get AI-powered feedback</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Assignment
        </motion.button>
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Assignment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Assignment title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="What do you need to work on?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Assignment Submission Modal */}
      {selectedAssignment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedAssignment.title}</h3>
            <p className="text-gray-600 mb-6">{selectedAssignment.description}</p>
            
            {selectedAssignment.status === 'graded' ? (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">Grade Received</span>
                    <span className="text-2xl font-bold text-green-600">{selectedAssignment.grade}%</span>
                  </div>
                </div>
                
                {selectedAssignment.ai_feedback && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">AI Feedback</h4>
                    <p className="text-blue-700 whitespace-pre-wrap">{selectedAssignment.ai_feedback}</p>
                  </div>
                )}
                
                {selectedAssignment.submission_text && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Your Submission</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedAssignment.submission_text}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Submission</label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Write your assignment solution here..."
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setSubmissionText('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedAssignment.status !== 'graded' && (
                <button
                  onClick={submitAssignment}
                  disabled={loading || !submissionText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {loading ? 'Submitting...' : 'Submit Assignment'}
                  <Upload className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Assignments Grid */}
      <div className="grid gap-6">
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600 mb-4">Create your first assignment to get started with AI-powered feedback</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Assignment
            </button>
          </div>
        ) : (
          assignments.map((assignment, index) => {
            const StatusIcon = getStatusIcon(assignment.status);
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border hover:border-blue-200 transition-all cursor-pointer"
                onClick={() => setSelectedAssignment(assignment)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="font-medium">{assignment.subject}</span>
                      {assignment.due_date && (
                        <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(assignment.status)}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </div>
                    
                    {assignment.grade > 0 && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{assignment.grade}%</div>
                        <div className="text-xs text-gray-500">Grade</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {assignment.status === 'graded' && assignment.ai_feedback && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 font-medium mb-1">AI Feedback Preview</p>
                    <p className="text-sm text-blue-700 line-clamp-2">
                      {assignment.ai_feedback.substring(0, 120)}...
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Assignments;