let smController = {};
const userDBModel = require('../../lib/db.user.class')
const errorcode = require('../../lib/error.class.js');

smController.add = async (ctx) => {
  let body = ctx.request.body;

  try {

    let user = {
      mobile: body.mobile,
      name: body.name,
      password: body.password,
      sex: 0,
      age: 0,
      birth: null,
      address: body.address,
      remark: body.remark,
      type: 1
    }

    if (!user.mobile) {
      return ctx.response.body = { "code": errorcode.PARAMS_FAILED, "errmsg": "不合法的参数" };
    }
    let result = await userDBModel.add(user);
    ctx.response.body = result;
    //result.rows = rows;
  } catch (e) {
    ctx.response.body = {code:errorcode.FAILED}
  } finally {

    ctx.state.data = 'this a sm2 index response!';
  }

};

smController.remove = async (ctx) => {
  let body = ctx.request.body;
  console.log(body)
  try {

    let indexs = body.indexs;
    console.log(indexs)
    if (!indexs) {
      ctx.response.body = { "code": errorcode.PARAMS_FAILED, "errmsg": "不合法的参数", body: body };
      return;
    }
    let result = await userDBModel.removesm(indexs);
    console.log(result)
    ctx.response.body = result;
    //ctx.response.body = { code: errorcode.SUCCESS, debug: result }
  } catch (e) {
    ctx.response.body = { code: errorcode.FAILED ,debug :e,exception:1}
  } finally {
    //ctx.state.data = 'remove sm response!';
  }

};

module.exports = smController;