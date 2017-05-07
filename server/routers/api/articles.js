/**
 * Created by milon on 2017/5/6.
 */
let router = require('koa-router')();
const articlesCtr = require('../../controllers/articles');
const verifyAuth =  require('../../utils/verifyAuth');

router.get('/articles', verifyAuth, articlesCtr.getAllArticles)
    .post('/articles', verifyAuth, articlesCtr.createArticle)
    .patch('/articles/:id', verifyAuth, articlesCtr.modifyArticle)
    .get('/articles/:id', articlesCtr.getArticle)
    .delete('/articles/:id', verifyAuth, articlesCtr.deleteArticle)
    .get('/publishArticles', articlesCtr.getAllPublishArticles);

module.exports = router;