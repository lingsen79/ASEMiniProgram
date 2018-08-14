var crypto = require('crypto');  //加载加密文件
let uti = {};

uti.formatSqlWhereDefine = function (filters, sorts) {
  let searchsql = "";
  let sortsql = "";
  let split = "";
  for (let search of filters) {
    if (!!search.field) {
      let table = (search.table ? search.table + "." : "")
      if (!!search.type && search.type == "like") {
        searchsql += split + "" + table + search.field + " like '%" + search.value + "%' ";
      } else if (!!search.type && search.type == "likes") {
        searchsql += split + " concat_ws(','," + table + search.field + ")  like '%" + search.value + "%' ";
      } else if (!!search.type && search.type == "regexp") {
        searchsql += split + "" + table + search.field + " regexp '" + search.value.join('|') + "' ";
      } else if (!!search.type && search.type == "and") {
        searchsql += split + "" + table + search.field + " between '" + search.minValue + "' and '" + search.maxValue + "'";
      } else if (!!search.type && search.type == "greater") {
        searchsql += split + "" + table + search.field + ">='" + search.value + "'";
      } else if (!!search.type && search.type == "less") {
        searchsql += split + "" + table + search.field + "<='" + search.value + "'";
      } else if (!!search.type && search.type == "in") {
        searchsql += split + "" + table + search.field + " in (" + search.value + ") ";
      } else if (!!search.type && search.type == "unequal") {
        searchsql += split + "" + table + search.field + "<>'" + search.value + "' ";
      } else if (!!search.type && search.type == "sql") {
        searchsql += split + search.value;
      } else {
        searchsql += split + "" + table + search.field + "='" + search.value + "' ";
      }
      split = " and ";
    }
  }
  split = "";
  for (let sort of sorts) {
    if (!!search.field) {
      sortsql += split + "" + search.field + "";
      if (!!search.type) {
        sortsql += " " + search.type + " ";
      }
      split = ",";
    }
  }

  if (!!searchsql) {
    searchsql = " where " + searchsql;
    //  } else {
    //      if (!!searchs[0] && !!searchs[0].value) {
    //          searchsql = " where `index` = " + searchs[0].value;
    //      }
  }

  if (!!sortsql) {
    sortsql = " order by " + sortsql;
  }

  return [searchsql, sortsql];
}

uti.md5Encode = function (str) { //暴露出md5s方法
  var md5 = crypto.createHash('md5');
  md5.update(str);
  str = md5.digest('hex');
  return str;
}
module.exports = uti;