import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Assessment: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const subjects = [
    'Mathematics',
    'Physics', 
    'Chemistry',
    'Biology',
    'English Literature',
    'History',
    'Geography',
    'Computer Science'
  ];

  const sampleQuestions = {
    Mathematics: [
      {
        question: "What is the derivative of x²?",
        options: ["2x", "x", "2", "x²"],
        correct: 0,
        concept: "Calculus - Derivatives"
      },
      {
        question: "Solve for x: 2x + 5 = 13",
        options: ["4", "8", "6", "3"],
        correct: 0,
        concept: "Algebra - Linear Equations"
      },
      {
        question: "What is the area of a circle with radius 5?",
        options: ["25π", "10π", "5π", "15π"],
        correct: 0,
        concept: "Geometry - Area Calculations"
      }
    ]
  };

  const startAssessment = () => {
    if (selectedSubject) {
      setAssessmentStarted(true);
      setCurrentQuestion(0);
      setAnswers([]);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < (sampleQuestions[selectedSubject as keyof typeof sampleQuestions]?.length || 1) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const questions = sampleQuestions[selectedSubject as keyof typeof sampleQuestions] || [];
    let correct = 0;
    const weakAreas: string[] = [];

    answers.forEach((answer, index) => {
      if (answer === questions[index]?.correct) {
        correct++;
      } else {
        weakAreas.push(questions[index]?.concept);
      }
    });

    return {
      score: Math.round((correct / questions.length) * 100),
      weakAreas,
      totalQuestions: questions.length,
      correctAnswers: correct
    };
  };

  if (showResults) {
    const results = calculateResults();
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Assessment Complete!</h2>
            <p className="text-gray-600 mt-2">Here's your personalized learning analysis</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{results.score}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{results.correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{results.weakAreas.length}</div>
              <div className="text-sm text-gray-600">Areas to Improve</div>
            </div>
          </div>

          {results.weakAreas.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Areas That Need Attention</h3>
              <div className="grid gap-3">
                {results.weakAreas.map((area, index) => (
                  <div key={index} className="flex items-center p-4 bg-red-50 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-500 mr-3" />
                    <span className="text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setShowResults(false);
                setAssessmentStarted(false);
                setSelectedSubject('');
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Take Another Assessment
            </button>
            <Link
              to="/tutor"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Get Targeted Help
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (assessmentStarted) {
    const questions = sampleQuestions[selectedSubject as keyof typeof sampleQuestions] || [];
    const question = questions[currentQuestion];

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{selectedSubject} Assessment</h2>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
              ></div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-6">{question?.question}</h3>

            <div className="grid gap-4">
              {question?.options.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(index)}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Learning Assessment</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Take a quick assessment to help our AI identify exactly where you need the most support. 
          This personalized analysis will create a custom learning path just for you.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a Subject to Assess</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {subjects.map((subject) => (
            <motion.button
              key={subject}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSubject(subject)}
              className={`p-4 border rounded-lg text-left transition-all ${
                selectedSubject === subject
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="font-medium text-gray-900">{subject}</div>
              <div className="text-sm text-gray-500 mt-1">15-20 questions • ~10 minutes</div>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAssessment}
            disabled={!selectedSubject}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            Start Assessment
            <ArrowRight className="ml-2 w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;