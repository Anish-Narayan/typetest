import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure this path is correct
// If you've moved App.js directly into src/pages, this would be: import App from './pages/HomePage';
// However, based on our structure, App.js should be in src/ and render HomePage.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);