import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Star, RotateCcw, ChevronLeft, ChevronRight, Check, X, Eye } from 'lucide-react';
import flashcardService from '../../services/flashcardService';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../common/MarkdownRenderer';

const FlashcardViewer = ({ generatedFlashcards }) => {
  const { id: documentId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studyMode, setStudyMode] = useState('review'); // 'review' or 'browse'
  const [reviewData, setReviewData] = useState({});

  useEffect(() => {
    if (generatedFlashcards && generatedFlashcards.length > 0) {
      setFlashcards(generatedFlashcards);
    } else {
      fetchFlashcards();
    }
  }, [generatedFlashcards, documentId]);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      if (response.success) {
        const cards = response.flashcards || response.data?.flashcards || [];
        setFlashcards(cards);
      }
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
      toast.error('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReview = async (rating) => {
    if (!flashcards[currentIndex] || studyMode !== 'review') return;

    try {
      await flashcardService.reviewFlashcard(flashcards[currentIndex].id, { rating });
      setReviewData(prev => ({ ...prev, [flashcards[currentIndex].id]: rating }));
      
      // Auto-advance to next card
      if (currentIndex < flashcards.length - 1) {
        handleNext();
      } else {
        toast.success('All flashcards reviewed!');
      }
    } catch (error) {
      console.error('Review failed:', error);
      toast.error('Failed to save review');
    }
  };

  const handleToggleStar = async () => {
    if (!flashcards[currentIndex]) return;

    try {
      await flashcardService.toggleStarFlashcard(flashcards[currentIndex].id);
      setFlashcards(prev => prev.map(card => 
        card.id === flashcards[currentIndex].id 
          ? { ...card, starred: !card.starred }
          : card
      ));
      toast.success(flashcards[currentIndex].starred ? 'Removed from starred' : 'Added to starred');
    } catch (error) {
      console.error('Toggle star failed:', error);
      toast.error('Failed to toggle star');
    }
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewData({});
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-slate-600">Loading flashcards...</span>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-8">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" strokeWidth={2} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Flashcards Available</h3>
          <p className="text-slate-600 mb-6">
            Generate flashcards from this document to start studying.
          </p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" strokeWidth={2} />
            <h3 className="text-lg font-semibold text-slate-900">Flashcard Study</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStudyMode(studyMode === 'review' ? 'browse' : 'review')}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {studyMode === 'review' ? 'Switch to Browse' : 'Switch to Review'}
            </button>
            <button
              onClick={resetProgress}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset Progress"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>Card {currentIndex + 1} of {flashcards.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-linear-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Flashcard Container */}
          <div 
            className="relative h-64 cursor-pointer perspective-1000"
            onClick={handleFlip}
          >
            <div 
              className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 flex flex-col justify-center items-center text-center">
                <div className="text-blue-600 mb-4">
                  <Eye className="w-8 h-8 mx-auto" strokeWidth={2} />
                </div>
                <MarkdownRenderer content={currentCard?.front || currentCard?.question || 'No front content'} />
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-6 flex flex-col justify-center items-center text-center">
                <div className="text-indigo-600 mb-4">
                  <BookOpen className="w-8 h-8 mx-auto" strokeWidth={2} />
                </div>
                <MarkdownRenderer content={currentCard?.back || currentCard?.answer || 'No back content'} />
              </div>
            </div>
          </div>

          {/* Flashcard Actions */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Click card to flip</p>
              {studyMode === 'review' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReview('hard')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hard"
                  >
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => handleReview('medium')}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="Medium"
                  >
                    <div className="w-5 h-5 rounded-full bg-yellow-600"></div>
                  </button>
                  <button
                    onClick={() => handleReview('easy')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Easy"
                  >
                    <Check className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleStar}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title={currentCard?.starred ? 'Remove from starred' : 'Add to starred'}
              >
                <Star className={`w-5 h-5 ${currentCard?.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} strokeWidth={2} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardViewer;
