const { mysql } = require('../qcloud')
const errorcode = require('./error.class.js');
const uti = require('./utility.class.js');
let userDBModel = {};

/*
 * 查找用户
 * @param offset
 * @param limit
 * @param filters
 * @param sorts
 */
userDBModel.find = async (offset, limit, filters, sorts) => {
    let wheres = uti.formatSqlWhereDefine(filters,sorts);
    let result  = await global.asemini_conn.raw("select `index`, `name`, `password`, `mobile`, `sex`, `age`, `birth`, `address`, `remark`, `modifytime`, `createtime`, `type`, `totalpoint` from user " + wheres[0] + wheres[1] + " limit " + offset + "," + limit);
    let rows = result[0];

    result = await global.asemini_conn.raw("select count(1) count from user " + wheres[0]);
    let total = result[0][0]["count"];

    result = {
      code: errorcode.SUCCESS,
      total: total,
      rows: rows
    }
    
    return result;
};


/*
 * 添加新用户
 * @param req
 * @param res
 */
userDBModel.add = async (user) =>{
  
    var result = {
      code: errorcode.ADD_FAILED,
      userIndex: 0
    }
    try {
      user.modifytime = new Date();
      user.createtime = new Date();
      let row = await global.asemini_conn('user').returning('`index`').insert(user);
      result.userIndex = row[0];
      result.code = errorcode.SUCCESS;
    } catch (e) {
      result.code = errorcode.FAILED;
      console.log(e)
    } finally {
      return result;
    }
};

/*
 * 添加新用户
 * @param req
 * @param res
 */
userDBModel.set = async (user) => {
  
    var result = {
      code: errorcode.SET_FAILED,
      userIndex: 0
    }
    try {

      var columns = {};
      for (var key in user) {
        if (key != "index" && key != "modifytime" && key != "createtime") {
          columns[key] = user[key];
        }
      }

      if(Object.keys(columns).length > 0){
        columns["modifytime"] = new Date();
      }

      //sql = "update user set " + columns.join(",") + ",modifytime=now() where `index`=? ";
      let row = await global.asemini_conn('user').update(columns).where({"index":user.index});
      result.code = errorcode.SUCCESS;
      result.deug = row;
    } catch (e) {
      result.code = errorcode.FAILED;
    } finally {
      return result;
    }
};

userDBModel.remove = async (indexs) => {
  var result = {
    code: errorcode.DEL_FAILED
  }
  console.log(indexs)
  const trx = await transaction();
  try {
    await trx.raw("delete from `user` where `index` in ( " + indexs + ") and type='0' ");
    await trx.raw("delete from `vehicle` where `user_index` in ( " + indexs + ")");
    trx.commit();
    result.code = errorcode.SUCCESS;

  } catch (e) {
    trx.rollback();
    //result.debug = e;
  } finally {
    return result;
  }
}

userDBModel.removesm = async (indexs) =>{
  var result = {
    code: errorcode.DEL_FAILED
  }
  console.log(indexs)
  const trx = await transaction();
  try {
    await trx.raw("delete from `user` where `index` in ( " + indexs + ") and type='1' and `mobile`<>'administrator'");
    await trx.raw("delete from `vehicle` where `user_index` in ( " + indexs + ")");
    trx.commit();
    result.code = errorcode.SUCCESS;
    
  } catch (e) {
    trx.rollback();
    //result.debug = e;
  } finally {
    return result;
  }
}

async function transaction() {
  return new Promise((resolve) => {
    return global.asemini_conn.transaction(resolve);
  });
}
module.exports = userDBModel;