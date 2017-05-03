const Koa = require('koa');
const app = new Koa();
const path = require('path');
const views = require('koa-views');
const json = require('koa-json');
// const logger = require('koa-logger');
const onError = require('koa-onerror');
const bodyParser = require('koa-bodyparser');
const staticServe = require('koa-static');
const logUtil = require('./utils/logUtil');
const responseFormatter = require('./utils/responseFormatter/main');

const rootPath = path.resolve(__dirname);
const pathJoin = path.join;

// error handler
onError(app);

// middle wares
// app.use(logger());

// logger
app.use(async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    //请求处理完毕的时刻 减去 开始处理请求的时刻 = 处理请求所花掉的时间
    let ms;
    try {
        //开始进入到下一个中间件
        await next();

        ms = new Date() - start;
        //记录响应日志
        logUtil.logResponse(ctx, ms);
    } catch (error) {

        ms = new Date() - start;
        //记录异常日志
        logUtil.logError(ctx, error, ms);
    }
});

app.use(bodyParser());
app.use(json());
app.use(staticServe( pathJoin(rootPath, '/public') ));
app.use(views( pathJoin(rootPath, '/views'), {
    extension: 'jade' //给你的view文件设定默认的文件扩展名
}));
app.use(responseFormatter(/^\/api/));

// logger 输出每个请求的方法、地址和所花费的时间
// app.use(async (ctx, next) => {
//     const start = new Date();
//     await next();
//     const ms = new Date() - start;
//     console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// });

// pages routes
const indexRt = require('./routers/index');
app.use(indexRt.routes(), indexRt.allowedMethods());

// api routes
const apiRt = require('./routers/api/main');
app.use(apiRt.routes(), apiRt.allowedMethods());

module.exports = app;
