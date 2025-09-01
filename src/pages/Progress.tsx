import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Target, Clock, BookOpen, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Progress: React.FC = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<any[]>([]);
  const [studentStats, setStudentStats] = useState<any>(null);
  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(true);

  // Sample data for demonstration
  const sampleProgressData = [
    { week: 'Week 1', Mathematics: 65, Physics: 70, Chemistry: 60 },
    { week: 'Week 2', Mathematics: 72, Physics: 75, Chemistry: 68 },
    { week: 'Week 3', Mathematics: 78, Physics: 80, Chemistry: 75 },
    { week: 'Week 4', Mathematics: 85, Physics: 82, Chemistry: 80 },
  ];

  const subjectMasteryData = [
    { subject: 'Algebra', mastery: 85, fullMark: 100 },
    { subject: 'Geometry', mastery: 70, fullMark: 100 },
    { subject: 'Calculus', mastery: 60, fullMark: 100 },
    { subject: 'Statistics', mastery: 90, fullMark: 100 },
    { subject: 'Trigonometry', mastery: 75, fullMark: 100 },
  ];

  const studyTimeData = [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 60 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 90 },
    { day: 'Fri', minutes: 75 },
    { day: 'Sat', minutes: 120 },
    { day: 'Sun', minutes: 45 },
  ];

  useEffect(() => {
    fetchProgressData();
    setProgressData(sampleProgressData);
  }, [user, timeframe]);

  const fetchProgressData = async () => {
    if (!user) return;

    // Fetch student stats
    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (studentData) {
      // Fetch recent assessments for progress calculation
      const { data: assessments } = await supabase
        .from('assessments')
        .select('*')
        .eq('student_id', studentData.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate stats
      const totalAssessments = assessments?.length || 0;
      const avgScore = assessments?.reduce((sum, a) => sum + a.score, 0) / totalAssessments || 0;
      const improvementRate = totalAssessments > 1 ? 
        ((assessments[0]?.score || 0) - (assessments[totalAssessments - 1]?.score || 0)) : 0;

      setStudentStats({
        totalStudyTime: 465, // minutes this week
        averageScore: Math.round(avgScore),
        assessmentsTaken: totalAssessments,
        improvementRate: Math.round(improvementRate),
        currentStreak: 5, // days
        achievements: 12
      });
    }

    setLoading(false);
  };

  const achievements = [
    { title: 'First Assessment', description: 'Completed your first diagnostic test', earned: true, icon: Brain },
    { title: 'Quick Learner', description: 'Improved score by 20% in one week', earned: true, icon: TrendingUp },
    { title: 'Consistent Student', description: 'Studied for 5 days in a row', earned: true, icon: Clock },
    { title: 'Subject Master', description: 'Achieved 90%+ in Mathematics', earned: false, icon: Award },
    { title: 'Help Seeker', description: 'Used the virtual tutor 10 times', earned: true, icon: BookOpen },
    { title: 'Assignment Pro', description: 'Submitted 5 assignments', earned: false, icon: Target },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your learning journey and celebrate achievements</p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      {/* Key Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Study Time</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round((studentStats?.totalStudyTime || 465) / 60)}h</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Score</p>
              <p className="text-2xl font-bold text-green-600">{studentStats?.averageScore || 87}%</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assessments</p>
              <p className="text-2xl font-bold text-purple-600">{studentStats?.assessmentsTaken || 8}</p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Improvement</p>
              <p className="text-2xl font-bold text-orange-600">+{Math.abs(studentStats?.improvementRate || 15)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Streak</p>
              <p className="text-2xl font-bold text-red-600">{studentStats?.currentStreak || 5}</p>
            </div>
            <Target className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Achievements</p>
              <p className="text-2xl font-bold text-indigo-600">{studentStats?.achievements || 12}</p>
            </div>
            <Award className="w-8 h-8 text-indigo-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress Over Time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Mathematics" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="Physics" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="Chemistry" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject Mastery Radar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Mastery</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={subjectMasteryData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                name="Mastery"
                dataKey="mastery"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Study Time Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Study Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studyTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Achievements</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.earned 
                    ? 'bg-yellow-500' 
                    : 'bg-gray-300'
                }`}>
                  <achievement.icon className={`w-5 h-5 ${
                    achievement.earned ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.earned && (
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Progress;