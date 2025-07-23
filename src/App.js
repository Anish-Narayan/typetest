import React from 'react';
import HomePage from './pages/HomePage'; // **Crucially, ensure this path is correct.**
import './App.css'; // This is for global styles, make sure it exists at src/App.css

function App() {
  return (
    // The className="app" defined in App.css should apply global styling
    <div className="app">
      <HomePage />
    </div>
  );
}

export default App;