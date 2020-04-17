const API = require('../utils/api')
var app = getApp();

module.exports = Behavior({
  behaviors: [
    //引入其它的 behavior
  ],
  properties: {
    isshare: Number,
  },
  data: {
    // 公共数据定义
    showerror: "none",
    shownodata: false,
    floatDisplay: "none",
    isshare: "0",

    showpop: false,

    cnt_tp: '', //定义文章类型
    isshowLoad: true,
    isshowError: false,
    isshowCnt: false,
    isActive: true, //定义头部导航是否显示背景
    isGoback: false, //定义头部导航是否存在返回上一页/返回首页
    isTomine: false, //定义头部导航是否显示个人中心
    isSkin: false, //定义头部导航是否显示切换风格
    showLoad: false,
    //navBarHeight: wx.getSystemInfoSync().statusBarHeight,
    pageBackground: app.globalData.pageBackground,
    pageStyle: app.globalData.pageStyle,
    //skinSwitch: app.globalData.skinSwitch,
    wrapperhide: app.globalData.wrapperhide,
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    navBarHeight: app.globalData.StatusBar,
    customBarHeight: app.globalData.CustomBar,
    titleBarHeight: app.globalData.TitleBar
  },
  attached: function() {
    // 页面创建时执行
    var self = this;
    
    app.setNavBarBg(); //设置标题栏背景色
    self.setData({
      pageBackground: app.globalData.pageBackground,
      pageStyle: app.globalData.pageStyle,
    })
    if (this.data.isshare == 1) {
      //console.log('是分享进入');
      self.setData({
        'isshare': this.data.isshare
      })
    }
  },
  methods: {
    //显示/隐藏pop
    bindShowpop: function (e) {
      var self = this;
      self.setData({
        showpop: true
      })
    },
    bindHidepop: function (e) {
      var self = this;
      self.setData({
        showpop: false
      })
    },

    //传递切换黑白风格
    toggleToast(e) {
      var self = this;
      //开启
      if (e.detail.value == true) {
        app.globalData.pageStyle = "blackbg";
        // app.globalData.fresherbackground = "#000";
        // app.globalData.fresherstyle = "white";
        app.setSkinBlackTitle(); //设置标题栏
        //app.globalData.skinSwitch = true
        app.setBlackTabBar(); //设置tabBar
      } else {
        app.globalData.pageStyle = 'whitebg';
        // app.globalData.fresherbackground = "#fff";
        // app.globalData.fresherstyle = "black";
        app.setSkinNormalTitle()
        //app.globalData.skinSwitch = false
        app.setNormalTabBar();
      }
      self.setData({
        pageStyle: app.globalData.pageStyle
      })
      //保存到本地
      wx.setStorage({
        key: "pageStyle",
        data: app.globalData.pageStyle
      })
      // wx.setStorage({
      //   key: "skinSwitch",
      //   data: app.globalData.skinSwitch
      // })
    },

    
    // 公共事件
    //给a标签添加跳转和复制链接事件
    wxParseTagATap: function(e) {
      var self = this;
      var href = e.currentTarget.dataset.src;
      var domain = API.getHost();
      console.log(href)
      console.log(domain)
      //可以在这里进行一些路由处理
      if (href.indexOf(domain) == -1) {
        wx.setClipboardData({
          data: href,
          success: function (res) {
            wx.getClipboardData({
              success: function (res) {
                wx.showToast({
                  title: '文本已复制',
                  //icon: 'success',
                  duration: 2000
                })
              }
            })
          }
        })
      }
      else {

        var slug = API.getUrlFileName(href, domain);

        var posttype = API.getUrlPosttypeName(href, domain);
        console.log(posttype)
        if (slug == 'index') {
          console.log(slug)
          // wx.switchTab({
          //   url: '../index/index'
          // })
        }
        else {
          console.log(slug)
          API.getPostBySlug(posttype,slug).then(res => {
            console.log(res)
            var postID = res[0].id;
            console.log(postID)
            var openLinkCount = wx.getStorageSync('openLinkCount') || 0;
            if (openLinkCount > 4) {
              wx.navigateTo({
                url: '../detail/detail?id=' + postID + '&posttype=' + posttype
              })
            }
            else {
              wx.navigateTo({
                url: '../detail/detail?id=' + postID + '&posttype=' + posttype
              })
              openLinkCount++;
              wx.setStorageSync('openLinkCount', openLinkCount);
            }
          })
        }

      }
    },
    
  }

})