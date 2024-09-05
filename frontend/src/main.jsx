import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import { CardProvider } from './context/CardProvider.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CardProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CardProvider>
    </AuthProvider>
  </React.StrictMode>
);
