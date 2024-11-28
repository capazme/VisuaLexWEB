// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import theme from './theme/theme'; // Import del tema personalizzato
import 'antd/dist/reset.css'; // Stili di Ant Design (v5)
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

// Se desideri misurare le performance
reportWebVitals();
