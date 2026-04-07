import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, BookOpen, Settings, Play } from 'lucide-react';
import flashcardService from '../../services/flashcardService';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import MarkdownRenderer from '../common/MarkdownRenderer';

const FlashcardGenerator = ({ onFlashcardsGenerated }) => {
  const { id: documentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  
  // Generation options
  const [options, setOptions] = useState({
    count: 10,
    difficulty: 'medium',
    includeDefinitions: true,
    includeExamples: false,
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      console.log('Generating flashcards for document:', documentId);
      console.log('Options:', options);
      
      const response = await flashcardService.generateFlashcards(documentId, options);
      console.log('Flashcards API response:', response);
      
      if (response && response.success) {
        const flashcards = response.flashcards || response.data?.flashcards || [];
        console.log('Extracted flashcards:', flashcards);
        
        if (flashcards.length > 0) {
          setModalTitle('Flashcards Generated Successfully');
          setModalContent(`Generated ${flashcards.length} flashcards from the document. Click "Study Flashcards" to start learning!`);
          setShowModal(true);
          
          if (onFlashcardsGenerated) {
            onFlashcardsGenerated(flashcards);
          }
          
          toast.success(`Generated ${flashcards.length} flashcards successfully!`);
        } else {
          // Try to create demo flashcards as fallback
          console.log('No flashcards from API, creating demo flashcards');
          createDemoFlashcards();
        }
      } else {
        console.log('API response unsuccessful, creating demo flashcards');
        createDemoFlashcards();
      }
    } catch (error) {
      console.error('Flashcard generation error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Check if it's a network/backend error and provide demo flashcards
      if (error.response?.status === 404 || error.response?.status === 500 || !error.response) {
        console.log('Backend error, creating demo flashcards');
        createDemoFlashcards();
      } else {
        const errorMessage = error.message || error.response?.data?.message || 'Failed to generate flashcards';
        toast.error(errorMessage);
        setModalTitle('Generation Failed');
        setModalContent(`Error: ${errorMessage}. This might be because the backend API is not available or the document content is not suitable.`);
        setShowModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const createDemoFlashcards = () => {
    // Create demo flashcards as fallback
    const demoFlashcards = [
      {
        id: 'demo-1',
        front: 'What is the main topic of this document?',
        back: 'Based on the document content, this appears to be about knowledge management and AI-powered learning systems.',
        starred: false
      },
      {
        id: 'demo-2', 
        front: 'What are the key components mentioned?',
        back: 'The document mentions flashcards, AI tools, document management, and learning progress tracking.',
        starred: false
      },
      {
        id: 'demo-3',
        front: 'How does the AI assistance work?',
        back: 'The AI system helps generate summaries, explanations, and flashcards from uploaded documents.',
        starred: false
      }
    ];

    setModalTitle('Demo Flashcards Created');
    setModalContent(`Backend API not available. Created ${demoFlashcards.length} demo flashcards for testing purposes. Click "Study Flashcards" to try the interface!`);
    setShowModal(true);
    
    if (onFlashcardsGenerated) {
      onFlashcardsGenerated(demoFlashcards);
    }
    
    toast.success('Demo flashcards created for testing!');
  };

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Flashcard Generator
              </h3>
              <p className="text-xs text-slate-500">AI-powered flashcard creation</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Generation Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-slate-600" strokeWidth={2} />
              <h4 className="font-semibold text-slate-900">Generation Options</h4>
            </div>

            {/* Number of Flashcards */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Flashcards: {options.count}
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={options.count}
                onChange={(e) => handleOptionChange('count', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>5</span>
                <span>30</span>
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                disabled={loading}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Include Definitions */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeDefinitions"
                checked={options.includeDefinitions}
                onChange={(e) => handleOptionChange('includeDefinitions', e.target.checked)}
                className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <label htmlFor="includeDefinitions" className="text-sm font-medium text-slate-700">
                Include Definitions
              </label>
            </div>

            {/* Include Examples */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeExamples"
                checked={options.includeExamples}
                onChange={(e) => handleOptionChange('includeExamples', e.target.checked)}
                className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <label htmlFor="includeExamples" className="text-sm font-medium text-slate-700">
                Include Examples
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Flashcards...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" strokeWidth={2} />
                Generate Flashcards
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

export default FlashcardGenerator;
