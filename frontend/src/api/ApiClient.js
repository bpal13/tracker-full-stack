import axios from 'axios';

const url = import.meta.env.VITE_API_URL;

export const apiPublic = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 1000,
  withCredentials: true,
});

export const apiPrivate = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export function MeoApiClient() {}
