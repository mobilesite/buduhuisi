## 用Koa 2搭建服务器

### 一、初始化项目

在buduhuisi根目录下执行如下命令，初始化出来一个server文件夹，其中放置的内容是一个koa项目，我们在此基础上开发项目的服务端程序。

```
npm i -g koa-generator
koa2 server
npm i
```

### 二、熟悉用到的各种中间件


#### koa-logger

Development style logger middleware for koa。

详见[https://www.npmjs.com/package/koa-logger](https://www.npmjs.com/package/koa-logger)

```
const logger = require('koa-logger');
app.use(logger());
```

建议把`app.use(logger());`放在其它的中间件被`app.use(...)`之前。

#### koa-views

koa-view 是用在koa上的模板渲染中间件。详见[官方文档](https://www.npmjs.com/package/koa-views)

使用：

```
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');

// Must be used before any router is used
app.use(views(__dirname + '/views', {
    extension: 'jade',
    map: {
        html: 'underscore'
    },
    engineSource: {
        foo: () => Promise.resolve('bar')
    },
    options: {
        helpers: {
            uppercase: (str) => str.toUpperCase()
        },
        partials: {
            subTitle: './my-partial' // requires ./my-partial.hbs
        }
    }
}));
```

注意：`app.use(views(...))`的执行必须在router之前。

可以看到，koa-views在使用的时候包含两个参数options：

一个是root，指明view文件的绝对路径（注意这里不能用相对路径）；

另一个是opt，这里面又包含着四个配置项：

- 1. extension，用于指明view文件的默认后缀名。

- 2. map，指明后缀名为某种类型的文件采用何种引擎进行处理。如上例中即指明后缀为.html的文件使用underscore引擎进行处理。

- 3. engineSource，指明后缀名为某类型的文件采用某engine source来进行处理，替换掉默认的engine source —— consolidate。上例中表示所有以.foo为后缀的文件会被返回'bar'。

- 4. options，这是传入helpers和partials的地方，这些options会被传入到view engine中。

开启koa-views的debug模式：

在启动koa服务的时候添加一个 DEBUG=koa-views 环境变量。

#### koa-json

美观的输出JSON response的Koa中间件，详见[https://www.npmjs.com/package/koa-json](https://www.npmjs.com/package/koa-json)。

有两种使用方式：

一种是总是返回美化了的json数据：

```
const json = require('koa-json');
app.use(json());
```

另一种是默认不进行美化，但是当地址栏传入pretty参数的时候，则返回的结果是进行了美化的。

```
app.use(json({ pretty: false, param: 'pretty' }));
```

这样的话，当访问时带上?pretty的时候就返回美化过的结果。

#### koa-onerror

 是koa的错误处理中间件。详见[https://www.npmjs.com/package/koa-onerror](https://www.npmjs.com/package/koa-onerror)

```
const onerror = require('koa-onerror');
onerror(app);
```

onerror还可以传入第二个参数：option，其中包含如下几个配置项：

all: if option.all exist, ignore negotiation
text: text error handler
json: json error handler
html: html error handler
redirect: if accepct html, can redirect to another error page

koa-onerror 会自动地把err.status当作response的status code, 而且自动地把err.headers当作response的headers。

#### koa-bodyparser

一个koa的body parser，详见[https://www.npmjs.com/package/koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser)

使用:

```
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
app.use(async ctx => {
  // 用了`app.use(bodyParser());`之后，the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body;
});
```

`bodyParser()`中可以传入一个参数option，其中可包含如下这些配置项：

- 1. enableTypes: bodyParser只有在请求的类型匹配enableTypes（默认为['json', 'form']）的时候才会工作。

- 2. encode: requested encoding. 默认是utf-8

- 3. formLimit: the urlencoded body的大小限制。如果超出大小限制，将会返回413错误码。默认的限制大小是56kb。

- 4. jsonLimit: limit of the json body. Default is 1mb.

- 5. textLimit: limit of the text body. Default is 1mb.

- 6. strict: when set to true, JSON parser will only accept arrays and objects. Default is true. In strict mode, ctx.request.body will always be an object(or array), this avoid lots of type judging. But text body will always return string type.

- 7. detectJSON: 自定义 json request 检测函数。 Default is null.

```
app.use(bodyparser({
  detectJSON: function (ctx) {
    return /\.json$/i.test(ctx.path);
  }
}));
```

- 8. extendTypes: support extend types:

```
app.use(bodyparser({
  extendTypes: {
    json: ['application/x-javascript'] // will parse application/x-javascript type body as a JSON string
  }
}));
```

- 9. onerror: support 自定义的 error handle, 如果koa-bodyparser抛出错误异常, 你可以像如下这样来自定义response:

```
app.use(bodyparser({
  onerror: function (err, ctx) {
    ctx.throw('body parse error', 422);
  }
}));
```

- 10. disableBodyParser: you can dynamic disable body parser by set ctx.disableBodyParser = true.

```
app.use(async (ctx, next) => {
  if (ctx.path === '/disable') ctx.disableBodyParser = true;
  await next();
});
app.use(bodyparser());
```

#### koa-static

用于koa的静态文件服务中间件。详见[https://www.npmjs.com/package/koa-static](https://www.npmjs.com/package/koa-static)

使用：

```
const staticServe = require('koa-static');
app.use(staticServe(root, opts));
```

它可以传入两个参数：

一个是root，静态文件的根目录。即只有包含在此根目录以内的文件才会提供静态服务。

另一个是option，其中包含如下配置项：

- 1. maxage

浏览器缓存的最大时间（max-age），单位是milliseconds（毫秒）。默认为0

- 2. hidden

允许传送隐藏文件，默认为false

- 3. index

Default file name, defaults to 'index.html'

- 4. defer

If true, serves after yield next, allowing any downstream middleware to respond first.

- 5. gzip

当client支持 gzip 而且被请求的文件也有一个以 .gz 为扩展名的文件的时候，自动以所请求文件对应的 .gz 文件进行返回。默认为true

- 6. extensions

Try to match extensions from passed array to search for file when no extension 是合格的 in URL. First found is served. (defaults to false)

#### koa-router

koa路由中间件。

详见[https://www.npmjs.com/package/koa-router](https://www.npmjs.com/package/koa-router)

使用：

- 1、基本用法

```
var Router = require('koa-router');

var router = new Router();

router.get('/', function (ctx, next) {...});

app
  .use(router.routes())
  .use(router.allowedMethods());

```

- 2、router.get|post|put|del|all

```
router
  .get('/', function (ctx, next) {
        ctx.body = 'Hello World!';
  })
  .post('/users', function (ctx, next) {

  })
  .put('/users/:id', function (ctx, next) {

  })
  .del('/users/:id', function (ctx, next) {

  })
  .all('/users/:id', function (ctx, next) {

  });
```

`router.all()` can be used to match against all methods.

- 3、多个中间件例子

```
router.get(
  '/users/:id',
  function (ctx, next) {
    return User.findOne(ctx.params.id).then(function(user) {
      ctx.user = user;
      return next();
    });
  },
  function (ctx) {
    console.log(ctx.user);
    // => { id: 17, name: "Alex" }
  }
);
```

- 4、嵌套路径

```
var forums = new Router();
var posts = new Router();

posts.get('/', function (ctx, next) {...});
posts.get('/:pid', function (ctx, next) {...});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());

// responds to "/forums/123/posts" and "/forums/123/posts/123"
app.use(forums.routes());
```

- 5、路由前缀

```
var router = new Router({
  prefix: '/users'
});

router.get('/', ...); // responds to "/users"
router.get('/:id', ...); // responds to "/users/:id"
```

- 6、重定向

```
router.redirect('/login', 'sign-in');
//其中，'/login'是source，'sign-in'是destination

This is equivalent to:

router.all('/login', function (ctx) {
  ctx.redirect('/sign-in');
  ctx.status = 301;
});
```

- 7、命名路由

```
router.get('user', '/users/:id', function (ctx, next) {
 // ...
});

router.url('/users/:id', {id: 1});
或者：
router.url('user', 3);
// => "/users/3"
```

即：`router.url(name, params)`

- 8、URL parameters

```
router.get('/:category/:title', function (ctx, next) {
  console.log(ctx.params);
  // => { category: 'programming', title: 'how-to-node' }
});
```

命名的route parameters被捕获并添加到ctx.params中（Named route parameters are captured and added to ctx.params）。

### 三、一些其它模块的使用

#### cross-env模块

跨平台配置环境变量的模块。

```
npm install --save-dev cross-env
```

使用：

./node_modules/.bin/cross-env NODE_ENV=development

./node_modules/.bin/cross-env 后面可以紧跟着配置多个不同的环境变量，比如：

./node_modules/.bin/cross-env NODE_ENV=development  DEBUG=*,-not_this

#### debug模块

大概可以把它理解为一个封装过的`console.log()`。详见[https://www.npmjs.com/package/debug](https://www.npmjs.com/package/debug)

可以通过添加环境变量的配置来开启debug模块的使用：

./node_modules/.bin/cross-env DEBUG=*,-not_this DEBUG_COLORS=true

DEBUG_COLORS是用来配置是否以彩色输出debug信息的，默认情况下是开启的。若要将它关闭，配置环境变量DEBUG_COLORS=false即可。

#### nodemon模块

**nodemon的作用是在你的服务正在运行的情况下，修改文件可以自动重启服务。**

```
npm install --save-dev nodemon
```

#### log4js模块

上文中已经讲到过koa-logger这个中间件，它是tj大神写的koa开发时替换console.log输出的一个插件。不过，如果你需要按照时间或者按照文件大小，本地输出log文件的话，建议还是采用log4js。

```
npm install log4js
```

下面，我们来编写程序记录服务器的服务日志：

首先，我们先在server目录下新建一个utils文件夹，再在文件夹中添加一个文件——logUtil.js，内容如下：

```
const log4js = require('log4js');
const fs = require('fs');

const logConfig = require('../config/log/main'); // 加载配置文件

log4js.configure(logConfig); // 将配置添加到log4js中

let logUtil = {};

// 确定目录是否存在，如果不存在则创建目录
const createPath = (pathStr) => {
    if(!fs.existsSync(pathStr)){
        fs.mkdirSync(pathStr);
        console.log(`createPath:${pathStr}`);
    }
};

// 初始化log相关目录
const initLogPath = () => {
    //创建log的根目录'logs'
    if(logConfig.baseLogPath){
        //创建log根目录
        createPath(logConfig.baseLogPath);

        //根据不同的logType创建不同的子目录
        logConfig.appenders.map((item) => {
            if(item.path){
                createPath(logConfig.baseLogPath + item.path);
            }
        });
    }
};

// 自动初始化log输出所需要的目录
initLogPath();

const errorLogger = log4js.getLogger('errorLogger');
const resLogger = log4js.getLogger('resLogger');

//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error, resTime));
    }
};

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime));
    }
};

//格式化响应日志
const formatRes = (ctx, resTime) => {
    var logText ='';

    //响应日志开始
    logText += `\n*************** response log start ***************\n`;

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += `response status: ${ctx.status}\n`;

    //响应内容
    logText += `response body: \n ${JSON.stringify(ctx.body)} \n`;

    //响应日志结束
    logText += `*************** response log end ***************\n`;

    return logText;
}

//格式化错误日志
const formatError = (ctx, err, resTime) => {
    var logText = '';

    //错误信息开始
    logText += `\n*************** error log start ***************\n`;

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += `err name:${err.name}\n`;
    //错误信息
    logText += `err message:${err.message}\n`;
    //错误详情
    logText += `err stack:${err.stack}\n`;

    //错误信息结束
    logText += `*************** error log end ***************\n`;

    return logText;
};

//格式化请求日志
const formatReqLog = (req, resTime) => {
    let logText = '';
    let method = req.method;

    //访问方法
    logText += `request method: ${method}\n`;

    //请求原始地址
    logText += `request originalUrl: ${req.originalUrl}\n`;

    //客户端ip
    logText += `request client ip: ${req.ip}\n`;

    //请求参数
    if (method === 'GET') {
        logText += `request query: ${JSON.stringify(req.query)}\n`;
    } else {
        logText += `request body: \n${JSON.stringify(req.body)}\n`;
    }

    //服务器响应时间
    logText += `response time:${resTime}\n`;

    return logText;
};

module.exports = logUtil;
```

其次，我们再来建立上面引用到的log4js的配置文件——server/config/log/main.js：

```
const path = require('path');
const pathResolve = path.resolve;
const pathJoin = path.join;
const rootPath = pathResolve(__dirname);

//日志根目录
const baseLogPath = pathResolve(__dirname, '../../logs')

//错误日志目录
const errorPath = '/error';
//错误日志文件名
const errorFileName = 'error';
//错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + '/' + errorFileName;

//响应日志目录
const responsePath = '/response';
//响应日志文件名
const responseFileName = 'response';
//响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + '/' + responseFileName;

module.exports = {
    // 定义两个输出源（appenders）
    'appenders': [
        // 错误日志
        {
            'category':'errorLogger',             //logger名称
            'type': 'dateFile',                   //日志类型
            'filename': errorLogPath,             //日志输出位置
            'alwaysIncludePattern':true,          //是否总是有后缀名
            'pattern': '-yyyy-MM-dd-hh.log',      //后缀，每小时创建一个新的日志文件
            'path': errorPath                     //自定义属性，错误日志的根目录
        },
        // 响应日志
        {
            'category':'resLogger',
            'type': 'dateFile',
            'filename': responseLogPath,
            'alwaysIncludePattern':true,
            'pattern': '-yyyy-MM-dd-hh.log',
            'path': responsePath
        }
    ],
    //设置logger名称对应的的日志等级
    'levels': {
        'errorLogger': 'ERROR',
        'resLogger': 'ALL'
    },
    //设置log输出的根目录
    'baseLogPath': baseLogPath
}
```

最后，我们在服务器程序中引入logUtil.js这个文件，并且使用它进行日志的记录。

```
const logUtil = require('./utils/logUtil');

// logger
app.use(async (ctx, next) => {
    //响应开始时间
    const start = Date.now();
    //请求处理完毕的时刻 减去 开始处理请求的时刻 = 处理请求所花掉的时间
    let ms;
    try {
        await next();

        ms = Date.now() - start;

        //记录响应日志
        logUtil.logResponse(ctx, ms);
    } catch (error) {
        ms = Date.now() - start;

        //记录异常日志
        logUtil.logError(ctx, error, ms);
    }
});
```

这样，在服务器运行的时候，相应的响应（response）日志 和 错误日志会被分别记录到server/logs/response 和 server/logs/error 目录下。

### npm script中的四个缩写

在npm中，有四个常用的缩写：

`npm start`是`npm run start`

`npm stop`是`npm run stop`的简写

`npm test`是`npm run test`的简写

`npm restart`是`npm run stop && npm run restart && npm run start`的简写

### 用mocha和chai测试

```
npm i mocha --save-dev
npm i chai --save-dev
```

mocha使用详见[http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)

在package.json的scripts配置项中设置：

"test": "./node_modules/.bin/mocha server/test/ --watch --recursive --reporter tap"

其中，

 server/test/ 是存放测试文件的路径。不指定路径的情况下，mocha会自动到根目录的test目录下去查找命名能匹配`/test\.js$/`的文件。

 --watch参数用来监视指定的测试脚本。只要测试脚本有变化，就会自动运行Mocha。

 --recursive表示子目录下面所有的测试用例----不管在哪一层----都会执行。mocha默认执行test目录下的测试脚本，但是不会运行test下的子目录中的脚本。想要执行子目录中的测试脚本，可以在运行时添加--recursive参数。

 --reporter tap输出日志报告

然后在server/test目录下新建一个test.js：

```
const expect = require('chai').expect;

/**
 * describe 测试套件(test suite)表示一组相关的测试
 * it 测试用例(test case)表示一个单独的测试
 * assert 断言 表示对结果的预期
 */
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function(){
            expect([1,2,3].indexOf(4)).to.equal(-1);
        })
    })
});
```

### 一些开发工具

#### postman

到[https://www.getpostman.com/](https://www.getpostman.com/)下载postman进行安装。

#### Visual Studio Code

到[https://code.visualstudio.com/](https://code.visualstudio.com/)下载Visual Studio Code进行安装。

### MongoDB的使用

#### 安装：

以windows 10中的安装为例：

在[https://www.mongodb.com/download-center?jmp=nav#community](https://www.mongodb.com/download-center?jmp=nav#community)下载所需的MongoDB版本。

安装到d:\mongodb（默认的安装路径是在C盘下面）目录下。之所以不按默认的路径安装，是为了在操作系统崩溃的时候，避免数据库中的数据丢失。同时，选择一个较短的路径名也便于维护。

然后，我们在控制台中进行命令行操作。

```
cd d:\mongodb\bin
.\mongod.exe --dbpath="d:\mongodb\data\db"
```

这样就会启动一个服务，并且服务的数据库地址指向d:\mongodb\data\db目录。

在此基础上，另开一个控制台窗口，在其中执行命令：

```
cd d:\mongodb\bin
.\mongo.exe
```

就可以进入MongoDB的命令操作状态 （javascript shell，断开这种操作连接用`exit`命令）。

此时可以执行如下一系列的命令了。

执行这些命令之前，先介绍MongoDB中的几个概念。

database（数据库）—— 对应关系数据库上的数据库（database）。
collection（集合） —— 对应关系数据库上的数据库表（table）。
document（文档） —— 对应关系数据库上的数据行（row）。
filed（域） —— 对应关系数据库上的数据列（column）。
index（索引） —— 对应关系数据库上的索引（index）。
primary key（主键） —— 对应关系数据库上的主键（primary key）。
为了便于理解起见，下面的表实际上说的就是collection，而行则对应document。

#### MongoDB的数据类型

MongoDB支持的数据类型有：

String: 这是最常用的数据类型。在MongoDB中的String类型必须是有效的UTF-8。

Integer: 这种类型是用来存储一个数值。整数可以是32位或64位，这取决于您的服务器。

Boolean: 此类型用于存储一个布尔值 (true/ false) 。

Double: 这种类型是用来存储浮点值。

Min/Max keys: 这种类型被用来对BSON（二进制的JSON）元素的最低和最高值比较。

Arrays: 使用此类型的数组或列表或多个值存储到一个键。

Timestamp: 时间戳。这可以方便记录文件修改或添加的具体时间。

Object: 用于内嵌文档。

Null: 这种类型是用来存储一个Null值。

Symbol: 此数据类型用与String大体相同，但它通常是保留给特定符号类型的语言使用。

Date: 此数据类型用于存储当前日期或时间的UNIX时间格式。可以指定自己的日期和时间，日期和年，月，日到创建对象。

Object ID: 此数据类型用于存储文档的ID。

Binary data: 此数据类型用于存储二进制数据。

Code: 此数据类型用于存储到文档中的JavaScript代码。

Regular expression: 此数据类型用于存储正则表达式

#### 常用命令

##### 数据库的基本操作

```
help                                        # 显示帮助信息
show dbs                                    # 这将显示出数据库目录（d:\mongodb\data\db）下所有数据库
use buduhuisi                               # 切换成使用某个数据库，比如这里是buduhuisi，如果该数据库不存在，则会新建它，
                                            # 不过，所创建的数据库不会存在于show dbs查询出来的列表中。
                                            # 要想在该列表中显示出来该数据库，
                                            # 需要至少插入一个文档到该新建的数据库中才行。
show collections                            # 显示当前数据库中的所有表
db.createCollection('test', {capped:true, size: 6142800, max: 10000})
                                            # 创建数据表test，它有三个可选的选项：
                                            # 1、capped：如果为true，表示启用上限集合。上限集合是一个固定大小的集合，
                                            # 当它达到其最大尺寸会自动覆盖最老的条目。 如果指定true，则还需要指定参数的大小。
                                            # 2、size：指定的上限集合字节的最大尺寸。如果capped 是true，那么还需指定这个字段。
                                            # 3、max：指定上限集合允许的最大文件（document）数。
                                            # 在MongoDB中一般并不需要创建集合。当插入一些文档时，MongoDB会自动创建集合。
                                            # 注意：老版本的MongoDB中还有一个参数autoIndexId，在新版本中已经不使用了。

db.user.drop()                              # 删除user表
db                                          # 显示当前正在使用的数据库
```

##### 数据插入

```
db.user.insert({realName:'拍岸', username:'admin', password: '123', avatar: '', age: 18, createTime: '123411'})
                                            # 往当前在用的数据库的user表中插入了两条数据
db.user.insert([{realName:'测试1', username:'test1', password: '456', avatar: '', age: 30, createTime: '123412'},{realName:'测试2', username:'test2', password: '789', avatar: '', age: 38, createTime: '123413'}, {realName: 'test3', username:'test3', password: '000', avatar: '', age: 30, createTime: '123414'}])
                                            # 一次插入多条数据
```

##### 数据查询

```
db.user.find()                              # 显示出当前数据库user表中的所有数据行
db.user.find().pretty()                     # 显示出当前数据库user表中的所有数据行，与上一个命令不同的是，它会将输出的信息格式化
db.user.findOne()                           # 显示出当前数据库user表中的一个数据行，而且自动是格式化好了的。
                                            # 注意：没有db.user.findOne().pretty()
db.user.find({realName:'拍岸'}).pretty()    # 查询出realName字段为拍岸的数据行（当然，这个语句也可以查询等于）。
db.user.find({age: {$lt:30} }).pretty()     # 查询出age字段小于30的数据行。
db.user.find({age: {$lte:30} }).pretty()    # 查询出age字段小于等于30的数据行。
db.user.find({age: {$gt:30} }).pretty()     # 查询出age字段大于30的数据行。
db.user.find({age: {$gte:30} }).pretty()    # 查询出age字段大于等于30的数据行。
db.user.find({age: {$ne:30} }).pretty()     # 查询出age字段不等于的数据行。

db.user.find({realName:'拍岸', age: 18}).pretty()
                                            # 进行与（相当于关系型数据库中的and）查询
                                            # 这里表示只有realName为拍岸而且age为18时，才会被查询出来。

db.user.find({$or: [{realName:'拍岸'}, {age: 38}]}).pretty()
                                            # 进行或（相当于关系型数据库中的or）查询

db.user.find({age: {$lte: 30}, $or: [{realName: '拍岸'}, {realName: '测试1'}] })
                                            # 与和或查询同时存在也是可以的

db.user.find({age: {$in: [30, 20]}})        # 找出年龄在[30、20]这一数组中的，即age是30或者20的
db.user.find({age: {$nin: [30, 20]}})       # 找出年龄不在[30、20]这一数组中的，即age不是30也不是20的

db.user.find({realName:/测试/})             # 查询realName中包含测试两个字的数据
db.user.find({realName:/^测试/})            # 查询realName中以测试两个字开头的数据

db.user.find({'$where': function(){return this.age>20 }})
                                            # 查询年龄大于20的所有记录，不是非常必要时，应避免使用$where，因为效率低

db.user.find().limit(2)                     # 查询符合条件的前两条数据，超过两条的只显示前两条
db.user.find().skip(2)                      # 查询符合条件的跳过前两条之后的数据

db.user.find().sort({age:1})                # 对查询结果按age升序排列
db.user.find().sort({age:-1})               # 对查询结果按age降序排列

db.user.find().count()                      # 获取查询某个结果集的数据条数db.user.find({realName:/test/})

db.user.distinct('age')                     # 获取user表中所有数据行中age的无重复的取值，返回的是一个去重后的age的取值数组

```

##### 数据修改

```
db.user.update({age: 30}, {$set: {age: 38}})  # 只会更新一行，将找到的第一行age为30的数据更新成age为38
db.user.update({age: 38}, {$set: {age: 30}})  # 再做一次更新，将上一行修改的数据恢复成原样
db.user.update({age: 30}, {$set: {age: 32}}, {multi: true})
                                              # 会更新多行，将找到的age为30的行的数据全部更新成age为32

db.user.save({"_id" : ObjectId("590d545bd36b94f780598afb"), realName:'测试3',username:'test3', password: '789', avatar: '', age: 38, createTime: '123413'})          # 这也是一个更新替换的操作，注意"_id"项一定要有，因为替换就是根据这个项去进行的，
                                              # 如果没有"_id"项，则会当作是插入数据行的操作
                                              # 另外还的注意，字段要写全，如果你只写了两个字段，
                                              # 则原来那条记录中的其它字段都会被删除掉，而不会保留
                                              # 即这种方式是整条记录替换，而非个别字段替换

db.user.update({realName:'拍岸'},{$inc:{age:1}})
                                              # 将realName是拍岸的数据行的age在原来的基础上加1，这是$inc的意义
```

##### 数据删除

```
db.user.remove({age:38}, 1)                   # 删除一行数据，这里删除的是符合条件（age为38）的第一行数据
                                              # 这里第二个参数可以是1，也可以是true，

db.user.remove({age:38})                      # 删除一行数据，这里删除的是符合条件（age为38）的第一行数据删除多行数据，
                                              # 这里删除的是符合条件（age为38）的所有行的数据
                                              # 注意：老的版本的MongoDB中可以不给remove()传递参数来删除所有行的数据，
                                              # 但是新版本已经不行了。可能是因为这样很容易误操作的原因。
```

##### 投影

投影的意义是选择所需要的列的数据。而默认的查询会将符合条件的所有列的数据全部列出来。

```
db.user.find({},{realName:1})                 # 将所有行的realName和_id显示出来（_id是默认显示出来的）
db.user.find({},{realName:1, _id:0})          # 会将所有行的realName（手动设定了_id不要显示，1表示要显示，0表示不显示）

```

##### 数据分组

```
db.user.insert([
    {
        realName: '拍岸',
        age: 18
    },
    {
        realName: '惊涛',
        age: 18
    },
    {
        realName: '惊奇',
        age: 18
    },
    {
        realName: '公孙子',
        age: 30
    },
    {
        realName: '刘二备',
        age: 39
    },
    {
        realName: '孙小权',
        age: 39
    },
    {
        realName: '吃瓜群众',
        age: 9
    }
])
db.user.group({
    key: {age: true},
    initial: {person: []},
    $reduce: (cur, prev) => {
        prev.person.push(cur.realName)
    },
    finalize: (out) => {
        out.count = out.person.length;
    },
    condition: {
        age: {$gte: 18}
    }
})
```

这样，就能将数据按年龄分组，并且统计出每个分组的成员个数（count），而且只取年龄大于等于18岁的。结果是：

```
[
        {
                "age" : 18,
                "person" : [
                        "拍岸",
                        "惊涛",
                        "惊奇"
                ],
                "count" : 3
        },
        {
                "age" : 30,
                "person" : [
                        "公孙子"
                ],
                "count" : 1
        },
        {
                "age" : 39,
                "person" : [
                        "刘二备",
                        "孙小权"
                ],
                "count" : 2
        }
]

```

#### mongoose的使用

##### 连接数据库

```
const DB_URL = 'mongodb://localhost:27017/buduhuisi';
const mongoose = require('mongoose');
const db = mongoose.connect(DB_URL);

db.connection.on('connected', () => {
    // 连接成功
    console.log('connected to: ' + DB_URL);
});
db.connection.on('open', () => {
    // 连接open
    console.log('connection open: ' + DB_URL);
});
db.connection.on('error', (err) => {
    // 连接异常
    console.log('connection error: ' + err);
});
db.connection.on('disconnected', () => {
    // 连接断开
    console.log('connection disconnected');
});
```

##### Schema、Model、Entity

Schema：一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力。它仅仅只是数据库模型在程序片段中的一种表现，或者是数据属性模型。

Model：由Schema发布生成的模型，具有抽象属性和行为的数据库操作对。

虽然模式（Schema）在MongoDB的存储中并不是必须的，但是一般来说为了文档的整齐一致我们在Mongoose中还是会用到模式。可以说，Mongoose中的一切都从定义模式开始。

不像传统的关系型数据库一样，比如MySQL，连接好数据后直接有把sql语句丢到一个指定的方法中就执行了，这里会有Schema的抽象概念。
Schema它类似于关系数据库的表结构，可以理解为数据库模型骨架。Schema可以看作工厂中模具一样，好比一个茶杯，喝水是茶杯最终的功能，茶杯本身就像是Model，那么茶杯的批量生产是需要靠工厂的模具成型的，这就像是Schema了。

Schema不仅定义了文档结构和使用性能，还可以有扩展插件、实例方法、静态方法、复合索引、文档生命周期钩子。


成功连接数据库后，就可以执行数据库相应操作，假设以下代码都在回调中处理：

1）定义一个Schema

```
const Schema = mongoose.Schema;
let PersonSchema = new Schema(
    {
        name: String   //定义一个属性name，类型为String
    }
);
```

2) 将该Schema发布为Model

```
const PersonModel = db.model('Person', PersonSchema);
// 如果该Model已经发布，则可以直接通过名字索引到，如下：
// 如果没有发布，将会报出异常
// const PersonModel = db.model('Person');
```

3）用Model创建Entity

```
const personEntity = new PersonModel({name:'拍岸'});
console.log(personEntity.name); //拍岸
```

4）我们甚至可以为此Schema创建方法

首先来看一下如何给Schema扩展实例方法：

```
//为Schema模型追加speak方法
PersonSchema.methods.speak = function(){
    console.log('我的名字叫'+this.name);
}
const PersonModel = db.model('Person',PersonSchema);
const personEntity = new PersonModel({name:'拍岸'});
personEntity.speak();//我的名字叫拍岸
```

除了实例方法外，还可以给Schema扩展静态方法：

```
PersonSchema.statics.findByName = (name, cb) => {
    this.find({name: new RegExp(name,'i'), cb});
}

const PersonModel = mongoose.model('Person', PersonSchema);
PersonModel.findByName('拍岸', (err, persons) => {
    //找到所有名字叫拍岸的人
});
```

静态方法与实例方法所不同的是，静态方法在Model上就能使用。而不用等创建了实例再在实例上才能使用。

5）Entity是具有具体的数据库操作CRUD的

```
personEntity.save();  //执行完成后，数据库就有该数据了
```

6）如果要执行查询，需要依赖Model，当然Entity也是可以做到的

```
PersonModel.find(function(err, persons){
  //查询到的所有person
});
```

7）虚拟属性

Schema中定义的虚拟属性是不写入数据库的，例如：

```
const PersonSchema = new Schema({
    name:{
      first:String,
      last:String
    }
});
const PersonModel = mongoose.model('Person', PersonSchema);
const person = new PersonModel({
    name: {first:'拍岸', last:'江'}
});
```

如果每次想使用全名就得这样：

```
console.log(`${person.name.first} ${person.name.last}`);
```

显然这是很麻烦的，这个时候，虚拟属性就非常适合了：

```
PersonSchema.virtual('name.full').get(function(){
    return `${person.name.first} ${person.name.last}`;
});
```

有了虚拟属性，我们就可以通过`person.name.full`来直接拿到全名了。反之，如果知道full，也可以反解first和last属性。

```
PersonSchema.virtual('name.full').set(function(name){
    const split = name.split(' ');
    this.name.first = split[0];
    this.name.last = split[1];
});
const PersonModel = mongoose.model('Person', PersonSchema);
const person = new PersonModel({});
person.name.full = '拍岸 江';
console.log(person.name.first);// 拍岸
console.log(person.name.first);// 江
```

8）配置项

在使用`new Schema(config)`时，我们可以追加一个参数options来配置Schema的配置，形如：

```
let ExampleSchema = new Schema(config,options);
```

或者

```
let ExampleSchema = new Schema(config);
ExampleSchema.set(option, value);
```

常见的配置项有：safe、strict、capped、versionKey、toJSON、toObject等等。

- safe——安全属性（默认安全）

- strict——严格配置（默认启用）

该配置项用于确保Entity的值存入数据库前会被自动验证，如果你没有充足的理由，请不要停用。

- capped——上限设置

如果有数据库的批量操作，该属性能限制一次操作的量，例如：

```
new Schema({...},{capped:1024});  //一次操作上线1024条数据
```

当然该参数也可是JSON对象，包含size、max属性

```
new Schema({...},{capped:{size:1024,max:100}});
```

- versionKey——版本锁

通过mongoose中的save方法保存记录时数据行默认最后会有一个字段"__v"，这个字段表示该文档是否是刚刚创建的，如果是则字段"__v"的值为0 (通过命令行增加的文档不会有__v字段)。如果要禁用这个字段，则可以在创建Schema的时候设置versionKey为false。

- toJSON 和 toObject

```
let ExampleSchema = new Schema(config);
ExampleSchema.set('toJSON', { getters: true, virtuals: true });
ExampleSchema.set('toObject', { getters: true, virtuals: true });
```

数据行(document)有一个能把mongoose document转换成plain javascript object的`toJSON`和`toObject`方法。设置 `{virtuals: true }`，可以保证输出结果中把虚拟属性也被包含其中。

9）验证

数据的存储是需要验证的，不是什么数据都能往数据库里丢或者显示到客户端的，数据的验证需要记住以下规则：

- 验证始终定义在SchemaType中；

- 验证是一个内部中间件；

- 验证是在一个Document被保存时默认启用的，除非你关闭验证；

- 验证是异步递归的，如果你的SubDoc验证失败，作为父级的Document也将无法保存；

- 验证并不关心错误类型，而通过ValidationError这个对象可以访问。


验证器：

required 非空验证

min/max 范围验证（边值验证）

enum/match 枚举验证/匹配验证

validate 自定义验证规则

以下是综合案例：

```
const PersonSchema = new Schema({
  name:{
    type:'String',
    required:true // 姓名非空
  },
  age:{
    type:'Number',
    min:18,      // 年龄最小18
    max:120      // 年龄最大120
  },
  city:{
    type:'String',
    enum:['北京', '上海']  // 只能是北京、上海人
  },
  other:{
    type:'String',
    validate:[validator, err]  // validator是一个验证函数，err是验证失败的错误信息
  }
});
```

验证失败：

如果验证失败，则会返回err信息，err是一个对象该对象属性如下：

err.errors                //错误集合（对象）
err.errors.color          //错误属性(Schema的color属性)
err.errors.color.message  //错误属性信息
err.errors.path           //错误属性路径
err.errors.type           //错误类型
err.name                  //错误名称
err.message               //错误消息

一旦验证失败，Model和Entity都将具有和err一样的errors属性。

##### `schema.path()`解析

另外，来看一下 `schema.path()` 这个Function，这个名字显得奇奇怪怪的，到底表示什么呢？看官方文档，是这么描述的：

    The schema.path() function returns the instantiated（实例化了的） schema type for a given path.

```
var sampleSchema = new Schema({ name: { type: String, required: true } });
console.log(sampleSchema.path('name'));
```

输出结果是一个SchemaType，如下：

```
SchemaString {
  enumValues: [],
  regExp: null,
  path: 'name',
  instance: 'String',
  validators:
   [ { validator: [Function],
       message: 'Path `{PATH}` is required.',
       type: 'required' } ],
  setters: [],
  getters: [],
  options: { type: [Function: String], required: true },
  _index: null,
  isRequired: true,
  requiredValidator: [Function],
  originalRequiredValue: true
}
```

You can use this function to inspect the schema type for a given path, including what validators it has and what the type is.

```
sampleSchema.path('name', Number) // changes the schemaType of name to Number
console.log(sampleSchema.path('name'));
```
再次输出的结果是：

```
SchemaNumber {
  path: 'name',
  instance: 'Number',
  validators: [],
  setters: [],
  getters: [],
  options: { type: [Function: Number] },
  _index: null }
```

可见，已经被改变成了另一个SchemaType。

##### mongoose上的新增操作

如果是Entity，使用`save`方法，如果是Model，使用`create`方法。

// 使用Entity来增加一条数据
const person = new PersonModel({name:'拍岸'});
person.save(callback);

// 使用Model来增加一条数据
const person = {name:'拍岸'};
PersonModel.create(person, callback);

两种新增方法区别在于，如果使用Model新增时，传入的对象只能是纯净的JSON对象，不能是由Model创建的实体，原因是：由Model创建的实体person虽然打印是只有`{name:'拍岸'}`，但是person属于Entity，包含有Schema属性和Model数据库行为模型。如果是使用Model创建的对象，传入时一定会将隐藏属性也存入数据库，虽然3.x追加了默认严格属性，但也不必要增加操作的报错。

##### mongoose上的删除操作

和新增一样，删除也有2种方式，但Entity和Model都使用remove方法。

类似的方法还有`findByIdAndRemove`，如同名字，只能根据id查询并作`update`/`remove`操作，操作的数据仅一条。


##### mongoose上的更新操作

有许多方式来更新文件，以下是常用的传统方式：

```
PersonModel.findById(id, (err, person) => {
  person.name = '拍岸';
  person.save((err) => {});
});
```

这里，利用Model模型查询到了person对象，该对象属于Entity，可以有save操作，如果使用Model操作，需注意：

```
PersonModel.findById(id, (err, person) => {
  person.name = '拍岸';
  const _id = person._id; // 需要先暂存出主键_id
  delete person._id;      // 再将其删除
  PersonModel.update({_id: _id}, person, function(err){});
  // 此时才能用Model操作，否则报错
});
```

**update第一个参数是查询条件，第二个参数是更新的对象，但不能更新主键，这就是为什么要先删除主键的原因。**

当然这样的更新很麻烦，可以使用$set属性来配置，这样也不用先查询，如果更新的数据比较少，可用性还是很好的：

```
PersonModel.update({_id:_id},{$set:{name:'MDragon'}}, (err, num) => {});
```

需要注意，Document的CRUD操作都是异步执行，callback第一个参数必须是err，而第二个参数各个方法不一样，`update`的callback第二个参数是更新的数量，如果要返回更新后的对象，则要使用`findByIdAndUpdate`方法:

```
Person.findByIdAndUpdate(_id,{$set:{name:'拍岸'}}, (err, person) => {
    console.log(person.name); // 拍岸
});
```

##### mongoose上的查询操作

```
PersonModel.findOne({name.last: '拍岸'}, 'some select', (err, person) => {
  //如果err==null，则person就能取到数据
});
```

```
let query = PersonModel.findOne({'name.last': '拍岸'});
query.select('some select');
query.exec((err, person) => {
    //如果err==null，则person就能取到数据
});
```

这种方式，如果不带callback，则返回query，query没有执行的预编译查询语句，该query对象执行的方法都将返回自己，只有在执行exec方法时才执行查询，而且必须有回调。

因为query的操作始终返回自身，我们可以采用更形象的链式写法:

```
const callback = (err, person) => {
    //如果err==null，则person就能取到数据
};

Person
  .find({ realName: /测试/ })
  .where('name.last').equals('paian')
  .where('age').gt(18).lt(40)
  .where('hobby').in(['vaporizing', 'talking'])
  .limit(5)
  .sort('-age')
  .select('realName name age')
  .exec(callback);
```

##### mongoose上的中间件

mongoose上的中间件是一种控制函数，类似插件，能控制流程中的`init`、`validate`、`save`、`remove`方法。

它分为两类：

1）Serial串行

```
const schema = new Schema(...);
schema.pre('save', (next) => {
  // do something here
  next();
});
```

2）Parallel并行

并行提供更细粒度的操作

```
var schema = new Schema(...);
schema.pre('save', (next, done) => {
  // 下一个要执行的中间件并行执行
  next();
  doAsync(done);
});
```

3）中间件特点

一旦定义了中间件，就会在全部中间件执行完后执行其它操作。

4）使用范畴

复杂的验证；

删除有主外关联的doc；

异步默认；

某个特定动作触发异步任务，例如触发自定义事件和通知。

例如，可以用来做自定义错误处理

```
schema.pre('save', (next) => {
  var err = new Error('some err');
  next(err);
});
entity.save((err) => {
  console.log(err.message); //some err
});
```

##### mongoose之population的使用

Mongoose 是 MongoDB 的 ODM(Object Document Mapper)。

什么是ODM? 其实和ORM(Object Relational Mapper)是同类型的工具。都是将数据库的数据转化为代码对象的库，使用转化后的对象可以直接对数据库的数据进行CRUD(增删改查)。

MongoDB 是文档型数据库(Document Database)，不是关系型数据库(Relational Database)。而Mongoose可以将 MongonDB 数据库存储的文档(documents)转化为 javascript 对象，然后可以直接进行数据的增删改查。

因为MongoDB是文档型数据库，所以它没有关系型数据库joins(数据库的两张表通过"外键"，建立连接关系。) 特性。也就是在建立数据的关联时会比较麻烦。为了解决这个问题，Mongoose封装了一个Population功能。使用Population可以实现在一个 document 中填充其他 collection(s) 的 document(s)。

在定义Schema的时候，如果设置某个 field 关联另一个Schema，那么在获取 document 的时候就可以使用 Population 功能通过关联Schema的 field 找到关联的另一个 document，并且用被关联 document 的内容替换掉原来关联字段(field)的内容。

接下来分享下:Query、Model、Document中populate的用法

先建立三个Schema和Model:

```
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    name  : { type: String, unique: true },
    posts : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});
var User = mongoose.model('User', UserSchema);

var PostSchema = new Schema({
    poster   : { type: Schema.Types.ObjectId, ref: 'User' },
    comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    title    : String,
    content  : String
});
var Post = mongoose.model('Post', PostSchema);

var CommentSchema = new Schema({
    post      : { type: Schema.Types.ObjectId, ref: "Post" },
    commenter : { type: Schema.Types.ObjectId, ref: 'User' },
    content   : String
});
var Comment = mongoose.model('Comment', CommentSchema);
```

在上述的例子中，创建了三个 Models：User，Post，Comment。

User 的属性 posts，对应是一个 ObjectId 的数组。ref表示关联Post(注意: 被关联的model的 type 必须是 ObjectId, Number, String, 和 Buffer 才有效)。

Post的属性 poster 和 comments 分别关联User和Comment。

Comment的属性 post 和 commenter 分别关联Post和User。

三个 Models 的关系:一个 user--has many-->post。一个 post--has one-->user，has many-->comment。一个 comment--has one-->post 和 user。

创建一些数据到数据库:

```
// 连接数据库
mongoose.connect('mongodb://localhost/buduhuisi', function (err){
    if (err) throw err;
    createData();
});

function createData() {

    var userIds    = [new ObjectId, new ObjectId, new ObjectId];
    var postIds    = [new ObjectId, new ObjectId, new ObjectId];
    var commentIds = [new ObjectId, new ObjectId, new ObjectId];

    var users    = [];
    var posts    = [];
    var comments = [];

    users.push({
        _id   : userIds[0],
        name  : 'aikin',
        posts : [postIds[0]]
    });
    users.push({
        _id   : userIds[1],
        name  : 'luna',
        posts : [postIds[1]]
    });
    users.push({
        _id   : userIds[2],
        name  : 'luajin',
        posts : [postIds[2]]
    });

    posts.push({
        _id      : postIds[0],
        title    : 'post-by-aikin',
        poster   : userIds[0],
        comments : [commentIds[0]]
    });
    posts.push({
        _id      : postIds[1],
        title    : 'post-by-luna',
        poster   : userIds[1],
        comments : [commentIds[1]]
    });
    posts.push({
        _id      : postIds[2],
        title    : 'post-by-luajin',
        poster   : userIds[2],
        comments : [commentIds[2]]
    });

    comments.push({
        _id       : commentIds[0],
        content   : 'comment-by-luna',
        commenter : userIds[1],
        post      : postIds[0]
    });
    comments.push({
        _id       : commentIds[1],
        content   : 'comment-by-luajin',
        commenter : userIds[2],
        post      : postIds[1]
    });
    comments.push({
        _id       : commentIds[2],
        content   : 'comment-by-aikin',
        commenter : userIds[1],
        post      : postIds[2]
    });

    User.create(users, function(err, docs) {
        Post.create(posts, function(err, docs) {
            Comment.create(comments, function(err, docs) {
            });
        });
    });
}
```

数据的准备就绪后，接下来就是探索populate方法:

1. Query的populate

什么Query? Query(查询)，可以快速和简单的从MongooDB查找出相应的 document(s)。 Mongoose 封装了很多查询的方法，使得对数据库的操作变得简单啦。这里分享一下populate方法用法。

语法：

**`Query.populate(path, [select], [model], [match], [options])`**

参数：

path

　　类型：String或Object。

　　String类型的时， 指定要填充的关联字段，要填充多个关联字段可以以空格分隔。

　　Object类型的时，就是把 populate 的参数封装到一个对象里。当然也可以是个数组。下面的例子中将会实现。

select

　　类型：Object或String，可选，指定填充 document 中的哪些字段。

　　Object类型的时，格式如:{name: 1, _id: 0},为0表示不填充，为1时表示填充。

　　String类型的时，格式如:"name -_id"，用空格分隔字段，在字段名前加上-表示不填充。详细语法介绍 query-select

model

　　类型：Model，可选，指定关联字段的 model，如果没有指定就会使用Schema的ref。

match

　　类型：Object，可选，指定附加的查询条件。

options

　　类型：Object，可选，指定附加的其他查询选项，如排序以及条数限制等等。

填充User的posts字段:

```
//填充所有 users 的 posts
User.find()
    .populate('posts', 'title', null, {sort: { title: -1 }})
    .exec(function(err, docs) {
        console.log(docs[0].posts[0].title); // post-by-aikin
    });

//填充 user 'luajin'的 posts
User.findOne({name: 'luajin'})
    .populate({path: 'posts', select: { title: 1 }, options: {sort: { title: -1 }}})
    .exec(function(err, doc) {
        console.log(doc.posts[0].title);  // post-by-luajin
    });

//这里的 populate 方法传入的参数形式不同，其实实现的功能是一样的，只是表示形式不一样。
```

填充Post的poster和comments字段:

```
Post.findOne({title: 'post-by-aikin'})
    .populate('poster comments', '-_id')
    .exec(function(err, doc) {
        console.log(doc.poster.name);           // aikin
        console.log(doc.poster._id);            // undefined

        console.log(doc.comments[0].content);  // comment-by-luna
        console.log(doc.comments[0]._id);      // undefined
    });

Post.findOne({title: 'post-by-aikin'})
    .populate({path: 'poster comments', select: '-_id'})
    .exec(function(err, doc) {
        console.log(doc.poster.name);           // aikin
        console.log(doc.poster._id);            // undefined

        console.log(doc.comments[0].content);  // comment-by-luna
        console.log(doc.comments[0]._id);      // undefined
    });

//上两种填充的方式实现的功能是一样的。就是给 populate 方法的参数不同。
//这里要注意，当两个关联的字段同时在一个 path 里面时， select 必须是 document(s)
//具有的相同字段。


//如果想要给单个关联的字段指定 select，可以传入数组的参数。如下：

Post.findOne({title: 'post-by-aikin'})
    .populate(['poster', 'comments'])
    .exec(function(err, doc) {
        console.log(doc.poster.name);          // aikin
        console.log(doc.comments[0].content);  // comment-by-luna
    });

Post.findOne({title: 'post-by-aikin'})
    .populate([
        {path:'poster',   select: '-_id'},
        {path:'comments', select: '-content'}
    ])
    .exec(function(err, doc) {
        console.log(doc.poster.name);          // aikin
        console.log(doc.poster._id);           // undefined

        console.log(doc.comments[0]._id);      // 会打印出对应的 comment id
        console.log(doc.comments[0].content);  // undefined
    });

```

2、Model的populate

Model(模型)，是根据定义的 Schema 编译成的抽象的构造函数。models 的实例 documents，可以在数据库中被保存和检索。数据库所有 document 的创建和检索，都通过 models 处理。

语法：

**`Model.populate(docs, options, [cb(err,doc)])`**

参数：

docs

　　类型：Document或Array。单个需要被填充的 doucment 或者 document 的数组。

options

　　类型：Object。以键值对的形式表示。

　　keys：path select match model options，这些键对应值的类型和功能，与上述Query#populate方法的参数相同。

[cb(err,doc)]

　　类型：Function，回调函数，接收两个参数，错误err和填充完的doc(s)。

填充Post的poster和comments字段以及comments的commenter字段:

```
Post.find({title: 'post-by-aikin'})
    .populate('poster comments')
    .exec(function(err, docs) {

        var opts = [{
            path   : 'comments.commenter',
            select : 'name',
            model  : 'User'
        }];

        Post.populate(docs, opts, function(err, populatedDocs) {
            console.log(populatedDocs[0].poster.name);                  // aikin
            console.log(populatedDocs[0].comments[0].commenter.name);  // luna
        });
    });
```

3. Document的populate

Document，每个 document 都是其 Model 的一个实例，一对一的映射着 MongoDB 的 document。

语法：

**`Document.populate([path], [callback])`**

参数：

path

　　类型：String或Object。与上述Query#populate`方法的 path 参数相同。

callback

　　类型：Function。回调函数，接收两个参数，错误err和填充完的doc(s)。

填充User的posts字段:

```
User.findOne({name: 'aikin'})
    .exec(function(err, doc) {

        var opts = [{
            path   : 'posts',
            select : 'title'
        }];

        doc.populate(opts, function(err, populatedDoc) {
            console.log(populatedDoc.posts[0].title);  // post-by-aikin
        });
    });
```

更多内容可参阅：

[http://www.cnblogs.com/huangxincheng/archive/2012/02/21/2361205.html](http://www.cnblogs.com/huangxincheng/archive/2012/02/21/2361205.html)

[http://www.nodeclass.com/api/mongoose.html](http://www.nodeclass.com/api/mongoose.html)
















