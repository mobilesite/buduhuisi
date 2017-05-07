/**
 * Created by milon on 2017/5/6.
 */
const TagMdl = require('../models/tag');

module.exports.createTag = async (ctx, next) => {
    const tagName = ctx.request.body.name;

    if (!tagName) {
        ctx.throw(400, '标签名不能为空');
    }
    const tag = await TagMdl.findOne({ name: tagName }).catch(err => {
        ctx.throw(500, '服务器错误')
    });
    console.log(tag);
    if (tag !== null) {
        ctx.body = {
            success: true,
            tag: tag
        };
        return;
    }
    const newTag = new TagMdl({
        name: tagName
    });
    const result = await newTag.save().catch(err => {
        ctx.throw(500, '服务器错误')
    });
    ctx.body = {
        success: true,
        tag: result
    };
};

module.exports.getAllTags = async (ctx, next) => {
    const tagArr = await TagMdl.find().catch(err => {
        ctx.throw(500, '服务器内部错误')
    });
    ctx.body = {
        success: true,
        tagArr
    };
};

module.exports.modifyTag = async (ctx, next) => {
    const id = ctx.params.id;
    const name = ctx.request.body.name;
    if (!name) {
        ctx.throw(400, '标签名不能为空');
    }
    const tag = await TagMdl.findByIdAndUpdate(id, { $set: { name: name } }).catch(err => {
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

module.exports.deleteTag = async (ctx) => {
    const id = ctx.params.id;
    const tag = await TagMdl.findByIdAndRemove(id).catch(err => {
        if (err.name === 'CastError') {
            ctx.throw(400, 'id不存在');
        } else {
            ctx.throw(500, '服务器内部错误');
        }
    });
    ctx.body = {
        success: true
    };
};
