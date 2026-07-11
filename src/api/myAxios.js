import axios from "axios";
import { message } from 'antd'
import NProgress from "nprogress";
import sotre from '../redux/store'
import { createDeleteUserInfoAction } from '../redux/action_creators/login_action'

import 'nprogress/nprogress.css'
import store from "../redux/store";


// 为axios实例添加属性
const instance = axios.create({
    // 配置超时
    timeout: 4000
})

// 请求拦截器
instance.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    // 比如可以根据发送请求的方式method，来判断请求的参数是否需要进行转换

    // 请求进度条开始
    NProgress.start()

    // 从redux中获取之前所保存的token
    const { token } = sotre.getState().userInfo
    // 向请求头中添加token，用于校验身份
    if (token) config.headers.Authorization = 'atguigu_' + token

    //此处应该检查是否携带token，若无则跳转到登录页 
    return config;
}, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

//响应拦截器
instance.interceptors.response.use((response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    NProgress.done()
    return response.data;
}, (err) => {
    // 超出 2xx 范围的状态码都会触发该函数。比如：前端请求不到接口404，未授权401
    // 对响应错误做点什么
    // 一般是前端的错误，很可能是请求地址写错了，此时应该检查代码，api地址等
    // 也可能是请求的过程出现错误

    // 请求进度条结束
    NProgress.done()

    // 根据错误类型自定义提示，以及操作路由（通常401表示无权限，需要登录获取token。一般跳转到登录页）
    if (err.message === 'timeout of 4000ms exceeded') {
        message.error('请求超时！', 2)
    } else {
        // 根据返回的状态码，为401，表示未授权，则跳转至登录页
        if (err.response.status === 401) {
            message.error('身份校验失败，请重新登录', 1)
            store.dispatch(createDeleteUserInfoAction())
        } else {
            // message.error(err.message,1)
        }

    }
    // 如果出错了，就返回一个暂停的promise实例,不需要继续向下传了
    return new Promise(() => { })

    // 如果想要继续将错误传下去，执行
    // return Promise.reject(err);
});

export default instance