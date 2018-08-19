const router = require('koa-router')();
const fs = require('fs');
const lodash = require('lodash');
const path = require('path');
const userController = require('../../../controllers/sm/user')
const authController = require('../../../controllers/sm/auth')



//先检查登录
router.use(authController.checkStatus);

//返回user的集合
router.get('/', userController.find);

//创建user
router.post('/', userController.add);
//
// //返回指定的user
// router.get('/:id', userController.findById);

//编辑
router.patch('/', userController.set);

router.post('/check_mobile', userController.check_mobile);

router.post('/resetpwd', userController.resetpwd);

//删除指定的user
router.delete('/:index', userController.remove);
//批量删除user
router.delete('/batch/:indexs', userController.removeBatch);

module.exports = router;