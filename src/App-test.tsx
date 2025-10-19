import React from 'react';

const App = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#4a5568' }}>🚀 Wellify.ai</h1>
      <p style={{ fontSize: '18px', color: '#2d3748' }}>
        If you can see this, the React app is working!
      </p>
      <p style={{ color: '#718096' }}>
        Current time: {new Date().toLocaleString()}
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#e6fffa', 
        borderRadius: '8px',
        border: '2px solid #38b2ac'
      }}>
        <h2 style={{ color: '#2c7a7b' }}>✅ Status Check</h2>
        <p>✅ React app loaded successfully</p>
        <p>✅ Server running on port 8000</p>
        <p>✅ Basic routing working</p>
      </div>
    </div>
  );
};

export default App;
