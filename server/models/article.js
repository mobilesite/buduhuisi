/**
 * Created by milon on 2017/5/6.
 */
const mongoose = require('mongoose');
const moment = require('moment'); // http://momentjs.cn/
require('moment/locale/zh-cn');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    abstract: String,
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    publish: {
        type: Boolean,
        default: false
    },
    createTime: {
        type: Date,
        required: true
    },
    lastEditTime: {
        type: Date,
        default: Date.now()
    },
},
{
    versionKey: false
});
ArticleSchema.set('toJSON', { getters: true, virtuals: true });
ArticleSchema.set('toObject', { getters: true, virtuals: true });
ArticleSchema.path('createTime').get(function(v) {
    return moment(v).format('lll');
});
ArticleSchema.path('lastEditTime').get(function(v) {
    return moment(v).format('lll');
});

module.exports = mongoose.model('Article', ArticleSchema);



