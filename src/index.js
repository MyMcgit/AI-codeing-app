import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { PRIMARY } from './config';
import App from './App';

import { Provider } from 'react-redux';
import store from './redux/store'
// 自定义主体：采用ConfigProvider组件和theme
const defaultData = {
    borderRadius: 6,
    colorPrimary: PRIMARY,
};
// console.log('process.env.NODE_ENV', process.env.NODE_ENV)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( <
    React.StrictMode >
    <
    Provider store = { store } >
    <
    BrowserRouter >
    <
    ConfigProvider theme = {
        {
            token: {
                colorPrimary: defaultData.colorPrimary,
                borderRadius: defaultData.borderRadius,
            },
        }
    } >
    <
    App / >
    <
    /ConfigProvider> < /
    BrowserRouter > <
    /Provider> < /
    React.StrictMode >
);