import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { PRIMARY } from './config';
import App from './App';

// 自定义主体：采用ConfigProvider组件和theme
const defaultData = {
  borderRadius: 6,
  colorPrimary: PRIMARY,
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: defaultData.colorPrimary,
            borderRadius: defaultData.borderRadius,
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
