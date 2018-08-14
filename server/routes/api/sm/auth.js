
const router = require('koa-router')();
const fs = require('fs');
const lodash = require('lodash');
const path = require('path');
const smControllers = require('../../../controllers/sm')

router.post('/', smControllers.auth.login);

router.get('/checkStatus', smControllers.auth.checkStatus);

// router.post('/add', function (ctx) {
//   ctx.state.data = 'this a sm11111 index response!';
// });

module.exports = router;