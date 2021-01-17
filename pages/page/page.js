// pages/page/page.js
const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

let rewardedVideoAd = null

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
    videolook: false,
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
      // 对于分享进入的链接做内容类型缓存
      if (options.cnttype) {
        let cnttype = options.cnttype;
        app.globalData.cnttype = cnttype
      } else if (wx.getStorageSync('cnttype')) {
        let cnttype = wx.getStorageSync('cnttype');
        app.globalData.cnttype = cnttype
      } else {
        let cnttype = this.data.cnttype;
        app.globalData.cnttype = cnttype
      }

      this.setData({
        cnttype: app.globalData.cnttype
      })
      //保存到本地
      wx.setStorage({
        key: "cnttype",
        data: app.globalData.cnttype
      })
      console.log(app.globalData.cnttype)
      // 结束对于分享进入的链接做内容类型缓存
      // this.getSiteInfo();
      // app.loaclCallBack = res => {
      this.setData({
        siteinfo: app.globalData.siteinfo
      })
      this.showVideoAd();
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
    onShow: function () {
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
        path: '/pages/index/index?cnttype='+this.data.cnttype
      }
    },

    clear: function (e) {
      wx.clearStorageSync();
      wx.showToast({
        title: '清除完毕',
      })
    },

    showVideoAd: function () {
      let that = this
      
      if (wx.createRewardedVideoAd) {
        rewardedVideoAd = wx.createRewardedVideoAd({
          adUnitId: 'adunit-3e6043b4117685cd'
        })
        rewardedVideoAd.onLoad(() => {
          // console.log('onLoad event emit')
        })
        rewardedVideoAd.onError((err) => {
          console.log(err);
          that.setData({
            videolook: true
          })
        })
        rewardedVideoAd.onClose((res) => {
          if (res && res.isEnded) {
            that.setData({
              videolook: true
            })
          } else {
            wx.showToast({
              title: "你中途关闭了视频",
              icon: "none",
              duration: 3000
            });
          }
        })
      }
    },

    //阅读更多
    readMore: function () {
      var that = this;


      rewardedVideoAd.show()
        .catch(() => {
          rewardedVideoAd.load()
            .then(() => rewardedVideoAd.show())
            .catch(err => {
              console.log('激励视频 广告显示失败');
              that.setData({
                videolook: true
              })
            })
        })


    },


  }
})