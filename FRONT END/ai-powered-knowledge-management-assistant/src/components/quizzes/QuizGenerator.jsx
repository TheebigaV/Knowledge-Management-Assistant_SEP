import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, TrendingUp, Settings, Play } from 'lucide-react';
import quizService from '../../services/quizService';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import MarkdownRenderer from '../common/MarkdownRenderer';

const QuizGenerator = ({ onQuizGenerated }) => {
  const { id: documentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  
  // Generation options
  const [options, setOptions] = useState({
    questionCount: 10,
    difficulty: 'medium',
    questionTypes: ['multiple-choice', 'true-false'],
    timeLimit: 30, // minutes
    includeExplanations: true,
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      console.log('Generating quiz for document:', documentId);
      console.log('Options:', options);
      
      const response = await quizService.generateQuiz(documentId, options);
      console.log('Quiz API response:', response);
      
      if (response && response.success) {
        const quiz = response.quiz || response.data?.quiz;
        console.log('Extracted quiz:', quiz);
        
        if (quiz && quiz.questions && quiz.questions.length > 0) {
          setModalTitle('Quiz Generated Successfully');
          setModalContent(`Generated quiz with ${quiz.questions.length} questions from the document. Click "Take Quiz" to start testing your knowledge!`);
          setShowModal(true);
          
          if (onQuizGenerated) {
            onQuizGenerated(quiz);
          }
          
          toast.success(`Generated quiz with ${quiz.questions.length} questions successfully!`);
        } else {
          // Try to create demo quiz as fallback
          console.log('No quiz from API, creating demo quiz');
          createDemoQuiz();
        }
      } else {
        console.log('API response unsuccessful, creating demo quiz');
        createDemoQuiz();
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Check if it's a network/backend error and provide demo quiz
      if (error.response?.status === 404 || error.response?.status === 500 || !error.response) {
        console.log('Backend error, creating demo quiz');
        createDemoQuiz();
      } else {
        const errorMessage = error.message || error.response?.data?.message || 'Failed to generate quiz';
        toast.error(errorMessage);
        setModalTitle('Generation Failed');
        setModalContent(`Error: ${errorMessage}. This might be because the backend API is not available or the document content is not suitable.`);
        setShowModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const createDemoQuiz = () => {
    // Create demo quiz as fallback
    const demoQuiz = {
      id: 'demo-quiz',
      title: 'Knowledge Management Quiz',
      description: 'Test your understanding of knowledge management concepts',
      timeLimit: 30,
      difficulty: 'medium',
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What is the primary purpose of a knowledge management system?',
          options: [
            'To store documents only',
            'To organize, share, and utilize knowledge effectively',
            'To replace human workers',
            'To create databases'
          ],
          correctAnswer: 1,
          explanation: 'Knowledge management systems are designed to help organizations organize, share, and effectively utilize their knowledge resources.'
        },
        {
          id: 'q2',
          type: 'true-false',
          question: 'AI can automatically generate summaries from uploaded documents.',
          correctAnswer: true,
          explanation: 'AI-powered systems can analyze document content and generate concise summaries automatically.'
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          question: 'Which of these is a benefit of using flashcards for learning?',
          options: [
            'They only work for visual learners',
            'They promote active recall and spaced repetition',
            'They eliminate the need to study',
            'They are only useful for memorizing dates'
          ],
          correctAnswer: 1,
          explanation: 'Flashcards are effective because they promote active recall and can be used with spaced repetition techniques.'
        }
      ]
    };

    setModalTitle('Demo Quiz Created');
    setModalContent(`Backend API not available. Created demo quiz with ${demoQuiz.questions.length} questions for testing purposes. Click "Take Quiz" to try the interface!`);
    setShowModal(true);
    
    if (onQuizGenerated) {
      onQuizGenerated(demoQuiz);
    }
    
    toast.success('Demo quiz created for testing!');
  };

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleQuestionTypeToggle = (type) => {
    setOptions(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type]
    }));
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-500/25 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Quiz Generator
              </h3>
              <p className="text-xs text-slate-500">AI-powered quiz creation</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Generation Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-slate-600" strokeWidth={2} />
              <h4 className="font-semibold text-slate-900">Quiz Options</h4>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Questions: {options.questionCount}
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={options.questionCount}
                onChange={(e) => handleOptionChange('questionCount', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>5</span>
                <span>20</span>
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={options.difficulty}
                onChange={(e) => handleOptionChange('difficulty', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                disabled={loading}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Time Limit: {options.timeLimit} minutes
              </label>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={options.timeLimit}
                onChange={(e) => handleOptionChange('timeLimit', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>10 min</span>
                <span>60 min</span>
              </div>
            </div>

            {/* Question Types */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Question Types
              </label>
              <div className="space-y-2">
                {['multiple-choice', 'true-false', 'short-answer'].map(type => (
                  <label key={type} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={options.questionTypes.includes(type)}
                      onChange={() => handleQuestionTypeToggle(type)}
                      className="w-4 h-4 text-purple-500 border-slate-300 rounded focus:ring-purple-500"
                      disabled={loading}
                    />
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {type.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Include Explanations */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeExplanations"
                checked={options.includeExplanations}
                onChange={(e) => handleOptionChange('includeExplanations', e.target.checked)}
                className="w-4 h-4 text-purple-500 border-slate-300 rounded focus:ring-purple-500"
                disabled={loading}
              />
              <label htmlFor="includeExplanations" className="text-sm font-medium text-slate-700">
                Include Explanations
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 bg-linear-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" strokeWidth={2} />
                Generate Quiz
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
      >
        <div className="prose prose-sm max-w-none prose-slate">
          <MarkdownRenderer content={modalContent} />
        </div>
      </Modal>
    </>
  );
};

export default QuizGenerator;
