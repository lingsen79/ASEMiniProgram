const { uploader } = require('../qcloud')
const productDBModel = require('../lib/db.product.class')
const errorcode = require('../lib/error.class');
let productController = {};

/**
 * 通过查询，获取列表
 * @param req
 * @param res
 */
productController.find = async (ctx) => {
  let query = ctx.request.query;
  let page = parseInt(query.page || 1); //页码（默认第1页）
  let limit = parseInt(query.limit || 10); //每页显示条数（默认10条）
  let title = query.title || '';
  let offset = (page - 1) * limit;
  let filters = new Array();
  if (title != "") filters.push({ "field": "`title`", "value": title, "type": "likes" });
  var sorts = new Array();

  let result = await productDBModel.find(offset, limit, filters, sorts);
  return ctx.response.body = result;
};

module.exports = productController;
