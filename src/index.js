import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ConfigProvider } from 'antd';
import en_US from 'antd/locale/en_US';
import { Provider } from 'react-redux';
import store from './store'; // Import your Redux store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={en_US}>
        <div className="app">
          <App />
        </div>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
