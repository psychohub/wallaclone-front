import axios from 'axios';

const getBaseURL = (): string => {
  if (process.env.NODE_ENV === 'test') {
    return 'http://localhost:3000';
  }
  
  if (typeof window !== 'undefined' && window.__VITE_API_URL__) {
    return window.__VITE_API_URL__;
  }
  
  return 'http://localhost:3000';
};

const instance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;