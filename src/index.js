import React from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';

// Placeholder App component. 
// In Phase 9, this will be replaced/wrapped by the high-level orchestration container.
const App = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Medieval Organum Generator</h1>
      <p>System initialized. Awaiting Phase 2 implementation.</p>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
