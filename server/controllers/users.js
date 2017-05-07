const md5 = require('md5');
const jwt = require('jsonwebtoken');
const UserMdl = require('../models/user');
const config = require('../config/env/main');

const ApiError = require('../utils/responseFormatter/ApiError');
const apiErrorNames = require('../utils/responseFormatter/apiErrorNames');

// 初始化用户
module.exports.initUser = async (ctx, next) => {
    let user = await UserMdl.find().exec().catch(err => {
        console.log(err);
    });

    if (user.length === 0) {
        // 目前还没做修改密码的功能，因为是单用户系统觉得需求不大
        // 如果想更换用户名／密码，先将数据库原有user删除(drop)
        // 配置中加入用户名密码，重启服务即可

        // 通过UserMdl这一Module创建一个Entity（实体）
        user = new UserMdl({
            realName: config.dbRealName,
            username: config.dbUsername,
            password: md5(config.dbPassword).toUpperCase(),
            avatar: '',
            createTime: new Date()
        });
        await user.save().catch(err => {
            console.log(err);
        });
    }
}

// 用户登陆
module.exports.login = async (ctx, next) => {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;

    let user = await UserMdl.findOne({
        username
    }).exec();

    if (user !== null) {
        if (user.password === password) {
            const token = jwt.sign({
                uid: user._id,
                name: user.name,
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 //1 hours
            }, config.jwtSecret);

            ctx.body = {
                success: true,
                uid: user._id,
                name: user.name,
                token: token
            };
        } else {
            ctx.throw(401, '密码错误');
        }
    } else {
        ctx.throw(401, '用户名错误');
    }
}

// 新用户注册
module.exports.getUser = async (ctx, next) => {
    // 故意抛出一个API异常，用于测试
    // if(ctx.query.id != 1){
    //     throw new ApiError(apiErrorNames.USER_NOT_EXIST);
    // }
    ctx.body = {
        username: '拍岸',
        age: 18
    }
}

// 用户注册
module.exports.registerUser = async (ctx, next) => {
    console.log('registerUser', ctx.request.body);
}
