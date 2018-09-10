const { mysql } = require('../qcloud')
const errorcode = require('./error.class.js');
const uti = require('./utility.class.js');
let productDBModel = {};

/*
 * 查找产品
 * @param req
 * @param res
 */
productDBModel.find = async (offset,limit,filters,sorts) =>{

  let wheres = uti.formatSqlWhereDefine(filters, sorts);
  let result = await global.asemini_conn.raw("select `index`,`title`,`summary`,`price`,`type`,`discountprice`,`sold`,`description`,`purchasenotes`,`regulations`,`imagename`,`modifytime`,`createtime`,`imagepath`,`logicdel` from `product` " + wheres[0] + wheres[1] + " limit " + offset + "," + limit);
  let rows = result[0];

  result = await global.asemini_conn.raw("select count(1) count from `product` " + wheres[0]);
  let total = result[0][0]["count"];

  result = {
    code: errorcode.SUCCESS,
    total: total,
    rows: rows
  }

  return result;    
};


/*
 * 添加
 * @param req
 * @param res
 */
productDBModel.add = async (product) =>{

  var result = {
    code: errorcode.ADD_FAILED,
    index: 0
  }
  try {
    product.modifytime = new Date();
    product.createtime = new Date();
    let row = await global.asemini_conn('product').returning('`index`').insert(product);
    result.index = row[0];
    result.code = errorcode.SUCCESS;
  } catch (e) {
    result.code = e;
    result.debug = e;
  } finally {
    return result;
  }
};

/*
 * 设置
 * @param req
 * @param res
 */
productDBModel.set = async (product)=> {
  var result = {
    code: errorcode.SET_FAILED,
    index: 0
  }
  try {
    var columns = new Array();
    for (var key in product) {
      if (key != "index" && key != "modifytime" && key != "createtime") {
        columns.set(key, product[key]);
      }
    }

    if (columns.length > 0) {
      columns.set("modifytime", new Date());
    }

    let row = await global.asemini_conn('product').update(columns).where({ "index": product.index });
    result.code = errorcode.SUCCESS;
    result.deug = row;
  } catch (e) {
    result.code = errorcode.FAILED;
  } finally {
  }
};

productDBModel.remove = async (indexs)=>{

  var result = {
    code: errorcode.DEL_FAILED
  }
  const trx = await transaction();
  try {
    await trx.raw("delete from `product` where `index` in ( " + indexs + ")  ");    
    trx.commit();
    result.code = errorcode.SUCCESS;

  } catch (e) {
    trx.rollback();
  } finally {
    return result;
  }

}

productDBModel.findBuyLimit = async (offset,limit,filters,sorts)=> {

  let wheres = uti.formatSqlWhereDefine(filters, sorts);
  let result = await global.asemini_conn.raw("SELECT b.*,`p`.`title`,`p`.`summary`,`p`.`price` origprice,`p`.`description`,`p`.`purchasenotes`,`p`.`regulations`,`p`.`imagename`,`p`.`imagepath` FROM `buylimit` b inner join product p on p.`index`=b.`product_index`  " + wheres[0] + wheres[1] + " limit " + offset + "," + limit);
  let rows = result[0];

  result = await global.asemini_conn.raw("select count(1) count from `buylimit` b inner join product p on p.`index`=b.`product_index` " + wheres[0]);
  let total = result[0][0]["count"];

  result = {
    code: errorcode.SUCCESS,
    total: total,
    rows: rows
  }
  return result;   
};


productDBModel.addBuyLimit = async (product)=> {
  var result = {
    code: errorcode.ADD_FAILED,
    index: 0
  }
  try {
    product.modifytime = new Date();
    product.createtime = new Date();
    let row = await global.asemini_conn('buylimit').returning('`index`').insert(product);
    result.index = row[0];
    result.code = errorcode.SUCCESS;
  } catch (e) {
    result.code = errorcode.FAILED;
  } finally {
    return result;
  }
};


productDBModel.setBuyLimit = async (product) => {

  var result = {
    code: errorcode.SET_FAILED,
    index: 0
  }
  try {
    var columns = new Array();
    for (var key in product) {
      if (key != "index" && key != "modifytime" && key != "createtime") {
        columns.set(key, product[key]);
      }
    }

    if (columns.length > 0) {
      columns.set("modifytime", new Date());
    }

    let row = await global.asemini_conn('buylimit').update(columns).where({ "index": product.index });
    result.code = errorcode.SUCCESS;
    result.deug = row;
  } catch (e) {
    result.code = errorcode.FAILED;
  } finally {
  }

};

productDBModel.trashBuyLimit = async(indexs) =>{

  var result = {
    code: errorcode.SET_FAILED
  }
  try {

    indexs = indexs.split(",");
    let row = await global.asemini_conn('buylimit').update({ logicdel: 1 }).whereIn({ "index": indexs });
    result.code = errorcode.SUCCESS;
    result.deug = row;
  } catch (e) {
    result.code = errorcode.FAILED;
  } finally {
  }
}

productDBModel.removeBuyLimit = async (indexs) =>{
  var result = {
    code: errorcode.DEL_FAILED
  }
  console.log(indexs)
  const trx = await transaction();
  try {
    await trx.raw("delete from `buylimit` where `index` in ( " + indexs + ")  ");
    trx.commit();
    result.code = errorcode.SUCCESS;

  } catch (e) {
    trx.rollback();
  } finally {
    return result;
  }
}


productDBModel.findGroupPurchase = async (offset,limit,filters,sorts) =>{
  let wheres = uti.formatSqlWhereDefine(filters, sorts);
  let result = await global.asemini_conn.raw("SELECT g.*,`p`.`title`,`p`.`summary`,`p`.`price` origprice,`p`.`description`,`p`.`purchasenotes`,`p`.`regulations`,`p`.`imagename`,`p`.`imagepath` FROM `grouppurchase` g inner join product p on p.`index`=g.`product_index`   " + wheres[0] + wheres[1] + " limit " + offset + "," + limit);
  let rows = result[0];

  result = await global.asemini_conn.raw("select count(1) count from `grouppurchase` g inner join product p on p.`index`=g.`product_index` " + wheres[0]);
  let total = result[0][0]["count"];

  result = {
    code: errorcode.SUCCESS,
    total: total,
    rows: rows
  }
  return result;
};

productDBModel.addGroupPurchase = async (product) => {

  var result = {
    code: errorcode.ADD_FAILED,
    index: 0
  }
  try {
    product.modifytime = new Date();
    product.createtime = new Date();
    let row = await global.asemini_conn('grouppurchase').returning('`index`').insert(product);
    result.index = row[0];
    result.code = errorcode.SUCCESS;
  } catch (e) {
    result.code = errorcode.FAILED;
  } finally {
    return result;
  }
};

productDBModel.setGroupPurchase = async (product) => {

  var result = {
    code: errorcode.SET_FAILED,
    index: 0
  }
  try {
    var columns = new Array();
    for (var key in product) {
      if (key != "index" && key != "modifytime" && key != "createtime") {
        columns.set(key, product[key]);
      }
    }

    if (columns.length > 0) {
      columns.set("modifytime", new Date());
    }

    let row = await global.asemini_conn('grouppurchase').update(columns).where({ "index": product.index });
    result.code = errorcode.SUCCESS;
    result.deug = row;
  } catch (e) {
    result.code = errorcode.FAILED;
  } finally {
  }

};


productDBModel.trashGroupPurchase = async (indexs) => {

  var result = {
    code: errorcode.SET_FAILED
  }
  try {

    indexs = indexs.split(",");
    let row = await global.asemini_conn('grouppurchase').update({ logicdel: 1 }).whereIn({ "index": indexs });
    result.code = errorcode.SUCCESS;
    result.deug = row;
  } catch (e) {
    result.code = errorcode.FAILED;
  } finally {
  }
}

productDBModel.removeGroupPurchase = async (indexs) => {
  var result = {
    code: errorcode.DEL_FAILED
  }
  console.log(indexs)
  const trx = await transaction();
  try {
    await trx.raw("delete from `grouppurchase` where `index` in ( " + indexs + ")  ");
    trx.commit();
    result.code = errorcode.SUCCESS;

  } catch (e) {
    trx.rollback();
  } finally {
    return result;
  }
}

module.exports = productDBModel;
