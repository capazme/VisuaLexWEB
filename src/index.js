// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';          // Stili di Ant Design (v5)
import 'rsuite/dist/rsuite.min.css';   // Stili di React Suite
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Se desideri misurare le performance
reportWebVitals();
