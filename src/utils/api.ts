import axios from 'axios';
import {Platform} from 'react-native';

const LOCAL_API_PORT = 3005; // Your Node.js server port

// Dynamically set the API base URL
// const API_BASE_URL =
//   Platform.OS === 'android'
//     ? `http://10.0.2.2:${LOCAL_API_PORT}/api/v1` // For Android Emulator
//     : `http://localhost:${LOCAL_API_PORT}/api/v1`; // For iOS Simulator or other platforms

const API_BASE_URL = 'https://ise-1-backend.vercel.app/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});
