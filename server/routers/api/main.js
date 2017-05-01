/**
 * 将所有API router集合在一起，并在其访问路径前面添加一个前缀api
 */

let router = require('koa-router')();
const userRt = require('./users');

router.prefix('/api'); // 添加前缀

router.use('/users', userRt.routes(), userRt.allowedMethods());

module.exports = router;