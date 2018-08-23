let authController = {};
const smDB = require('../../lib/db.user.class')
const tokenDB = require('../../lib/db.token.class')
const errorcode = require('../../lib/error.class.js');
const uti = require('../../lib/utility.class');


/**
 * 登录
 * @param req
 * @param res
 */
authController.login = async (ctx) =>{
  //console.info(ctx.req.body);
  // let filters = [{"field":"name","value":"123"}];
  // let sorts = [];
  // let result = await smDB.find(0, 1, filters,sorts);
  // ctx.session = {user:result.rows[0]};
  // ctx.response.body = ctx.session;
  let body = ctx.request.body;
  let username = global._.trim(body.username || '');
  let pwd = uti.md5Encode(body.pwd);
  if (!username || !pwd) {
    return ctx.response.body = { "code": errorcode.PARAMS_FAILED, "errmsg": "不合法的参数", body: body};
  }


  let filters = [{ "field": "mobile", "value": username }, { "field": "type", "value": 1 }];
  let sorts = [];
  let result = await smDB.find(0, 1, filters,sorts);
  if(result.total > 0){
    let user = result.rows[0];
    if (user.password == pwd && user.type == "1"){
      let tokenrv = await tokenDB.create(user);
      if (tokenrv.code != errorcode.SUCCESS){
        ctx.response.body = { "code": tokenrv.SUCCESS, "errmsg": ""};
      }else{
        delete user.password;
        user.token = tokenrv.token;
        ctx.response.body = { "code": errorcode.SUCCESS, "errmsg": "成功", user:user};
      }
      
    }else{
      ctx.response.body = { "code": errorcode.U_PASSWORD_FAILED, "errmsg": "" };
    }
  }else{
    ctx.response.body = { "code": errorcode.U_NOEXISTS, "errmsg": "" };
  }
  
};

authController.checkStatus = async (ctx,next) => {
  //用户已经登录
  try {
    let body = ctx.request.body;
    let query = ctx.request.query;
    console.log(body);
    console.log(query)
    if ((body && body.token) || (query && query.token)) {
      //next();
      await next();
    } else {
      ctx.state = 200;
      ctx.response.body = { "code": errorcode.SESSION_NOEXISTS, "errmsg": "您还没有登录1" };
    }
  } catch (e) {
    ctx.state = 200;
    ctx.response.body = { "code": errorcode.SESSION_NOEXISTS, "errmsg": "您还没有登录2" };
  }
};

// authController.checkStatus = async (ctx) => {
//   //用户已经登录
//   try {
//     if (ctx.state.$wxInfo.loginState === 1) {
//       // loginState 为 1，登录态校验成功
//       ctx.state.data = ctx.state.$wxInfo.userinfo
//     } else {
//       ctx.state.code = -1
//     }
//   } catch (e) {
//     ctx.state = 200;
//     ctx.response.body = { "code": errorcode.SESSION_NOEXISTS, "errmsg": "您还没有登录2" };
//   }
// };

/**
 * 退出登录
 * @param req
 * @param res
 */
authController.logout = async (ctx) =>{
  //用户已经登录
  let token = "";
  try {
    let body = ctx.request.body;
    if(body.token) token = body.token;
    let query = ctx.request.query;
    if (query.token) token = query.token;

    if (token !="") {
      //next();
      tokenDB.clear();
      //tokenDB.remove(token);
    }
  } catch (e) {
    //ctx.state = 200;
    //ctx.response.body = { "code": errorcode.SESSION_NOEXISTS, "errmsg": "您还没有登录" };
  }finally{
    ctx.state = 200;
    ctx.response.body = { "code": errorcode.SUCCESS, token: token };
  }

};

module.exports = authController;

// module.exports = async  ctx => {

//   var res = await mysql('asemini.user').select('*');
//   ctx.state.data = res;
//   // if (ctx.state.$wxInfo.loginState === 1) {    
//   //    //loginState 为 1，登录态校验成功
//   //    ctx.state.data = ctx.state.$wxInfo.userinfo
//   // } else {
//   //   ctx.state.code = -1
//   // }

// } 