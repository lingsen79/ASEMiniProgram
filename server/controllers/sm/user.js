const userDBModel = require('../../lib/db.user.class')
const errorcode = require('../../lib/error.class');
const uti = require('../../lib/utility.class');
let userController = {};

/**
 * 修改密码
 * @param req
 * @param res
 */
userController.changepwd = async (ctx) =>{
  //TODO 未开发
};

userController.resetpwd = async (ctx) => {
  let body = ctx.request.body;
	
	let user = [];
	if(body.index && body.index > 0){
		user["index"] = body.index;
	}else{
    return ctx.response.body = { "code": errorcode.PARAMS_FAILED };
	}
	
	if(body.password && body.password != ""){
		user["password"] = uti.md5Encode(body.password);
  } else {
    return ctx.response.body = { "code": errorcode.PARAMS_FAILED };
	}

  let result = await userDBModel.set(user);
  ctx.response.body = result;
}
/**
 * 查询
 * @param req
 * @param res
 */
userController.find = async (ctx) => {
  let query = ctx.request.query;
  console.log(query)
	let page = parseInt(query.page || 1); //页码（默认第1页）
	let limit = parseInt(query.limit || 10); //每页显示条数（默认10条）
	let name = query.name || '';
	let offset = (page-1) * limit;

  // let filters = [{ "field": "mobile", "value": username }, { "field": "type", "value": 1 }];
  // let sorts = [];
  // let result = await smDB.find(offset, limit, filters, sorts);

	let filters = new Array();
	filters.push({"field":"type","value":'0'});
	if(name != "") filters.push({"field":"`name`,`mobile`","value":name,"type":"likes"});
	var sorts = new Array();	
  let result = await userDBModel.find(offset,limit,filters,sorts);
  return ctx.response.body = result;
};


userController.check_mobile = async (ctx) => {
  let body = ctx.request.body;
	let mobile = body.mobile;
	let index = (body.index ? body.index : -1);
  if (!mobile) {
    return ctx.response.body = { "code": errorcode.PARAMS_FAILED };  		
	}else{
    var filters = [{"field":"mobile","value":mobile}];
    var sorts = new Array();
    let result = await userDBModel.find(0, 1, filters, sorts);

    if (result.code == errorcode.SUCCESS && result.total > 0) {
      var u = result.rows[0];
      if (index > 0 && u.index == index) {
        return ctx.response.body = { "code": errorcode.SUCCESS };  		        
      } else {
        return ctx.response.body = { "code": errorcode.OBJECT_EXISTS };  
      }
    } else {
      return ctx.response.body = { "code": errorcode.SUCCESS };
    }
	}
};

/*
 * 添加新用户
 * @param req
 * @param res
 */
userController.add = async (ctx) => {
  let body = ctx.request.body;
  let user = {
  	mobile:body.mobile,
  	name:body.name,
  	password:uti.md5Encode(body.password),
  	sex:body.sex,
  	age:body.age,
  	birth:(body.birth ? body.birth : null),
  	address:body.addr,
  	remark:body.remark,
  	type:0,
  	password:body.password,
  }
  let result = await userDBModel.add(user);
  ctx.response.body = result;
};

/*
 * 编辑用户
 * @param req
 * @param res
 */
userController.set = async (ctx) =>{

  let body = ctx.request.body;
	let user = [];
	if(body.index && body.index > 0){
		user["index"] = body.index;
  } else {
    return ctx.response.body = { "code": errorcode.PARAMS_FAILED };  	
	}
	if(body.mobile && body.mobile != ""){
		user["mobile"] = body.mobile;
  } else {
    return ctx.response.body = { "code": errorcode.PARAMS_FAILED };  	
	}
	if(body.name && body.name != ""){
		user["name"] = body.name;
	}
	
	if(body.sex && body.sex != ""){
		user["sex"] = body.sex;
	}
	if(body.age ){
		user["age"] = body.age;
	}
	if(body.birth){
		user["birth"] = body.birth;
	}
	if(body.address ){
		user["address"] = body.address;
	}

  let result = await userDBModel.set(user);
  ctx.response.body = result;
};


/**
 * 批量删除
 * @param req
 * @param res
 */
userController.removeBatch = async (ctx) => {
  let params = ctx.params;
  let indexs = params.indexs;
  console.log(indexs)
  if (!indexs) {
    ctx.response.body = { "code": errorcode.PARAMS_FAILED, "errmsg": "不合法的参数", body: body };
    return;
  }

  let result = userDBModel.remove(indexs);
  ctx.response.body = result;
};

/**
 * 单条删除
 * @param req
 * @param res
 */
userController.remove = async (ctx) => {
  let params = ctx.params;
  let index = params.index;
  if (!index) {
    ctx.response.body = { "code": errorcode.PARAMS_FAILED, "errmsg": "不合法的参数", body: body };
    return;
  }

  let result = userDBModel.remove(index);
  ctx.response.body = result;
};

module.exports = userController;
