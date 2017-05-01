/**
 * 对response进行格式化处理的中间件
 * 在app.use(router)之前调用
 *
 * @param {RegEXP} pattern - 通过这个正则表达式来匹配对哪些路径需要应用responseFormatter
 */

const ApiError = require('./ApiError');

let responseFormatter = (ctx) => {
    // 如果有返回数据，将返回数据放入data属性中，同时增加code和message字段
    if (ctx.body) {
        ctx.body = {
            code: 0,
            message: 'success',
            data: ctx.body
        }
    } else {
        ctx.body = {
            code: 0,
            message: 'success'
        }
    }
};

module.exports = (pattern) => {
    return async function(ctx, next){
        let isMatched = pattern.test(ctx.originalUrl);

        // 这里使用try catch包裹await next();，这样后面的中间件抛出的异常都可以在这里集中处理
        try {
            // 先去执行路由
            await next();
        } catch (e) {
            // 如果异常类型是ApiError并且通过正则匹配的url，将错误信息添加到响应体中返回。
            if (e instanceof ApiError && isMatched) {
                ctx.status = 200;
                ctx.body = {
                    code: e.code,
                    message: e.message
                }
            }

            // 继续抛出错误，让外层的日志处理中间件能够记录错误日志
            throw e;
        }

        // 对于通过了正则检测的url进行response的格式化处理
        if(isMatched){
            responseFormatter(ctx);
        }
    }
};