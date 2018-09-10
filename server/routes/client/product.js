const router = require('koa-router')();
const fs = require('fs');
const lodash = require('lodash');
const path = require('path');
const productController = require('../../controllers/product')

router.get('/', productController.find);

module.exports = router;