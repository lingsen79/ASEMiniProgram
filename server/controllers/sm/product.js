const { uploader } = require('../../qcloud')
const productDBModel = require('../../lib/db.product.class')
const errorcode = require('../../lib/error.class');
let productController = {};


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
	
	let result = await productDBModel.find(offset,limit,filters,sorts);
  	return ctx.response.body = result;
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
  result = await productDBModel.add(product);
  ctx.response.body = {"code":result.code};
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
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
		return;
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
	
	let result = await productDBModel.set(product);
	ctx.response.body = {"code":result.code};
};


productController.upload = async (ctx) => {
  // 获取上传之后的结果
  // 具体可以查看：
  const data = await uploader(ctx.req)
  console.log(data)

  ctx.state.data = data;
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
	let result = await productDBModel.removesm(indexs);
	ctx.response.body = {"code":result.code};
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
	let result = await productDBModel.remove(index);
	ctx.response.body = {"code":result.code};
};



/**
 * 通过查询，获取秒杀列表
 * @param req
 * @param res
 */
productController.findBuyLimit = async (ctx) =>  {
	let query = ctx.query;
	let page = parseInt(query.page || 1); //页码（默认第1页）
	let limit = parseInt(query.limit || 10); //每页显示条数（默认10条）
	let title = query.title || '';
	let offset = (page-1) * limit;
	let filters = new Array();
	filters.push({"field":"logicdel","value":'0',"table":'b'});
	if(title != "") filters.push({"field":"`title`","value":title,"type":"likes"});
	var sorts = new Array();
	
	let result = await productDBModel.findBuyLimit(offset,limit,filters,sorts);
	return ctx.response.body = result;	  
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
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
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
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
		return;
	}
	console.log(product);
	
	let result = await productDBModel.addBuyLimit(product);
	ctx.response.body = {"code":result.code};
}

productController.setBuyLimit = async (ctx) =>  {
	
	global.logger.info(req.body);
	let product = [];
	if(req.body.index && req.body.index > 0){
		product["index"] = req.body.index;
	}else{
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
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
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
		return;
	}
	console.log(product);	
	let result = await productDBModel.setBuyLimit(product);
	ctx.response.body = {"code":result.code};
}

/**
 * 批量删除
 * @param req
 * @param res
 */
productController.removeBuyLimitBatch = async (ctx) =>  {
	let indexs = ctx.params.indexs;
	global.logger.info(indexs);
	if (!indexs) {
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
		return;
	}
	let result = await productDBModel.removeBuyLimit(indexs);
	ctx.response.body = {"code":result.code};
};

productController.trashBuyLimitBatch = async (ctx) =>  {
	let indexs = ctx.params.indexs;
	global.logger.info(indexs);
	if (!indexs) {
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
		return;
	}
	let result = await productDBModel.trashBuyLimit(indexs);
	ctx.response.body = {"code":result.code};
	
};


/**
 * 通过查询，获取团购列表
 * @param req
 * @param res
 */
productController.findGroupPurchase = async (ctx) =>  {
	let query = ctx.query;
	let page = parseInt(query.page || 1); //页码（默认第1页）
	let limit = parseInt(query.limit || 10); //每页显示条数（默认10条）
	let title = query.title || '';
	let offset = (page-1) * limit;
	let filters = new Array();
	filters.push({"field":"logicdel","value":'0',"table":"g"});
	if(title != "") filters.push({"field":"`title`","value":title,"type":"likes"});
	var sorts = new Array();
	
	let result = await productDBModel.findGroupPurchase(offset,limit,filters,sorts);
	ctx.response.body = result;
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
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
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
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
		return;
	}
	console.log(product);
	let result = await productDBModel.addGroupPurchase(product);
	ctx.response.body = {"code":result.code};

}

productController.setGroupPurchase = async (ctx) =>  {
	
	global.logger.info(req.body);
	let product = [];
	if(req.body.index && req.body.index > 0){
		product["index"] = req.body.index;
	}else{
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
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
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
		return;
	}
	console.log(product);
	let result = await productDBModel.setGroupPurchase(product);
	ctx.response.body = {"code":result.code};
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
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
		return;
	}
	let result = await productDBModel.removeGroupPurchase(indexs);
	ctx.response.body = {"code":result.code};
};
productController.trashGroupPurchaseBatch = async (ctx) =>  {
	let indexs = req.params.indexs;
	global.logger.info(req.body.indexs);
	global.logger.info(req.params);
	global.logger.info(indexs);
	if (!indexs) {
		ctx.response.body = {"code":errorcode.PARAMS_FAILED};
		return;
	}
	let result = await productDBModel.trashGroupPurchase(indexs);
	ctx.response.body = {"code":result.code};
};
module.exports = productController;
