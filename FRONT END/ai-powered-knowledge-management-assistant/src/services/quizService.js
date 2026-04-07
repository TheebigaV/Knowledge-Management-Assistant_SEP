import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const generateQuiz = async (documentId, options = {}) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, { 
      documentId, 
      ...options 
    });
    console.log('Quiz generated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Quiz generation error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to generate quiz' };
  }
};

const getQuizzesForDocument = async (documentId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
    console.log('Quizzes fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch quizzes error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch quizzes' };
  }
};

const getQuizById = async (quizId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId));
    console.log('Quiz fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch quiz error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch quiz' };
  }
};

const submitQuiz = async (quizId, answers) => {
  try {
    const response = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId), { answers });
    console.log('Quiz submitted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Quiz submission error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to submit quiz' };
  }
};

const getQuizResults = async (quizId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId));
    console.log('Quiz results fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch quiz results error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch quiz results' };
  }
};

const deleteQuiz = async (quizId) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE_QUIZ(quizId));
    console.log('Quiz deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete quiz error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to delete quiz' };
  }
};

const quizService = {
  generateQuiz,
  getQuizzesForDocument,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz,
};

export default quizService;
