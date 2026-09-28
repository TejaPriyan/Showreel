import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { STAGE_RATIO } from './config.js';
import './styles.css';

document.documentElement.style.setProperty('--stage-ratio', String(STAGE_RATIO));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
