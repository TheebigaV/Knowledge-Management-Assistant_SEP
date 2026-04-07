import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TrendingUp, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import quizService from '../../services/quizService';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../common/MarkdownRenderer';

const QuizViewer = ({ generatedQuiz }) => {
  const { id: documentId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (generatedQuiz) {
      setQuiz(generatedQuiz);
      setTimeRemaining(generatedQuiz.timeLimit * 60); // Convert minutes to seconds
    } else {
      fetchQuiz();
    }
  }, [generatedQuiz, documentId]);

  useEffect(() => {
    let timer;
    if (quizStarted && !showResults && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && quizStarted && !showResults) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, quizStarted, showResults]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const response = await quizService.getQuizzesForDocument(documentId);
      if (response.success && response.quizzes && response.quizzes.length > 0) {
        const latestQuiz = response.quizzes[0]; // Get the most recent quiz
        setQuiz(latestQuiz);
        setTimeRemaining(latestQuiz.timeLimit * 60);
      }
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(quiz.timeLimit * 60);
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    setLoading(true);
    try {
      const response = await quizService.submitQuiz(quiz.id, answers);
      console.log('Quiz submitted:', response);
      
      if (response.success) {
        setQuizResults(response.results || response.data?.results);
        setShowResults(true);
        toast.success('Quiz submitted successfully!');
      } else {
        // Calculate results locally if backend fails
        calculateLocalResults();
      }
    } catch (error) {
      console.error('Quiz submission error:', error);
      calculateLocalResults();
    } finally {
      setLoading(false);
    }
  };

  const calculateLocalResults = () => {
    if (!quiz) return;

    let correctCount = 0;
    const questionResults = [];

    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = checkAnswer(question, userAnswer);
      
      if (isCorrect) correctCount++;
      
      questionResults.push({
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    });

    const results = {
      score: (correctCount / quiz.questions.length) * 100,
      correctAnswers: correctCount,
      totalQuestions: quiz.questions.length,
      timeSpent: (quiz.timeLimit * 60) - timeRemaining,
      questionResults
    };

    setQuizResults(results);
    setShowResults(true);
    toast.success('Quiz completed!');
  };

  const checkAnswer = (question, userAnswer) => {
    if (question.type === 'multiple-choice') {
      return userAnswer === question.correctAnswer;
    } else if (question.type === 'true-false') {
      return userAnswer === question.correctAnswer;
    } else if (question.type === 'short-answer') {
      // For demo purposes, accept any non-empty answer for short-answer
      return userAnswer && userAnswer.trim().length > 0;
    }
    return false;
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setQuizResults(null);
    setQuizStarted(false);
    setTimeRemaining(quiz?.timeLimit * 60 || 1800);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-slate-600">Loading quiz...</span>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-8">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" strokeWidth={2} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Quiz Available</h3>
          <p className="text-slate-600 mb-6">
            Generate a quiz from this document to start testing your knowledge.
          </p>
        </div>
      </div>
    );
  }

  if (showResults && quizResults) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Quiz Results</h3>
            <div className="mb-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {Math.round(quizResults.score)}%
              </div>
              <p className="text-slate-600">
                {quizResults.correctAnswers} out of {quizResults.totalQuestions} correct
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" strokeWidth={2} />
                <span>Time: {formatTime(quizResults.timeSpent)}</span>
              </div>
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" strokeWidth={2} />
                Retake Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Question Results */}
        <div className="space-y-4">
          {quizResults.questionResults.map((result, index) => (
            <div key={result.questionId} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  result.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5" strokeWidth={2} />
                  ) : (
                    <XCircle className="w-5 h-5" strokeWidth={2} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Question {index + 1}
                  </h4>
                  <p className="text-slate-700 mb-3">{result.question}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-slate-600">Your answer: </span>
                      <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {result.userAnswer || 'Not answered'}
                      </span>
                    </div>
                    {!result.isCorrect && (
                      <div>
                        <span className="font-medium text-slate-600">Correct answer: </span>
                        <span className="text-green-600">{result.correctAnswer}</span>
                      </div>
                    )}
                    {result.explanation && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-600">Explanation: </span>
                        <MarkdownRenderer content={result.explanation} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-purple-600" strokeWidth={2} />
            <h3 className="text-lg font-semibold text-slate-900">{quiz.title}</h3>
          </div>
          <div className="flex items-center gap-4">
            {quizStarted && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-600" strokeWidth={2} />
                <span className={`font-medium ${timeRemaining < 60 ? 'text-red-600' : 'text-slate-600'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>

        {!quizStarted ? (
          <div className="text-center py-8">
            <p className="text-slate-600 mb-6">{quiz.description}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-600 mb-6">
              <span>{quiz.questions.length} questions</span>
              <span>·</span>
              <span>{quiz.timeLimit} minutes</span>
              <span>·</span>
              <span className="capitalize">{quiz.difficulty}</span>
            </div>
            <button
              onClick={startQuiz}
              className="px-6 py-3 bg-linear-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-linear-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quiz Question */}
      {quizStarted && (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-8">
          <div className="max-w-2xl mx-auto">
            <h4 className="text-xl font-semibold text-slate-900 mb-6">
              {currentQuestion.question}
            </h4>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                    className="w-4 h-4 text-purple-500 border-slate-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-slate-700">{option}</span>
                </label>
              ))}

              {currentQuestion.type === 'true-false' && (
                <div className="space-y-3">
                  {[
                    { value: true, label: 'True' },
                    { value: false, label: 'False' }
                  ].map(option => (
                    <label
                      key={option.value}
                      className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option.value}
                        checked={answers[currentQuestion.id] === option.value}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value === 'true')}
                        className="w-4 h-4 text-purple-500 border-slate-300 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-slate-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'short-answer' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 border-2 border-slate-200 rounded-xl resize-none h-32 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={loading}
                    className="px-6 py-2 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Quiz'}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizViewer;
