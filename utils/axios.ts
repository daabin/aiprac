import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.aiprac.net',
  maxBodyLength: Infinity,
  timeout: 1000 * 60 * 3,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance