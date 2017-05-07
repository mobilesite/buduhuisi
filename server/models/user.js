/**
 * Created by milon on 2017/5/4.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义一个userSchema
const userSchema = new Schema({
    realName: {
        type: String,
        required: true
    },
    username:  {
        type: String,
        required: true
    },
    password:  {
        type: String,
        required: true
    },
    avatar: String,
    createTime:  {
        type: String,
        required: true
    }
}, { versionKey: false });

// 将userSchema发布成一个model——User
module.exports = mongoose.model('User', userSchema);