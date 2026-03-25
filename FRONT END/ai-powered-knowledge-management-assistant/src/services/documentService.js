import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const uploadDocument = async (formData) => {
  try {
    console.log('Uploading document...');
    const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Document uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Document upload error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to upload document' };
  }
};

const getDocuments = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
    return response.data;
  } catch (error) {
    console.error('Get documents error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch documents' };
  }
};

const getDocumentById = async (id) => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('Get document error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to fetch document' };
  }
};

const updateDocument = async (id, documentData) => {
  try {
    const response = await axiosInstance.put(API_PATHS.DOCUMENTS.UPDATE_DOCUMENT(id), documentData);
    return response.data;
  } catch (error) {
    console.error('Update document error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to update document' };
  }
};

const deleteDocument = async (id) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id));
    return response.data;
  } catch (error) {
    console.error('Delete document error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to delete document' };
  }
};

const documentService = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
};

export default documentService;
