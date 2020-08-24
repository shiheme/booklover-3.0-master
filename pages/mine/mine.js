// pages/mine/mine.js
const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  /**
   * 页面的初始数据
   */
  data: {
    user: '',
    
    isActive: true, //定义头部导航是否显示背景
    isSearch: true,
    isSkin: true
  },
  attached: function(options) {

  },
  pageLifetimes: {
    show: function() {

    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  methods: {

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      let that = this;
      let user = app.globalData.user
      if (!user) {
        user = '';
      }
      this.setData({
        user: user,
      })

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
          // console.log(res.currentSize);
        }
      })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    getProfile: function(e) {
      // console.log(e);
      API.getProfile().then(res => {
        // console.log(res)
        this.setData({
          user: res
        })
        wx.hideLoading()
        if(!res){
          wx.showToast({
            title: '哎呀！/r/n你拒绝了授权',
            icon: 'none',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000,
          })
        }
        })
        .catch(err => {
          wx.hideLoading()
        })
    },

    subscribeMessage: function(template, status) {
      let args = {}
      args.openid = this.data.user.openId
      args.template = template
      args.status = status
      args.pages = getCurrentPages()[0].route
      args.platform = wx.getSystemInfoSync().platform
      args.program = 'WeChat'
      API.subscribeMessage(args).then(res => {
          // console.log(res)
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 1000
          })
        })
        .catch(err => {
          console.log(err)
          wx.showToast({
            title: err.message,
            icon: 'success',
            duration: 1000
          })
        })
    },

    bindHandler: function(e) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url,
      })
    },

    bindSubscribe: function() {
      let that = this
      let templates = API.template().subscribe
      wx.requestSubscribeMessage({
        tmplIds: templates,
        success(res) {
          if (res.errMsg == "requestSubscribeMessage:ok") {
            for (let i = 0; i < templates.length; i++) {
              let template = templates[i]
              that.subscribeMessage(template, "accept")
            }
          }
        },
        fail: function(res) {
          // console.log(res)
        }
      })
    },

    loginOut: function() {
      API.Loginout();
      this.onLoad();
    },

    clear: function(e) {
      wx.clearStorageSync();
      wx.showToast({
        title: '清除完毕',
      })
      this.onLoad();
    },
  }
})