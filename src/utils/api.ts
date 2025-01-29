import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Alert, Platform} from 'react-native';
import {logoutApiCall} from './logout';

const LOCAL_API_PORT = 3005; // Node.js server port

// Dynamically set the API base URL
const API_BASE_URL =
  Platform.OS === 'android'
    ? `http://10.0.2.2:${LOCAL_API_PORT}/api/v1` // For Android Emulator
    : `http://localhost:${LOCAL_API_PORT}/api/v1`; // For iOS Simulator or other platforms

// const API_BASE_URL = 'https://ise1backend-production.up.railway.app/api/v1';
// const API_BASE_URL = 'http://10.23.86.204:3005/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000, // 10 seconds timeout
});

const errorFormat = (error: any) => {
  console.error('Register Error:', error?.response?.data);

  let errorMessage = 'Something went wrong. Please try again.'; // Default message
  const errorData = error?.response?.data?.message;

  // Check if `errorData` is an object and find the first key with a non-empty value
  if (errorData && typeof errorData === 'object') {
    const firstNonEmptyKey = Object.keys(errorData).find(
      key => errorData[key]?.trim() !== '',
    );
    errorMessage = firstNonEmptyKey
      ? errorData[firstNonEmptyKey]
      : errorMessage;
  } else if (typeof errorData === 'string') {
    errorMessage = errorData;
  }

  return errorMessage;
};

export const apiCallWithHeader = async (
  path: string,
  method: string,
  body = null,
) => {
  try {
    // Retrieve all stored keys and log them
    const getAllKeys = await AsyncStorage.getAllKeys();
    console.log('Auth', getAllKeys);

    for (let key of getAllKeys) {
      const value = await AsyncStorage.getItem(key);
      console.log(`Key: ${key}, Value: ${value}`);
    }

    // Retrieve auth token
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      return [false, 'Please Login again'];
    }

    // Define request headers
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Choose request method dynamically
    let response;
    if (method === 'GET') {
      response = await api.get(path, {headers});
    } else if (method === 'POST') {
      response = await api.post(path, body, {headers});
    } else {
      throw new Error('Unsupported HTTP method');
    }

    return [true, response];
  } catch (error: any) {
    console.error('Main API Call Error:', error);

    const isSuccess = error?.response?.data?.success;
    // if (!isSuccess) {
    //   logoutApiCall();
    // }

    return [false, errorFormat(error)];
  }
};
