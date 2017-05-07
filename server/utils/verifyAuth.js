/**
 * 验证是否登陆
 */
const jwt = require('jsonwebtoken');
const envConfig = require('../config/env/main');

module.exports = async (ctx, next) => {
    const authorization = ctx.get('Authorization');
    if (authorization === '') {
        ctx.throw(401, 'no token detected in http header \'Authorization\'');
    }

    const token = authorization.split(' ')[1];
    let tokenContent;
    try {
        tokenContent = await jwt.verify(token, envConfig.jwtSecret);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            ctx.throw(401, 'token expired，请及时本地保存数据！');
        }
        ctx.throw(401, 'invalid token');
    }

    console.log("鉴权成功");
    await next();
}
