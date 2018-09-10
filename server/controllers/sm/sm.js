let smController = {};
const userDBModel = require('../../lib/db.user.class')
const errorcode = require('../../lib/error.class.js');

/**
 * 修改信息
 * @param req
 * @param res
 */
smController.profile = async (ctx)=> {
  let body = ctx.request.body;
	let address = body.address;
	let remark = body.remark;
	let name  = body.name;
	let user = {
		index:ctx.state.sm.index,
		address:address,
		remark:remark,
		name:name
  }
  
  
	let result = await userDBModel.set(user);
  return ctx.response.body = result;
};

/**
 * 修改密码
 * @param req
 * @param res
 */
smController.changepwd = async (ctx)=> {
  let body = ctx.request.body;
 	//TODO 未开发
	let password = body.oldPwd;
	let npassword  = body.newPwd;
	let user = {index:ctx.state.sm.index,password:password};
	let result = {code:errorcode.SET_FAILED};
  	password = uti.md5Encode(password);
  	
  	if(user.password == password){
      user.password = uti.md5Encode(npassword);      
      result = await userDBModel.set(user);
  
  	}else{
    }
    
    return ctx.response.body = result;
};

smController.resetpwd = async (ctx)=> {
  let body = ctx.request.body;
	let user = [];
	if(body.index && body.index > 0){
		user["index"] = body.index;
	}else{
    ctx.response.body = {"code":errorcode.PARAMS_FAILED};
	  return;
	}
	
	if(body.password && body.password != ""){
		global.logger.info(uti.md5Encode(body.password));
		user["password"] = uti.md5Encode(body.password);
	}else{
    ctx.response.body = {"code":errorcode.PARAMS_FAILED};
    return;
	}

  result = await userDBModel.set(user);  
  return ctx.response.body = result;
}

/**
 * 
 * @param req
 * @param res
 */
smController.find = async (ctx)=> {
  let query = ctx.request.query;
	let page = parseInt(query.page || 1); //页码（默认第1页）
	let limit = parseInt(query.limit || 10); //每页显示条数（默认10条）
	let name = query.name || '';
	let offset = (page-1) * limit;
  let filters = new Array();
  //console.log(ctx.state.sm)
	filters.push({"field":"type","value":'1'});
	if(name != "") filters.push({"field":"name","value":name,"type":"like"});
	var sorts = new Array();
	let result = await userDBModel.find(offset,limit,filters,sorts);
  return ctx.response.body = result;
	// userDBModel.find(offset,limit,filters,sorts,function(result){
	// 	global.logger.info(result);
	// 	res.json(result);
	// });
};

smController.check_mobile = async (ctx)=> {
  let body = ctx.request.body;
	let mobile = body.mobile;
  let index = (body.index ? body.index : -1);
  let code = errorcode.OBJECT_EXISTS
	if(!mobile){
      ctx.response.body = {"code":code};
      return;
	}else{
    var filters = [{"field":"mobile","value":mobile}];
    var sorts = new Array();
    let result = await userDBModel.find(0,1,filters,sorts);
    if(result.code == errorcode.SUCCESS && result.total > 0){
      var u = result.rows[0];
      if(index > 0 && u.index == index){
        code = errorcode.SUCCESS;
      }else{
        code = errorcode.OBJECT_EXISTS;
      }
    }else{
      code = errorcode.SUCCESS;
    }
	}
  ctx.response.body = {"code":code};
};

/*
 * 添加新用户
 * @param req
 * @param res
 */
smController.add = async (ctx)=> {
  let body = ctx.request.body;
  let user = {
    mobile:body.mobile,
    name:body.name,
    password:body.password,
    sex:0,
    age:0,
    birth:null,
    address:body.address,
    remark:body.remark,
    type:1
  }

  let result = await userDBModel.add(user);
  ctx.response.body = {"code":result.code};
};

/*
 * 编辑用户
 * @param req
 * @param res
 */
smController.set = async (ctx)=> {
  let body = ctx.request.body;
	let user = [];
	if(body.index && body.index > 0){
		user["index"] = body.index;
	}else{
      ctx.response.body = {"code":errorcode.PARAMS_FAILED};
      return;
	}
	if(body.mobile && body.mobile != ""){
		user["mobile"] = body.mobile;
	}else{
      ctx.response.body = {"code":errorcode.PARAMS_FAILED};
      return;
	}
	if(body.name && body.name != ""){
		user["name"] = body.name;
	}
	
	if(body.remark ){
		user["remark"] = body.remark;
	}	
  
  let result = await userDBModel.set(user);
  ctx.response.body = {"code":result.code};
};


/**
 * 批量删除
 * @param req
 * @param res
 */
smController.removeBatch = async (ctx)=> {
  let indexs = ctx.params.indexs;
	global.logger.info(indexs);
	if (!indexs) {
    	return res.json({"code": errorcode.PARAMS_FAILED});
	}
  let result = await userDBModel.removesm(indexs);
  ctx.response.body = {"code":result.code};
};


module.exports = smController;