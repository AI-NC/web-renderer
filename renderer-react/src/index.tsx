/**
 * React Renderer - index.tsx
 * 
 * This React app contains AI-NC's web based .golf renderer.
 * It can be run as a demo application with using 'npm run start'
 * 
 * Copyright (c) 2023 AI-NC
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AINCRenderer } from './renderer';

// Export the renderer so when built locally it can be turned into the NPM package
export default AINCRenderer;

// Start up the simple test application
// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement,
);