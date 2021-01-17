const BASE = require('/utils/base')
const API = require('/utils/api')

App({

  onLaunch: function (options) {
    // this.globalData.scene = options.scene;
    this.getSiteInfo();
    this.getCnttype();

    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.windowHeight = e.windowHeight;
        this.globalData.windowWidth = e.windowWidth;
        this.globalData.safeinsetbottom = e.safeArea.top > 20 ? 68:0;
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
        this.globalData.TitleBar = e.platform == 'android' ? 50 : 45;
        console.log(e)
      }

    })

  },

  onShow: function () {
    this.globalData.user = BASE.getUser();
    this.getCnttype();
  },
  getCnttype: function (){
    var that = this
    try {
      if (wx.getStorageSync('cnttype')) {
        var value = wx.getStorageSync('cnttype')
      } else {
        var value = that.globalData.cnttype
      }
      if (value) {
        that.globalData.cnttype = value
      }
      // console.log('value1',value)
    } catch (e) {
    }
  },
  getSiteInfo: function () {
    API.getSiteInfo().then(res => {
      this.globalData.siteinfo = res
        if (this.siteinfoCallBack) {
          this.siteinfoCallBack(res)
        }
      })
      .catch(err => {
        console.log(err)
        this.globalData.errtext = true
      })
  },

  globalData: {
    errtext:false,
    user: '',
    windowHeight: '',
    windowWidth: '',
    safeinsetbottom: '',
    StatusBar: '',
    CustomBar: '',
    TitleBar: '',
    siteinfo:'',

    cnttype:'library',
    
    tabbarStyle: 'simple', //底部主导航，normal图标带文字，simple仅图标
    showitemadd: true,//底部主导航是否显示发布按钮，true显示，false隐藏
  }

})