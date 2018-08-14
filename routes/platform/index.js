
const router = require('koa-router')();
const fs = require('fs');
const lodash = require('lodash');
const path = require('path');


router.get('/', function (ctx) {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./platform/template/index.html');
});

router.get('/login', function (ctx) {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./platform/template/login.html');
});


router.get('/home', function (ctx) {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./platform/template/home.html');
});

router.get('/js/:filename', function (ctx) {

  let filePath = "./platform/js/" + ctx.params.filename;
  ctx.type = 'application/x-javascript';
  ctx.body = fs.createReadStream(filePath);
});

router.get('/assets/images/:filename', function (ctx) {

  let filePath = "./platform/assets/images/" + ctx.params.filename;
  ctx.type = 'image/png';
  ctx.body = fs.createReadStream(filePath);
});
router.get('/assets/styles/:filename', function (ctx) {
  let filePath = "./platform/assets/styles/" + ctx.params.filename;
  ctx.type = 'text/css';
  ctx.body = fs.createReadStream(filePath);
});

router.get('/assets/fonts/:filename', function (ctx) {
  let filePath = "./platform/assets/fonts/" + ctx.params.filename;
  ctx.type = 'application /octet-stream';
  ctx.body = fs.createReadStream(filePath);
});

router.get('/assets/iconfont.css', function (ctx) {
  let filePath = "./platform/assets/iconfont.css";
  ctx.type = 'text/css';
  ctx.body = fs.createReadStream(filePath);
});

// router.all('/*', function (ctx) {
//   console.log(ctx);
//   ctx.state.data = 'this all a index response!';
// });

// router.get('/get', function (ctx) {
//   console.log(ctx);
//   ctx.state.data = 'this get a index response!';
// });

module.exports = router;