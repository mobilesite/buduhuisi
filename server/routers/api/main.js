/**
 * 将所有API router集合在一起，并在其访问路径前面添加一个前缀api
 */
const envConfig = require('../../config/env/main');

let router = require('koa-router')();
const usersRt = require('./users');
const tagsRt = require('./tags');
const articlesRt = require('./articles');

router.prefix(envConfig.apiBasePath); // 添加前缀

router.use('/users', usersRt.routes(), usersRt.allowedMethods());
router.use('/tags', tagsRt.routes(), tagsRt.allowedMethods());
router.use('/articles', articlesRt.routes(), articlesRt.allowedMethods());

module.exports = router;