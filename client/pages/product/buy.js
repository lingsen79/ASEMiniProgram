
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productinfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */  
  onLoad: function (options) {
    this.fetch_product(options.pid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  fetch_product: function (pid) {

    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestClientUrl + "/product?index="+pid,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        if (result.data.rows.length > 0) {
          that.setData({ productinfo: result.data.rows[0] });
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    qcloud.request(options);
  },
})