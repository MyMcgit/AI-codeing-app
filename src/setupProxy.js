// 用于开发时跨域使用，当有多个代理时，按如下配置即可

//http-proxy-middleware低版本配置
// const proxy = require('http-proxy-middleware');
//http-proxy-middleware高版本配置
const {createProxyMiddleware: proxy} = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
        [proxy('/api1',{
            target:'http://localhost:4000',
            changeOrigin:true,
            pathRewrite:{'^/api1':''}
        }),
        proxy('/api2',{
            target:'https://restapi.amap.com',
            changeOrigin:true,
            pathRewrite:{'^/api2':''}
        })]
    )
}
