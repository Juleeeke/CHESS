
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This is a workaround since we're using CDNs in a modern React setup.
// In a real build environment, these would be imported from node_modules.
window.React = React;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
