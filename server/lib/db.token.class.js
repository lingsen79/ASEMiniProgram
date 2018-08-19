const { mysql } = require('../qcloud')
const errorcode = require('./error.class.js');
const uti = require('./utility.class.js');
let tokenDBModel = {};

/*
 * 查找用户
 * @param offset
 * @param limit
 * @param filters
 * @param sorts
 */
tokenDBModel.find = async (filters, sorts) => {
  let wheres = uti.formatSqlWhereDefine(filters, sorts);
  let result = await global.asemini_conn.raw("select `index`, `token`, `user_index`, `expiretime` from token t,user u " + wheres[0] + wheres[1]);
  let rows = result[0];

  result = {
    code: errorcode.SUCCESS,
    rows: rows
  }
  return result;
};

tokenDBModel.create = async (user) => {
  let t = new Date();
  let token = uti.md5Encode(user.index + user.mobile+t);
  let result = await global.asemini_conn('token').insert([{ token: token, user_index: user.index , expiretime: t }]);
  if(result[0] > 0){
    return {code:errorcode.SUCCESS, token: token };
  }
  return { code: errorcode.ADD_FAILED };
  
}

tokenDBModel.remove = async (token) => {
  await global.asemini_conn('token').where('token', token).del();
}

tokenDBModel.clear = async() =>{
  await global.asemini_conn.raw('delete from `token` where `expiretime`<date_sub(now(), INTERVAL 2 DAY)');
}
module.exports = tokenDBModel;