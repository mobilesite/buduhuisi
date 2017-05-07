/**
 * 开发环境的配置
 */
module.exports = {
    env: 'development',       // 环境名称
    port: 3001,               // 服务器端口号
    dbUrl: 'mongodb://localhost:27017/buduhuisi', // 数据库地址
    dbRealName: '拍岸',       // 数据库用户真实姓名
    dbUsername: 'admin',      // 数据库用户名
    dbPassword: '123',        // 数据库密码
    redisUrl: '',             // redis地址
    redisPort: '',            // redis端口号
    apiBasePath: '\/api',     // API的基路径
    jwtSecret: 'me',          // JSONWEBTOKEN密码
    adminInitUser: 'admin',   // 后台初始化的用户名
    adminInitPassword: '123'  // 后台初始化的密码
}