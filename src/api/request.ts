import axios from 'axios';
import { message } from 'ant-design-vue';
import { useAuthStore } from '@/stores/auth';

const instance = axios.create({
  timeout: 4000,
});

// 请求拦截器
instance.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = 'atguigu_' + authStore.token;
  }
  return config;
});

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (err) => {
    if (err.message === 'timeout of 4000ms exceeded') {
      message.error('请求超时！', 2);
    } else if (err.response?.status === 401) {
      message.error('身份校验失败，请重新登录', 1);
      const authStore = useAuthStore();
      authStore.deleteUserInfo();
    }
    return new Promise(() => {});
  }
);

export default instance;
