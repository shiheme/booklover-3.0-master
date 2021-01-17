// pages/mine/mine.js
const PCB = require('../../utils/common');
const API = require('../../utils/api');
const amap = require('../../utils/amap-wx.js'); //引入高德地图
const app = getApp()

Component({
  behaviors: [PCB],
  properties: {
    // 接受页面参数
    websrc: String,
  },
  /**
   * 页面的初始数据
   */
  data: {

    isActive: false, 
    isGoback: true,

    opennavbarscroll: true,
    istrue_scroll:false,
    loading: false,

  },
  attached: function (options) {
   
  },
  pageLifetimes: {
    show: function () {
      
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
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
      this.setData({
        siteinfo: app.globalData.siteinfo,
        title:'个人中心'
      })
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
      let user = app.globalData.user
      if (!user) {
        user = '';
      }
      this.setData({
        user: user,
      })
      if (user.role == 'administrator') {
        this.setData({
          isadmin: true
        })
      }
      console.log('user', this.data.user)

      if (user) {
        this.refreshmsg();
      }

      
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
    refreshmsg: function () {
      API.getProfile().then(res => {
          // console.log(res)
          this.setData({
            user_likes: res.user_likes,
            user_fav: res.user_fav,
            user_comment: res.user_comment,
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    
    
    scroll: function (e) {
      var that = this,
        scrollfx = e.detail.deltaY,
        scrolltop = e.detail.scrollTop,
        windowHeight = that.data.windowHeight,
        scrollheight = e.detail.scrollHeight - 50;

      if (that.data.opennavbarscroll) {
        if (scrolltop <= 0) {
          scrollfx = 1;
        } else if ((scrolltop + windowHeight) > scrollheight) {
          scrollfx = 1;
        }

        if(scrolltop > 88){
          this.setData({
            isActive: true
          })
          
        } else {
          this.setData({
            imagescale: scrolltop,
            isActive: false
          })
          
        }

      
      }
    },
    loginOut: function () {
      API.Loginout();
    },

    subscribeMessage: function (template, status) {
      let args = {}
      args.openid = this.data.user.openId
      args.template = template
      args.status = status
      args.pages = getCurrentPages()[0].route
      args.platform = wx.getSystemInfoSync().platform
      args.program = 'WeChat'
      API.subscribeMessage(args).then(res => {
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    bindSubscribe: function () {
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
            wx.showToast({
              title: "订阅完成",
              icon: 'success',
              duration: 1000
            })
          }
        },
        fail: function (res) {
          // console.log(res)
        }
      })
    },

    
  }
})
