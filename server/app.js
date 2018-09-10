const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
var cors = require('koa-cors');
//const session = require("koa-session")()
const config = require('./config')
global._ = require('lodash');

global.config = config;

global.asemini_conn = require('knex')({
  client: 'mysql',
  connection: {
    host: global.config.mysql.host,
    user: global.config.mysql.user,
    password: global.config.mysql.pass,
    database: 'asemini'
  }
});

app.use(cors());

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
