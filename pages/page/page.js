// pages/list/list.js
const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  properties: {
    // 接受页面参数
    posttype: String,
    title: {
      type: String,
      value: ''
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    
    isActive: true, //定义头部导航是否显示背景
    isGoback: true,

  },
  attached: function (options) {

  },

  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // this.getSiteInfo();
      // app.loaclCallBack = res => {
        this.setData({
          siteinfo: app.globalData.siteinfo
        })
      // }
      console.log(this.data.siteinfo)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      let that = this;
      
      //获取缓存使用情况
      wx.getStorageInfo({
        success(res) {
          var currentSize = res.currentSize;
          if (currentSize < 1024) {
            that.setData({
              currentSize: currentSize + 'Kb'
            });
          } else {
            currentSize = currentSize / 1024;
            currentSize = String(currentSize).replace(/^(.*\..{2}).*$/, "$1");
            currentSize = parseFloat(currentSize);
            that.setData({
              currentSize: currentSize + 'Mb'
            });
          }
          // console.log('size',res.currentSize);
        }
      })
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
      return {
        title: this.data.siteinfo.description + ' - ' + this.data.siteinfo.name,
        path: '/pages/index/index'
      }
    },

    clear: function(e) {
      wx.clearStorageSync();
      wx.showToast({
        title: '清除完毕',
      })
    },

    
  }
})