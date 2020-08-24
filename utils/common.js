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
    opennavbarscroll: false, //是否让底部导航开启滑动隐藏
    istrue_scroll: false, //控制底部导航显示隐藏

    geziads: false, //小格子原生广告

    isshowLoad: true,
    isshowError: false,
    isshowCnt: false,
    isActive: true, //定义头部导航是否显示背景
    isGoback: false, //定义头部导航是否存在返回上一页/返回首页
    isSearch: false, //定义头部导航是否显示搜索
    isTolist: false, //定义头部导航是否显示内容列表

    showLoad: false,
    opentabwrapper: false,
    scene: app.globalData.scene,
    showitemadd: app.globalData.showitemadd,
    tabbarStyle:app.globalData.tabbarStyle,
 
    wrapperhide: app.globalData.wrapperhide,
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    navBarHeight: app.globalData.StatusBar,
    customBarHeight: app.globalData.CustomBar,
    titleBarHeight: app.globalData.TitleBar
  },
  attached: function () {
    // 页面创建时执行
    var that = this;

    if (that.data.isshare == 1) {
      //console.log('是分享进入');
      that.setData({
        'isshare': this.data.isshare
      })
    }

  },
  methods: {
    //判断加载广告
    adLoadgeziads() {
      let that = this;
      that.setData({
        geziads: true
      })
    },
    adErrorgeziads(err) {
      let that = this;
      that.setData({
        geziads: false
      })
    },
    
    //显示/隐藏pop
    bindShowpop: function (e) {
      let that = this;
      that.setData({
        showpop: true
      })
    },
    bindHidepop: function (e) {
      let that = this;
      that.setData({
        showpop: false
      })
    },
    opentabwrapper: function (e) {
      // console.log(e)
      let that = this;
      that.setData({
        opentabwrapper: true
      })
    },

    closetabwrapper: function (e) {
      let that = this;
      that.setData({
        opentabwrapper: false
      })
    },

    // 公共事件
    popSingleimg: function (e) {
      var src = e.currentTarget.dataset.src;
      wx.previewImage({
        urls: [src],
      });
    },
    toMini: function (e) {
      var appId = e.currentTarget.dataset.appid,
        path = e.currentTarget.dataset.path;
      wx.navigateToMiniProgram({
        appId: appId,
        path: path,
        extraData: {},
        success(res) {
          // 打开成功
        }
      })
    },

    //给a标签添加跳转和复制链接事件
    wxParseTagATap: function (e) {
      let that = this;
      var href = e.currentTarget.dataset.src;
      var domain = API.getHost();
      // console.log(href)
      // console.log(domain)
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
      } else {

        var slug = API.getUrlFileName(href, domain);

        var posttype = API.getUrlPosttypeName(href, domain);
        // console.log(posttype)
        if (slug == 'index') {
          // console.log(slug)
          // wx.switchTab({
          //   url: '../index/index'
          // })
        } else {
          // console.log(slug)
          API.getPostBySlug(posttype, slug).then(res => {
            // console.log(res)
            var postID = res[0].id;
            // console.log(postID)
            var openLinkCount = wx.getStorageSync('openLinkCount') || 0;
            if (openLinkCount > 4) {
              wx.navigateTo({
                url: '../detail/detail?id=' + postID + '&posttype=' + posttype
              })
            } else {
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

    bindDetail: function (e) {
      let id = e.currentTarget.id,
      posttype = e.currentTarget.dataset.posttype;
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + id + '&posttype=' + posttype,
      })
    },


  }

})