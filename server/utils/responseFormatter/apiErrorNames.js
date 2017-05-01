/**
 * API错误名称
 */
let apiErrorNames = {};

apiErrorNames.UNKNOWN_ERROR = 'unknownError';
apiErrorNames.USER_NOT_EXIST = 'userNotExist';

/**
 * API错误名称对应的错误信息
 */
const errorMap = new Map();

errorMap.set(apiErrorNames.UNKNOWN_ERROR, { code: -1, message: '未知错误' });
errorMap.set(apiErrorNames.USER_NOT_EXIST, { code: 101, message: '用户不存在' });

// 根据错误名称获取错误信息
apiErrorNames.getErrorInfo = (errorName) => {
    let errorInfo;

    if (errorName) {
        errorInfo = errorMap.get(errorName);
    }

    // 如果没有对应的错误信息，默认'未知错误'
    if (!errorInfo) {
        errorName = apiErrorNames.UNKNOWN_ERROR;
        errorInfo = errorMap.get(errorName);
    }

    return errorInfo;
}

module.exports = apiErrorNames;