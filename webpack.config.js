const fs = require('fs');

module.exports = {
    devServer: {
        https: {
            key: fs.readFileSync('./mkcert/cert.key'), // 私钥路径
            cert: fs.readFileSync('./mkcert/cert.crt') // 证书路径
        },
    }
};