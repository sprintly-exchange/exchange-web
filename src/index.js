import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional: for global styles
import App from './App'; // Main App component
import './global.css';
import './components/utils/App.less';
import { GoogleOAuthProvider } from '@react-oauth/google';


// Rendering the App component into the root div
const applyStoredColors = () => {
  const storedColors = sessionStorage.getItem('appColors');
  if (storedColors) {
    const colors = JSON.parse(storedColors);
    Object.keys(colors).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, colors[key]);
    });
  }
};

applyStoredColors();

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="<318373981333-lu7p3vjpnjaf5vng9e5l302mh3qn57s4.apps.googleusercontent.com>">
      </GoogleOAuthProvider>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);