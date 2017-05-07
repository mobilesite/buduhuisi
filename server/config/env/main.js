const fs = require('fs');
const path = require('path');
const developmentEnv = require('./development');
const testEnv = require('./test');
const productEnv = require('./product');

const rootPath = path.resolve(__dirname);
const privatePath = path.join(rootPath, '/private.js');
const hasPrivate = fs.existsSync(privatePath);

let config = {
    development: developmentEnv,
    test: testEnv,
    product: productEnv
}[process.env.NODE_ENV || 'development'];

if (hasPrivate) {
    config = Object.assign(config, require(privatePath));
}

//根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象
module.exports = config;