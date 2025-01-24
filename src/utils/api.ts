import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:3005/api/v1'; // Replace with your actual API base URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

export const getOtp = async (mobile: number) => {
  try {
    const response = await api.post('/users/login-otp', {mobile});
    console.log('OTP response:', response);
    return response; // Optional: Return response if needed elsewhere
  } catch (error: any) {
    // Enhanced error handling
    if (error.response) {
      console.error('Server responded with an error:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Axios error message:', error.message);
    }

    throw error; // Re-throw to propagate error if needed
  }
};
