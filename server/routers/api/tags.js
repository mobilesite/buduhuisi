/**
 * Created by milon on 2017/5/6.
 */
let router = require('koa-router')();
const tagsCtr = require('../../controllers/tags');
const verifyAuth = require('../../utils/verifyAuth');

router.post('/tags', verifyAuth, tagsCtr.createTag)
    .get('/tags', tagsCtr.getAllTags)
    .patch('/tags/:id', verifyAuth, tagsCtr.modifyTag)
    .delete('/tags/:id', verifyAuth, tagsCtr.deleteTag);

module.exports = router;
