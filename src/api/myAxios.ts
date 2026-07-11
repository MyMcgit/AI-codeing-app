import axios from 'axios';
import { message } from 'antd';
import NProgress from 'nprogress';
import { useAppStore } from '../store';

import 'nprogress/nprogress.css';

// 为axios实例添加属性
const instance = axios.create({
  // 配置超时
  timeout: 4000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 请求进度条开始
    NProgress.start();

    // 从zustand中获取之前所保存的token
    const { token } = useAppStore.getState().userInfo;
    // 向请求头中添加token，用于校验身份
    if (token) config.headers.Authorization = 'atguigu_' + token;

    // 此处应该检查是否携带token，若无则跳转到登录页
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    NProgress.done();
    return response.data;
  },
  (err) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    NProgress.done();

    // 根据错误类型自定义提示
    if (err.message === 'timeout of 4000ms exceeded') {
      message.error('请求超时！', 2);
    } else {
      // 根据返回的状态码，为401，表示未授权，则跳转至登录页
      if (err.response?.status === 401) {
        message.error('身份校验失败，请重新登录', 1);
        useAppStore.getState().deleteUserInfo();
      }
    }
    // 如果出错了，就返回一个暂停的promise实例,不需要继续向下传了
    return new Promise(() => {});
  }
);

export default instance;
