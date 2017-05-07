/**
 * Created by milon on 2017/5/6.
 */
const ArticleMdl = require('../models/article');

module.exports.createArticle = async (ctx, next) => {
    const requestBody = ctx.request.body;

    const title = requestBody.title;
    const content = requestBody.content;
    const abstract = requestBody.abstract;
    const publish = requestBody.publish;
    const tags = requestBody.tags;
    const createTime = new Date();
    const lastEditTime = new Date();

    if (!title) {
        ctx.throw(400, '标题不能为空')
    }
    if (!content) {
        ctx.throw(400, '文章内容不能为空')
    }
    if (!abstract) {
        ctx.throw(400, '摘要不能为空')
    }
    const article = new ArticleMdl({
        title,
        content,
        abstract,
        publish,
        tags,
        createTime,
        lastEditTime
    });
    let createResult = await article.save().catch(err => {
        ctx.throw(500, '服务器内部错误');
    });
    await ArticleMdl.populate(createResult, { path: 'tags' }, function(err, result) {
        createResult = result;
    });
    console.log('文章创建成功');
    ctx.body = {
        success: true,
        article: createResult
    }
};

module.exports.getAllArticles = async (ctx, next) => {
    const tag = ctx.query.tag;
    const page = +ctx.query.page;
    const limit = +ctx.query.limit || 4;
    let skip = 0;
    let articleArr;
    let allPage;
    let allNum;

    if (page > 0) {
        skip = limit * (page - 1); // 当前目标页之前那些页的文章总条数
    }

    if (!tag) {
        articleArr = await ArticleMdl.find()
            .populate('tags')
            .sort({ createTime: -1 })
            .limit(limit)
            .skip(skip).catch(err => {
                ctx.throw(500, '服务器内部错误')
            });
        allNum = await ArticleMdl.count().catch(err => {
            this.throw(500, '服务器内部错误')
        })
    } else {
        let tagArr = tag.split(',')
        // console.log(tagArr)
        articleArr = await ArticleMdl.find({
            tags: { '$in': tagArr },
        })
            .populate('tags')
            .sort({ createTime: -1 })
            .limit(limit)
            .skip(skip).catch(err => {
                ctx.throw(500, '服务器内部错误')
            });
        allNum = await ArticleMdl.find({
            tags: { '$in': tagArr }
        }).count().catch(err => {
            ctx.throw(500, '服务器内部错误')
        })
    }
    allPage = Math.ceil(allNum / limit); // 计算分页数
    ctx.body = {
        success: true,
        articleArr,
        allPage: allPage
    }
};

module.exports.getAllPublishArticles = async (ctx, next) => {
    const tag = ctx.query.tag;
    const page = +ctx.query.page;
    const limit = +ctx.query.limit || 4;
    let skip = 0;
    let articleArr;
    let allPage;
    let allNum;

    if (page !== 0) {
        skip = limit * (page - 1);
    }

    console.log(11111111);

    if (!tag) {
        articleArr = await ArticleMdl.find({publish: true})
            .populate("tags")
            .sort({ createTime: -1 })
            .limit(limit)
            .skip(skip)
            .catch(err => {
                ctx.throw(500, '服务器内部错误')
            });
        allNum = await ArticleMdl.find({
            publish: true
        })
            .count()
            .catch(err => {
                this.throw(500, '服务器内部错误')
            });
    } else {
        let tagArr = tag.split(',');
        // console.log(tagArr)
        articleArr = await ArticleMdl.find({
            tags: { "$in": tagArr },
            publish: true
        })
            .populate("tags")
            .sort({ createTime: -1 })
            .limit(limit)
            .skip(skip).catch(err => {
                ctx.throw(500, '服务器内部错误')
            });
        allNum = await ArticleMdl.find({
            tags: { "$in": tagArr }
        }).count().catch(err => {
            ctx.throw(500, '服务器内部错误')
        })
    }

    allPage = Math.ceil(allNum / limit)

    ctx.body = {
        success: true,
        articleArr,
        allPage: allPage
    };
};

module.exports.modifyArticle = async (ctx, next) => {
    // console.log(ctx.request.body)
    const id = ctx.params.id;
    const title = ctx.request.body.title;
    const content = ctx.request.body.content;
    const abstract = ctx.request.body.abstract;
    const tags = ctx.request.body.tags;
    if (title == '') {
        ctx.throw(400, '标题不能为空')
    }
    if (content == '') {
        ctx.throw(400, '文章内容不能为空')
    }
    if (abstract == '') {
        ctx.throw(400, '摘要不能为空')
    }
    /*if (tags.length === 0) {
     ctx.throw(400, '标签不能为空')
     }*/
    const article = await ArticleMdl.findByIdAndUpdate(id, { $set: ctx.request.body }).catch(err => {
        if (err.name === 'CastError') {
            ctx.throw(400, 'id不存在');
        } else {
            ctx.throw(500, '服务器内部错误')
        }
    });
    ctx.body = {
        success: true
    };
};

module.exports.getArticle = async (ctx, next) => {
    const id = ctx.params.id;
    if (id == '') {
        ctx.throw(400, 'id不能为空')
    }
    /*if (tags.length === 0) {
     ctx.throw(400, '标签不能为空')
     }*/
    const article = await ArticleMdl.findById(id).catch(err => {
        if (err.name === 'CastError') {
            ctx.throw(400, 'id不存在');
        } else {
            ctx.throw(500, '服务器内部错误')
        }
    });
    ctx.body = {
        success: true,
        article: article
    };
};

module.exports.deleteArticle = async (ctx) => {
    const id = ctx.params.id;
    const article = await ArticleMdl.findByIdAndRemove(id).catch(err => {
        if (err.name === 'CastError') {
            this.throw(400, 'id不存在');
        } else {
            this.throw(500, '服务器内部错误')
        }
    });
    ctx.body = {
        success: true
    };
};

module.exports.publishArticle = async (ctx) => {
    const id = ctx.params.id;
    const article = await ArticleMdl.findByIdAndUpdate(id, { $set: { publish: true } }).catch(err => {
        if (err.name === 'CastError') {
            this.throw(400, 'id不存在');
        } else {
            this.throw(500, '服务器内部错误')
        }
    });
    ctx.body = {
        success: true
    };
};

module.exports.notPublishArticle = async (ctx) => {
    const id = ctx.params.id;
    const article = await ArticleMdl.findByIdAndUpdate(id, { $set: { publish: false } }).catch(err => {
        if (err.name === 'CastError') {
            this.throw(400, 'id不存在');
        } else {
            this.throw(500, '服务器内部错误')
        }
    });
    ctx.body = {
        success: true
    };
};
