const productDBModel = require('../../lib/db.product')
const errorcode = require('../../lib/error.class');
let userController = {};

/*
const Mock = require('mockjs');
const errorcode = require('../models/error.class.js');
const productDBModel = require('../models/db.product');
const uti = require('../models/utils');
const moment = require('moment');
let productController = {};
var multiparty = require('multiparty');
var fs = require("fs");
var request = require('request');
*/

/**
 * 通过查询，获取列表
 * @param req
 * @param res
 */
productController.find = async (ctx)=> {
  let query = ctx.request.query;
	let page = parseInt(query.page || 1); //页码（默认第1页）
	let limit = parseInt(query.limit || 10); //每页显示条数（默认10条）
	let title = query.title || '';
	let offset = (page-1) * limit;
	let filters = new Array();
	if(title != "") filters.push({"field":"`title`","value":title,"type":"likes"});
	var sorts = new Array();
	
	productDBModel.find(offset,limit,filters,sorts,function(result){
    ctx.response.body = result;
	});
};


/*
 * 添加
 * @param req
 * @param res
 */
productController.add = async (ctx) => {
  let body = ctx.request.body;
  let product = {
  	title:body.title,
  	summary:body.summary,
  	imagename:body.imagename,
  	imagepath:body.imagepath,
    price:body.price,
    type:1,
    sold:0,
  	description:body.description,
  	remark:body.remark
  }
  productDBModel.add(product,function(result){
    ctx.response.body = {"code":result.code };
  });
};

/*
 * 编辑
 * @param req
 * @param res
 */
productController.set = async (ctx) => {
  let body = ctx.request.body;
	let product = [];
	if(body.index && body.index > 0){
		product["index"] = body.index;
	}else{
	  	res.json({"code":errorcode.PARAMS_FAILED});
	}
  
	if(body.title && body.title !=""){
		product["title"] = body.title;
	}
	
	if(body.summary && body.summary !=""){
		product["summary"] = body.summary;
	}
	
	if(body.imagename && body.imagename !=""){
		product["imagename"] = body.imagename;
	}
	
	if(body.imagepath && body.imagepath !=""){
		product["imagepath"] = body.imagepath;
	}
	
	if(body.price && body.price !=""){
		product["price"] = body.price;
	}
	
	if(body.description && body.description !=""){
		product["description"] = body.description;
	}
	
	if(body.remark && body.remark !=""){
		product["remark"] = body.remark;
	}
	if(body.purchasenotes && body.purchasenotes !=""){
		product["purchasenotes"] = body.purchasenotes;
	}
	if(body.regulations && body.regulations !=""){
		product["regulations"] = body.regulations;
	}
	productDBModel.set(product,function(result){   
    ctx.response.body = { "code": result.code };
	});
};


productController.upload = async (ctx) => {
  /*
	var form = new multiparty.Form({uploadDir: global.conf.uploadImageTargetDir});//'./server/uploadfile/'
	form.parse(req, function(err, fields, files) {
		let f = files.file[0];
		let npath = form.uploadDir+f.originalFilename;
      	let rv = fs.renameSync(f.path,npath);
  		res.json({"code":err,"path":npath,name: f.originalFilename});
	});
  */
  	//global.logger.info(req);
};

/**
 * 批量删除
 * @param req
 * @param res
 */
productController.removeBatch = async (ctx) => {
  let indexs = ctx.params.indexs;	
  if (!indexs) {
    ctx.response.body = { "code": errorcode.PARAMS_FAILED };
    return;
	}
	productDBModel.remove(indexs,function(result){	
    ctx.response.body = { "code": result.code };
	});
};

/**
 * 单条删除
 * @param req
 * @param res
 */
productController.remove = async (ctx) =>  {
  let index = ctx.body.index;	
  if (!index) {
    ctx.response.body = { "code": errorcode.PARAMS_FAILED };
    return;
	}	
	productDBModel.remove(index,function(result){		
    ctx.response.body = { "code": result.code };
	});
};



/**
 * 通过查询，获取秒杀列表
 * @param req
 * @param res
 */
productController.findBuyLimit = async (ctx) =>  {
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
productController.addBuyLimit = async (ctx) =>  {
	
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

productController.setBuyLimit = async (ctx) =>  {
	
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
productController.removeBuyLimitBatch = async (ctx) =>  {
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

productController.trashBuyLimitBatch = async (ctx) =>  {
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
productController.findGroupPurchase = async (ctx) =>  {
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
productController.addGroupPurchase = async (ctx) =>  {
	
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

productController.setGroupPurchase = async (ctx) =>  {
	
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
productController.removeGroupPurchaseBatch = async (ctx) =>  {
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
productController.trashGroupPurchaseBatch = async (ctx) =>  {
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
