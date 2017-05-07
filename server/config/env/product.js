/**
 * 生产环境的配置
 */
module.exports = {
    env: 'product',
    port: 80,                 // 服务器端口号
    dbUrl: 'mongod://localhost/buduhuisi', // 数据库地址
    dbRealName: '拍岸',       // 数据库用户真实姓名
    dbUsername: 'admin',          // 数据库用户名
    dbPassword: '123',        // 数据库密码
    redisUrl: '',             // redis地址
    redisPort: '',            // redis端口号
    apiBasePath: '\/api',     // API的基路径
    jwtSecret: 'me',          // JSONWEBTOKEN密码
    adminInitUser: 'admin',   // 后台初始化的用户名
    adminInitPassword: '123'  // 后台初始化的密码
}