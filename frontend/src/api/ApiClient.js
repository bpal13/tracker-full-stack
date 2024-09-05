import axios from 'axios';

const url2 = 'https://api.bpal.duckdns.org'

export const apiPublic = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 1000,
  withCredentials: true,
});

export const apiPrivate = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export function MeoApiClient() {}
