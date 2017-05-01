let router = require('koa-router')();
const usersCtr = require('../../controllers/users');

router.get('/getUser', usersCtr.getUser);
router.post('/registerUser', usersCtr.registerUser);

module.exports = router;