//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  data: {
    productList: {},
  },
  onLoad: function(options) {
    // Do some initialize when page load.
    this.fetch_product();
  },
  onReady: function() {
    // Do something when page ready.
  },
  fetch_product:function(){
    
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestClientUrl+"/product",
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        that.setData({productList:result.data.rows});
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    qcloud.request(options);
  },
  end:true
})