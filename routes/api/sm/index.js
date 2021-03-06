// const express = require('express');
// const router = express.Router();
const router = require('koa-router')();
const fs = require('fs');
const lodash = require('lodash');
const path = require('path');
const smControllers = require('../../../controllers/sm')

//轮询当前目录下的子模块，并挨个加载其路由配置
let files = fs.readdirSync(__dirname);
files.forEach(function (file) {
  if (!lodash.startsWith(file, '.') && file !== 'index.js') {
    if (file.indexOf("_") == 0) return;
    try {
      let filerouter = require('./' + file);
      router.use('/' + file.replace('.js', ''), filerouter.routes(), filerouter.allowedMethods());
    } catch (ex) {
      console.error('路由加载错误[' + path.join(__dirname, file) + ']：' + ex.stack);
    }
  }
});

module.exports = router;

// indexRouter.router = router;
// module.exports = indexRouter;


// var router = require('koa-router')();

// router.get('/', function (ctx) {
//   //ctx.body = 'this a index response!';
//   ctx.state.data = 'this a index response!';
// });


// router.get('/hi', function (ctx) {
//   //ctx.body = 'this a index/hi response!';
//   ctx.state.data = 'this a index response!';
// });

router.get('/', function (ctx) {
  //ctx.body = 'this a index response!';
  ctx.state.data = 'this a sm index response!';
});

router.post('/add', smControllers.sm.add);
router.post('/remove', smControllers.sm.remove);


//module.exports = router;