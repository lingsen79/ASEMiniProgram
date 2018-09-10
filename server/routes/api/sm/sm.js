const router = require('koa-router')();
const fs = require('fs');
const lodash = require('lodash');
const path = require('path');
const smController = require('../../../controllers/sm/sm')
const authController = require('../../../controllers/sm/auth')

//先检查登录
router.use(authController.checkStatus);

//返回sm的集合
router.get('/', smController.find);

router.post('/check_mobile', smController.check_mobile);

//创建sm
router.post('/', smController.add);
//编辑sm
router.patch('/', smController.set);

router.post('/resetpwd', smController.resetpwd);

//编辑sm
//router.patch('/profile', smController.profile);

//批量删除sm
router.delete('/batch/:indexs', smController.removeBatch);

module.exports = router;