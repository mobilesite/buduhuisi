const apiErrorNames = require('./apiErrorNames');

/**
 * 自定义Api异常
 */
class ApiError extends Error{
    //构造方法
    constructor(errorName){
        super();

        const errorInfo = apiErrorNames.getErrorInfo(errorName);

        this.name = errorName;
        this.code = errorInfo.code;
        this.message = errorInfo.message;
    }
}

module.exports = ApiError;