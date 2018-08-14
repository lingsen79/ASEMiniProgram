const { mysql } = require('../qcloud')


module.exports = async  ctx => {

  var res = await mysql('asemini.user').select('*');
  ctx.state.data = res;
  // if (ctx.state.$wxInfo.loginState === 1) {    
  //    //loginState 为 1，登录态校验成功
  //    ctx.state.data = ctx.state.$wxInfo.userinfo
  // } else {
  //   ctx.state.code = -1
  // }
  
} 