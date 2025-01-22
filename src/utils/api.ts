import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

export const sendOtp = async (mobile: string, email: string) => {
  try {
    const response = await api.post('/auth/send-otp', { mobile, email });
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOtp = async (otp: string, mobile: string) => {
  try {
    const response = await api.post('/auth/verify-otp', { otp, mobile });
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};
