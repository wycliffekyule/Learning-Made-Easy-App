import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, TrendingUp, Clock, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
    fetchRecentActivity();
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setStudentData(data);
    }
    setLoading(false);
  };

  const fetchRecentActivity = async () => {
    // Simulate recent activity data
    setRecentActivity([
      { type: 'assessment', subject: 'Mathematics', score: 85, date: '2025-01-15' },
      { type: 'assignment', title: 'Algebra Homework', grade: 92, date: '2025-01-14' },
      { type: 'tutoring', subject: 'Physics', duration: '45 min', date: '2025-01-13' },
    ]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const quickActions = [
    { 
      to: '/assessment', 
      icon: Brain, 
      title: 'Take Assessment', 
      description: 'Identify your learning gaps',
      color: 'bg-purple-500'
    },
    { 
      to: '/tutor', 
      icon: BookOpen, 
      title: 'Ask Virtual Tutor', 
      description: 'Get instant help with any question',
      color: 'bg-blue-500'
    },
    { 
      to: '/assignments', 
      icon: Target, 
      title: 'Submit Assignment', 
      description: 'Upload your homework for feedback',
      color: 'bg-green-500'
    },
    { 
      to: '/progress', 
      icon: TrendingUp, 
      title: 'View Progress', 
      description: 'Track your improvement over time',
      color: 'bg-orange-500'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {studentData?.full_name || user?.user_metadata?.full_name}!
          </h1>
          <p className="text-gray-600 mt-1">Ready to continue learning? Let's make progress together.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Current Grade</div>
          <div className="text-2xl font-bold text-blue-600">{studentData?.grade_level || '9th Grade'}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link
              to={action.to}
              className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border hover:border-gray-300"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Week's Study Time</p>
              <p className="text-2xl font-bold text-gray-900">12.5 hrs</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-[87%]"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Subjects Improved</p>
              <p className="text-2xl font-bold text-gray-900">3 of 5</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full w-3/5"></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'assessment' ? 'bg-purple-100' :
                  activity.type === 'assignment' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'assessment' && <Brain className="w-5 h-5 text-purple-600" />}
                  {activity.type === 'assignment' && <Target className="w-5 h-5 text-green-600" />}
                  {activity.type === 'tutoring' && <BookOpen className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {activity.type === 'assessment' && `${activity.subject} Assessment`}
                    {activity.type === 'assignment' && activity.title}
                    {activity.type === 'tutoring' && `${activity.subject} Tutoring Session`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.score && `Score: ${activity.score}%`}
                    {activity.grade && `Grade: ${activity.grade}%`}
                    {activity.duration && `Duration: ${activity.duration}`}
                  </p>
                </div>
                <span className="text-sm text-gray-400">{activity.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;