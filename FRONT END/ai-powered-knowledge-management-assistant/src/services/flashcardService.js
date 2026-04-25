import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const generateFlashcards = async (documentId, options = {}) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, { 
      documentId, 
      ...options 
    });
    console.log('Flashcards generated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Flashcard generation error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to generate flashcards' };
  }
};

const getFlashcardsForDocument = async (documentId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId));
    console.log('Flashcards fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch flashcards error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch flashcards' };
  }
};

const reviewFlashcard = async (cardId, reviewData) => {
  try {
    const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId), reviewData);
    console.log('Flashcard reviewed:', response.data);
    return response.data;
  } catch (error) {
    console.error('Flashcard review error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to review flashcard' };
  }
};

const toggleStarFlashcard = async (cardId) => {
  try {
    const response = await axiosInstance.post(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
    console.log('Flashcard star toggled:', response.data);
    return response.data;
  } catch (error) {
    console.error('Flashcard star toggle error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to toggle star' };
  }
};

const deleteFlashcardSet = async (setId) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(setId));
    console.log('Flashcard set deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete flashcard set error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to delete flashcard set' };
  }
};

const getFlashcardCount = async () => {
  try {
    const response = await axiosInstance.get('/api/flashcards/count');
    console.log('Flashcard count fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch flashcard count error:', error.response?.data || error.message);
    // Return 0 if API fails
    return { count: 0 };
  }
};

const flashcardService = {
  generateFlashcards,
  getFlashcardsForDocument,
  reviewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSet,
  getFlashcardCount,
};

export default flashcardService;
