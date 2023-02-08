import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AINCRenderer } from './renderer';

export default AINCRenderer;

//TODO: There has to be a less clumsy way of doing this
const RUN_AS_TEST_APP = false;

if (RUN_AS_TEST_APP) {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}