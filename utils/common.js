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

    isadmin: false,

    showpop: false,
    anicolltip: false,
    // safemodeok:'1',

    siteinfo:{safemode:1},

    
    isshowLoad: true,
    isshowError: false,
    isshowCnt: false,
    isActive: true, //定义头部导航是否显示背景
    isGoback: false, //定义头部导航是否存在返回上一页/返回首页
    isSearch: false, //定义头部导航是否显示搜索
    isScancode: false, //定义头部导航是否显示扫码

    showLoad: false,
    waiting: true,
    opentabwrapper: false,
    errtext:app.globalData.errtext,
    // siteinfo: app.globalData.siteinfo,
    tabbarStyle:app.globalData.tabbarStyle,
    showitemadd:app.globalData.showitemadd,
    safeinsetbottom:app.globalData.safeinsetbottom,
    cnttype: app.globalData.cnttype, //

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

    that.setData({
      cnttype:app.globalData.cnttype,
      errtext:app.globalData.errtext
    })

    // console.log('cnttyoe',app.globalData.cnttype)
    if(this.data.cnttype=='library'){
      this.setData({
        topic_cats: API.custompostcats().library_topic_cats,
        quot_cats: API.custompostcats().library_quot_cats,
        act_cats: API.custompostcats().library_act_cats,
        faq_cats: API.custompostcats().library_faq_cats,
        cnttypetitle:'书籍',
      })
    } else if(this.data.cnttype=='films') {
      this.setData({
      topic_cats: API.custompostcats().films_topic_cats,
      quot_cats: API.custompostcats().films_quot_cats,
      act_cats: API.custompostcats().films_act_cats,
      faq_cats: API.custompostcats().films_faq_cats,
      cnttypetitle:'影视'
    })
    }else if(this.data.cnttype=='app') {
      this.setData({
      topic_cats: API.custompostcats().app_topic_cats,
      quot_cats: API.custompostcats().app_quot_cats,
      act_cats: API.custompostcats().app_act_cats,
      faq_cats: API.custompostcats().app_faq_cats,
      cnttypetitle:'APP'
    })
    }else if(this.data.cnttype=='pro') {
      this.setData({
      topic_cats: API.custompostcats().pro_topic_cats,
      quot_cats: API.custompostcats().pro_quot_cats,
      act_cats: API.custompostcats().pro_act_cats,
      faq_cats: API.custompostcats().pro_faq_cats,
      cnttypetitle:'商品'
    })
    }

  },
  methods: {
    onShow: function () {
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
      

    },

    getAdvert: function () {
      API.indexAdsense().then(res => {
          // console.log(res)
          if (res.status === 200) {
            this.setData({
              advert: res.data
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    getSiteInfo: function () {
      API.getSiteInfo().then(res => {
          this.setData({
            siteinfo: res,
            safemodeok: res.safemode
          })
          console.log(this.data.siteinfo)
        })
        .catch(err => {
          console.log(err)
        })
    },

    getProfile: function (e) {
      if (app.globalData.user) {
        this.setData({
          user: app.globalData.user
        })
      } else {
        wx.showLoading({
          title: '正在登录!',
          mask: true
        })
        API.getProfile().then(res => {
            // console.log(res)
            this.setData({
              user: res,
              user_likes: res.user_likes,
            user_fav: res.user_fav,
            user_comment: res.user_comment,
            })
            wx.hideLoading()
          })
          .catch(err => {
            console.log(err)
            wx.hideLoading()
          })
      }
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


    //显示/隐藏pop
    bindShowpop: function (e) {
      let that = this,
        popheight = e.currentTarget.dataset.popheight,
        poptype = e.currentTarget.dataset.poptype;
      that.setData({
        popheight: popheight,
        poptype: poptype
      })
      // console.log(popitem)
      setTimeout(function () {
        that.setData({
          showpop: true,
          showcolltip: true,
        });
      }, 100);
      setTimeout(function () {
        that.setData({
          anicolltip: true,
        });
      }, 1000);

    },
    bindHidepop: function (e) {
      let that = this;
      that.setData({
        showpop: false,
        pengyouquantip: false,
        showcolltip: false,
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
      if (href.indexOf(domain) == -1 && href.indexOf("linktype=1") == -1) {
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
      } else if (href.indexOf(domain) == -1 && href.indexOf("linktype=1") != -1) {
        wx.navigateTo({
          url: href
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

    bindHandler: function (e) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url,
      })
    },

    showcolltip: function () {
      this.setData({
        showcolltip: true,
      })
    },
    onCanceltip: function () {
      this.setData({
        showcolltip: false,
      })
    },
    changeCnttype: function (e) {
      let cnttype = e.currentTarget.dataset.cnttype;
      app.globalData.cnttype = cnttype
      this.setData({
        cnttype:app.globalData.cnttype
      })
      //保存到本地
      wx.setStorage({
        key: "cnttype",
        data: app.globalData.cnttype
      })
      console.log(app.globalData.cnttype)
      
      wx.reLaunch({
        url: '/pages/index/index',
        // success: function (res) {
        //     app.onLaunch();
          
        // }
      })
    },
  },

})