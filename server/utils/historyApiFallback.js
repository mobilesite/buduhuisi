/**
 * Created by milon on 2017/5/6.
 */

const url = require('url');
const historyApiFallBack = require('connect-history-api-fallback');

module.exports = (options) => {
    const expressMiddleware = historyApiFallBack(options);

    return (ctx, next) => {
        let parseUrl = url.parse(ctx.req.url);

        // 添加path match，让不匹配的路由可以直接穿过中间件
        if(!parseUrl.pathname.match(options.path)) {
            return next();
        }

        // 修改content-type
        ctx.type = 'html'; // ?? 为什么要修改这个呢
        return expressMiddleware(ctx.req, ctx.res, next);
    }
};