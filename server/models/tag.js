/**
 * Created by milon on 2017/5/6.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TagSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

TagSchema.set('toJSON', {getters: true, virtuals: true});
TagSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('Tag', TagSchema);