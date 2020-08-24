const API = require('/utils/base')

App({

  onLaunch: function (options) {
    // API.login();
    // console.log(options)
    this.globalData.scene = options.scene;

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
    this.globalData.user = API.getUser();
  },

  globalData: {
    user: '',
    scene: '',
    windowHeight: '',
    windowWidth: '',
    StatusBar: '',
    CustomBar: '',
    TitleBar: '',
    pageBackground: '',
    fresherbackground: '#fff',
    fresherstyle: 'black',
    tabbarStyle: 'simple', //底部主导航，normal图标带文字，simple仅图标
    showitemadd: false,//底部主导航是否显示发布按钮，true显示，false隐藏
  }

})