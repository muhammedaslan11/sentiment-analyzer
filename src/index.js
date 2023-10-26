import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App2';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
  () => {
    document.title = 'Sentiment Analyzer'; // Burada istediğiniz başlığı belirleyebilirsiniz
  }
);

reportWebVitals();