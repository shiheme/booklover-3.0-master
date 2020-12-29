const BASE = require('/utils/base')
const API = require('/utils/api')

App({

  onLaunch: function (options) {
    this.globalData.scene = options.scene;
    this.getSiteInfo();

    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.windowHeight = e.windowHeight;
        this.globalData.windowWidth = e.windowWidth;
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
        this.globalData.TitleBar = e.platform == 'android' ? 50 : 45;
        // console.log(e)
      }

    })

  },

  onShow: function () {
    this.globalData.user = BASE.getUser();
    
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
      })
  },

  globalData: {
    user: '',
    scene: '',
    windowHeight: '',
    windowWidth: '',
    StatusBar: '',
    CustomBar: '',
    TitleBar: '',
    siteinfo:''
  }

})