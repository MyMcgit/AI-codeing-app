// 该文件为项目的配置文件，保存着通用性的配置，以及变量
export const BASE_URL = '' //发送请求基本路经，当前在开发环境，给自己的代理服务器发请求，若项目上线，配置真正服务器地址。
// export const BASE_URL_IMGS = 'http://localhost:4000' //图片请求可以直接跨域，但是为了统一，还是使用统一跨域比较好，后期直接修改即可。
export const BASE_URL_WEATHER='' 
export const CITY = 510100  //天气请求的城市编码，成都
export const WEATHER_AK = 'a9c1f9ab4f54966eb0ef4b7508b696ed' // 天气请求的密匙，我个人的高德
export const PAGE_SIZE =5//表格每页的条数配置
export const PRIMARY = 'rgb(0, 154, 126 )'//主题颜色配置