/**
 * Created by milon on 2017/5/7.
 */
require('babel-core/register')({
    presets: ['es2015', 'stage-2']
});
require('babel-polyfill');

module.exports = require('./index');