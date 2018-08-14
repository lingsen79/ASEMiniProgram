/**
 * users 控制器
 *
 * Created by jerry on 2017/11/2.
 */
const Mock = require('mockjs');
const errorcode = require('../models/error.class.js');
const productDBModel = require('../models/db.product');
const uti = require('../models/utils');
const moment = require('moment');
let productController = {};
var multiparty = require('multiparty');
var fs = require("fs");
var request = require('request');
//let _Users = Users;

productController.testminip = function(req,res){
	request('https://mlxzohtt.qcloud.la/weapp/helloworld', function (error, response, body) {
		console.log(error)
	  if (!error && response.statusCode == 200) {
	    console.log(body) // 打印google首页
	    	res.json(body);
	  }
	})
}

/**
 * 通过查询，获取列表
 * @param req
 * @param res
 */
productController.find = function (req, res) {
	let page = parseInt(req.query.page || 1); //页码（默认第1页）
	let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
	let title = req.query.title || '';
	let offset = (page-1) * limit;
	let filters = new Array();
	//filters.push({"field":"type","value":'0'});
	if(title != "") filters.push({"field":"`title`","value":title,"type":"likes"});
	var sorts = new Array();
	
	productDBModel.find(offset,limit,filters,sorts,function(result){
		global.logger.info(result);
		res.json(result);
	});
};


/*
 * 添加
 * @param req
 * @param res
 */
productController.add = function (req, res) {
  let product = {
  	title:req.body.title,
  	summary:req.body.summary,
  	imagename:req.body.imagename,
  	imagepath:req.body.imagepath,
	price:req.body.price,
	type:1,
	sold:0,
  	description:req.body.description,
  	remark:req.body.remark
  }
  productDBModel.add(product,function(result){
  	global.logger.info(result);
  	res.json({"code":result.code })
  });
};

/*
 * 编辑
 * @param req
 * @param res
 */
productController.set = function (req, res) {
	
	global.logger.info(req.body);
	let product = [];
	if(req.body.index && req.body.index > 0){
		product["index"] = req.body.index;
	}else{
	  	res.json({"code":errorcode.PARAMS_FAILED});
	}
  
	if(req.body.title && req.body.title !=""){
		product["title"] = req.body.title;
	}
	
	if(req.body.summary && req.body.summary !=""){
		product["summary"] = req.body.summary;
	}
	
	if(req.body.imagename && req.body.imagename !=""){
		product["imagename"] = req.body.imagename;
	}
	
	if(req.body.imagepath && req.body.imagepath !=""){
		product["imagepath"] = req.body.imagepath;
	}
	
	if(req.body.price && req.body.price !=""){
		product["price"] = req.body.price;
	}
	
	if(req.body.description && req.body.description !=""){
		product["description"] = req.body.description;
	}
	
	if(req.body.remark && req.body.remark !=""){
		product["remark"] = req.body.remark;
	}
	if(req.body.purchasenotes && req.body.purchasenotes !=""){
		product["purchasenotes"] = req.body.purchasenotes;
	}
	if(req.body.regulations && req.body.regulations !=""){
		product["regulations"] = req.body.regulations;
	}
	productDBModel.set(product,function(result){
	  	global.logger.info(result);
	  	res.json({"code":result.code })
	});
};


productController.upload = function (req, res) {
	var form = new multiparty.Form({uploadDir: global.conf.uploadImageTargetDir});//'./server/uploadfile/'
	form.parse(req, function(err, fields, files) {
		let f = files.file[0];
		let npath = form.uploadDir+f.originalFilename;
      	let rv = fs.renameSync(f.path,npath);
  		res.json({"code":err,"path":npath,name: f.originalFilename});
	});
  	//global.logger.info(req);
};

/**
 * 批量删除
 * @param req
 * @param res
 */
productController.removeBatch = function (req, res) {
	let indexs = req.params.indexs;
	global.logger.info(req.body.indexs);
	global.logger.info(req.params);
	global.logger.info(indexs);
	if (!indexs) {
    	return res.json({"code": errorcode.PARAMS_FAILED});
	}
	productDBModel.remove(indexs,function(result){
		global.logger.info(result);
		res.json(result);
	});
};

/**
 * 单条删除
 * @param req
 * @param res
 */
productController.remove = function (req, res) {
	let index = _.trim(req.body.index || '');
	global.logger.info(index);
	if (!index) {
    	return res.json({"code": errorcode.PARAMS_FAILED});
	}
	
	productDBModel.remove(index,function(result){
		global.logger.info(result);
		res.json(result)
	});
};



/**
 * 通过查询，获取秒杀列表
 * @param req
 * @param res
 */
productController.findBuyLimit = function (req, res) {
	let page = parseInt(req.query.page || 1); //页码（默认第1页）
	let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
	let title = req.query.title || '';
	let offset = (page-1) * limit;
	let filters = new Array();
	filters.push({"field":"logicdel","value":'0',"table":'b'});
	if(title != "") filters.push({"field":"`title`","value":title,"type":"likes"});
	var sorts = new Array();
	
	productDBModel.findBuyLimit(offset,limit,filters,sorts,function(result){
		global.logger.info(result);
		res.json(result);
	});
};

/*
 * 编辑秒杀
 * @param req
 * @param res
 */
productController.addBuyLimit = function (req, res) {
	
	global.logger.info(req.body);
	let product = [];
	if(req.body.productindex && req.body.productindex > 0){
		product["productindex"] = req.body.productindex;
	}else{
	  	res.json({"code":errorcode.PARAMS_FAILED});
	  	return;
	}
	if(req.body.price && req.body.price !=""){
		product["price"] = req.body.price;
	}
	if(req.body.balance && req.body.balance !=""){
		product["balance"] = req.body.balance;
	}
	
	if(req.body.datetimerange && req.body.datetimerange !=""){
		let datetimerange = req.body.datetimerange;
		product["begintime"] = moment(datetimerange[0]).format("YYYY-MM-DD HH:mm:ss");
		product["endtime"] = moment(datetimerange[1]).format("YYYY-MM-DD HH:mm:ss");
	}else{
		res.json({"code":errorcode.PARAMS_FAILED});
		return;
	}
	console.log(product);
	res.json({"code":errorcode.SUCCESS })
	productDBModel.addBuyLimit(product,function(result){
	  	global.logger.info(result);
	  	res.json({"code":result.code })
	});
}

productController.setBuyLimit = function (req, res) {
	
	global.logger.info(req.body);
	let product = [];
	if(req.body.index && req.body.index > 0){
		product["index"] = req.body.index;
	}else{
	  	res.json({"code":errorcode.PARAMS_FAILED});
	  	return;
	}
	if(req.body.price && req.body.price !=""){
		product["price"] = req.body.price;
	}
	if(req.body.balance && req.body.balance !=""){
		product["balance"] = req.body.balance;
	}
	
	if(req.body.datetimerange && req.body.datetimerange !=""){
		let datetimerange = req.body.datetimerange;
		product["begintime"] = moment(datetimerange[0]).format("YYYY-MM-DD HH:mm:ss");
		product["endtime"] = moment(datetimerange[1]).format("YYYY-MM-DD HH:mm:ss");
	}else{
		res.json({"code":errorcode.PARAMS_FAILED});
		return;
	}
	console.log(product);
	res.json({"code":errorcode.SUCCESS })
	productDBModel.setBuyLimit(product,function(result){
	  	global.logger.info(result);
	  	res.json({"code":result.code })
	});
}

/**
 * 批量删除
 * @param req
 * @param res
 */
productController.removeBuyLimitBatch = function (req, res) {
	let indexs = req.params.indexs;
	global.logger.info(req.body.indexs);
	global.logger.info(req.params);
	global.logger.info(indexs);
	if (!indexs) {
    	return res.json({"code": errorcode.PARAMS_FAILED});
	}
	productDBModel.removeBuyLimit(indexs,function(result){
		global.logger.info(result);
		res.json(result);
	});
};

productController.trashBuyLimitBatch = function (req, res) {
	let indexs = req.params.indexs;
	global.logger.info(req.body.indexs);
	global.logger.info(req.params);
	global.logger.info(indexs);
	if (!indexs) {
    	return res.json({"code": errorcode.PARAMS_FAILED});
	}
	productDBModel.trashBuyLimit(indexs,function(result){
		global.logger.info(result);
		res.json(result);
	});
};


/**
 * 通过查询，获取团购列表
 * @param req
 * @param res
 */
productController.findGroupPurchase = function (req, res) {
	let page = parseInt(req.query.page || 1); //页码（默认第1页）
	let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
	let title = req.query.title || '';
	let offset = (page-1) * limit;
	let filters = new Array();
	filters.push({"field":"logicdel","value":'0',"table":"g"});
	if(title != "") filters.push({"field":"`title`","value":title,"type":"likes"});
	var sorts = new Array();
	
	productDBModel.findGroupPurchase(offset,limit,filters,sorts,function(result){
		global.logger.info(result);
		res.json(result);
	});
};

/*
 * 编辑团购
 * @param req
 * @param res
 */
productController.addGroupPurchase = function (req, res) {
	
	global.logger.info("add group purchase");
	global.logger.info(req.body);
	let product = [];
	if(req.body.productindex && req.body.productindex > 0){
		product["productindex"] = req.body.productindex;
	}else{
	  	res.json({"code":errorcode.PARAMS_FAILED});
	  	return;
	}
	if(req.body.price && req.body.price !=""){
		product["price"] = req.body.price;
	}
	if(req.body.balance && req.body.balance !=""){
		product["balance"] = req.body.balance;
	}
	if(req.body.minlimit && req.body.minlimit !=""){
		product["minlimit"] = req.body.minlimit;
	}
	product["sold"] =0
	if(req.body.datetimerange && req.body.datetimerange !=""){
		let datetimerange = req.body.datetimerange;
		product["begintime"] = moment(datetimerange[0]).format("YYYY-MM-DD HH:mm:ss");
		product["endtime"] = moment(datetimerange[1]).format("YYYY-MM-DD HH:mm:ss");
	}else{
		res.json({"code":errorcode.PARAMS_FAILED});
		return;
	}
	console.log(product);
	productDBModel.addGroupPurchase(product,function(result){
	  	global.logger.info(result);
	  	res.json({"code":result.code })
	});
}

productController.setGroupPurchase = function (req, res) {
	
	global.logger.info(req.body);
	let product = [];
	if(req.body.index && req.body.index > 0){
		product["index"] = req.body.index;
	}else{
	  	res.json({"code":errorcode.PARAMS_FAILED});
	  	return;
	}
	if(req.body.price && req.body.price !=""){
		product["price"] = req.body.price;
	}
	if(req.body.balance && req.body.balance !=""){
		product["balance"] = req.body.balance;
	}
	
	if(req.body.datetimerange && req.body.datetimerange !=""){
		let datetimerange = req.body.datetimerange;
		product["begintime"] = moment(datetimerange[0]).format("YYYY-MM-DD HH:mm:ss");
		product["endtime"] = moment(datetimerange[1]).format("YYYY-MM-DD HH:mm:ss");
	}else{
		res.json({"code":errorcode.PARAMS_FAILED});
		return;
	}
	console.log(product);
	res.json({"code":errorcode.SUCCESS })
	productDBModel.setGroupPurchase(product,function(result){
	  	global.logger.info(result);
	  	res.json({"code":result.code })
	});
}

/**
 * 批量删除
 * @param req
 * @param res
 */
productController.removeGroupPurchaseBatch = function (req, res) {
	let indexs = req.params.indexs;
	global.logger.info(req.body.indexs);
	global.logger.info(req.params);
	global.logger.info(indexs);
	if (!indexs) {
    	return res.json({"code": errorcode.PARAMS_FAILED});
	}
	productDBModel.removeGroupPurchase(indexs,function(result){
		global.logger.info(result);
		res.json(result);
	});
};
productController.trashGroupPurchaseBatch = function (req, res) {
	let indexs = req.params.indexs;
	global.logger.info(req.body.indexs);
	global.logger.info(req.params);
	global.logger.info(indexs);
	if (!indexs) {
    	return res.json({"code": errorcode.PARAMS_FAILED});
	}
	productDBModel.trashGroupPurchase(indexs,function(result){
		global.logger.info(result);
		res.json(result);
	});
};
module.exports = productController;
