import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const login = async (email, password) => {
  try {
    console.log('Sending login data:', { email, password: '***' });
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

const register = async (username, email, password) => {
  try {
    console.log('Sending registration data:', { username, email, password: '***' });
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      username,
      email,
      password,
    });
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'An unknown error occurred' };
  }
};

const getProfile = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

const updateProfile = async (userData) => {
    try {
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};

const changePassword = async (passwords) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, passwords);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An unknown error occurred' };
    }
};


const authService = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
};

export default authService;
