const developmentEnv = require('./development');
const testEnv = require('./test');

//根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象
module.exports = {
    development: developmentEnv,
    test: testEnv
}[process.env.NODE_ENV || 'development']