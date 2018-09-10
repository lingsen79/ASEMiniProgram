const router = require('koa-router')();
const fs = require('fs');
const lodash = require('lodash');
const path = require('path');
const productController = require('../../../controllers/sm/product')
const authController = require('../../../controllers/sm/auth')

router.get('/', productController.find);

//创建product
router.post('/upload', productController.upload);

//创建product
router.post('/', productController.add);

//编辑
router.patch('/', productController.set);

//删除指定的product
router.delete('/:index', productController.remove);
//批量删除product
router.delete('/batch/:indexs', productController.removeBatch);


router.get('/buylimit', productController.findBuyLimit);
router.post('/buylimit', productController.addBuyLimit);
router.patch('/buylimit', productController.setBuyLimit);
router.delete('/buylimit/batch/:indexs', productController.trashBuyLimitBatch);


router.get('/grouppurchase', productController.findGroupPurchase);
router.post('/grouppurchase', productController.addGroupPurchase);
router.patch('/grouppurchase', productController.setGroupPurchase);
router.delete('/grouppurchase/batch/:indexs', productController.trashGroupPurchaseBatch);



module.exports = router;