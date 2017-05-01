const ApiError = require('../utils/responseFormatter/ApiError');
const apiErrorNames = require('../utils/responseFormatter/apiErrorNames');

// 新用户注册
exports.getUser = async (ctx, next) => {
    // 故意抛出一个API异常，用于测试
    if(ctx.query.id != 1){
        throw new ApiError(apiErrorNames.USER_NOT_EXIST);
    }
    ctx.body = {
        username: '拍岸',
        age: 18
    }
}

// 用户注册
exports.registerUser = async (ctx, next) => {
    console.log('registerUser', ctx.request.body);
}
