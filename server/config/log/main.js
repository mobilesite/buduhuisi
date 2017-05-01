const path = require('path');
const pathResolve = path.resolve;
const pathJoin = path.join;
const rootPath = pathResolve(__dirname);

//日志根目录
const baseLogPath = pathResolve(__dirname, '../../logs')

//错误日志目录
const errorPath = "/error";
//错误日志文件名
const errorFileName = "error";
//错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + "/" + errorFileName;

//响应日志目录
const responsePath = "/response";
//响应日志文件名
const responseFileName = "response";
//响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + "/" + responseFileName;

module.exports = {
    // 定义两个输出源（appenders）
    "appenders": [
        // 错误日志
        {
            "category":"errorLogger",             //logger名称
            "type": "dateFile",                   //日志类型
            "filename": errorLogPath,             //日志输出位置
            "alwaysIncludePattern":true,          //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
            "path": errorPath                     //自定义属性，错误日志的根目录
        },
        // 响应日志
        {
            "category":"resLogger",
            "type": "dateFile",
            "filename": responseLogPath,
            "alwaysIncludePattern":true,
            "pattern": "-yyyy-MM-dd-hh.log",
            "path": responsePath
        }
    ],
    //设置logger名称对应的的日志等级
    "levels": {
        "errorLogger": "ERROR",
        "resLogger": "ALL"
    },
    //设置log输出的根目录
    "baseLogPath": baseLogPath
}