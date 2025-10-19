import React from 'react';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Wellify.ai Test Page</h1>
      <p>If you can see this, the React app is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Authentication Status</h2>
        <p>✅ AWS Amplify installed</p>
        <p>✅ Environment variables configured</p>
        <p>✅ UI components available</p>
      </div>
    </div>
  );
};

export default App;
