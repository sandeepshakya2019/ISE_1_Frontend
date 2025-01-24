import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005/api/v1'; // Replace with your actual API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});