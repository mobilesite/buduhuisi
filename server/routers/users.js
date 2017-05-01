const router = require('koa-router')();
const userCtr = require('../controllers/users');

router.prefix('/users');

router.get('/getUser', userCtr.getUser);
router.post('/registerUser', userCtr.registerUser);

module.exports = router;
