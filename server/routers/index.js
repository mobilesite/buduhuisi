let router = require('koa-router')();

router.get('/', async (ctx, next) => {
    ctx.state = {
        title: '不读会死'
    };

    await ctx.render('index', {});
})

router.get('/my', async (ctx, next) => {
    await ctx.render('my', {
        title: '我'
    });
});

module.exports = router;
