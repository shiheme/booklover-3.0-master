const API = require('/utils/base')

App({

  onLaunch: function () {
    API.login();
    this.getSkin();
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.windowHeight = e.windowHeight;
        this.globalData.windowWidth = e.windowWidth;
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
        this.globalData.TitleBar = e.platform == 'android' ? 50 : 45;
      }
    })
  },

  onShow: function () {
    this.globalData.user = API.getUser();
  },

  //皮肤
  getSkin: function () {
    var that = this
    try {
      if (wx.getStorageSync('pageStyle')) {
        var value = wx.getStorageSync('pageStyle')
      } else {
        var value = that.globalData.pageStyle
      }
      if (value) {
        // Do something with return value
        that.globalData.pageStyle = value
        if (that.globalData.pageStyle == 'whitebg') {
          //that.globalData.skinSwitch = false
          that.globalData.pageBackground = 'rgba(255,255,255,1)'
          that.setSkinNormalTitle()
          that.setNormalTabBar();
        } else {
          //that.globalData.skinSwitch = true
          that.globalData.pageBackground = 'rgba(20,20,20,1)'
          that.setSkinBlackTitle()
          that.setBlackTabBar()
        }
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  //设置tabBar -- 默认模式
  setNormalTabBar() {
    // wx.setTabBarItem({
    //   index: 0,
    //   iconPath: "images/whitebg/btmnav-01.png",
    //   selectedIconPath: "images/whitebg/btmnav-01-on.png",
    // })
    // wx.setTabBarItem({
    //   index: 1,
    //   iconPath: "images/whitebg/btmnav-02.png",
    //   selectedIconPath: "images/whitebg/btmnav-02-on.png",
    // })
    // wx.setTabBarItem({
    //   index: 2,
    //   iconPath: "images/whitebg/btmnav-03.png",
    //   selectedIconPath: "images/whitebg/btmnav-03-on.png",
    // })
    // wx.setTabBarStyle({
    //   color: '#333333',
    //   selectedColor: '#000000',
    //   backgroundColor: '#ffffff',
    //   borderStyle: 'white'
    // })
  },
  //设置tabBar -- 黑色模式
  setBlackTabBar() {
    // wx.setTabBarItem({
    //   index: 0,
    //   iconPath: "images/blackbg/btmnav-01.png",
    //   selectedIconPath: "images/blackbg/btmnav-01-on.png",
    // })
    // wx.setTabBarItem({
    //   index: 1,
    //   iconPath: "images/blackbg/btmnav-02.png",
    //   selectedIconPath: "images/blackbg/btmnav-02-on.png",
    // })
    // wx.setTabBarItem({
    //   index: 2,
    //   iconPath: "images/blackbg/btmnav-03.png",
    //   selectedIconPath: "images/blackbg/btmnav-03-on.png",
    // })

    // wx.setTabBarStyle({
    //   color: '#f5f5f5',
    //   selectedColor: '#ffffff',
    //   backgroundColor: '#141414',
    //   borderStyle: 'black'
    // })
  },
  //导航栏标题背景
  setNavBarBg: function () {
    var self = this
    if (self.globalData.pageStyle == "whitebg") {
      self.globalData.pageBackground = '#ffffff'
      self.setSkinNormalTitle()
    } else {
      self.globalData.pageBackground = '#141414'
      self.setSkinBlackTitle()
    }
  },
  setSkinBlackTitle: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#141414',
    })
    wx.setBackgroundTextStyle({
      textStyle: 'light'
    })
    wx.setBackgroundColor({
      backgroundColor: '#141414',
      backgroundColorTop: '#141414',
      backgroundColorBottom: '#141414',
    })
  },
  setSkinNormalTitle: function () {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    wx.setBackgroundTextStyle({
      textStyle: 'dark'
    })
    wx.setBackgroundColor({
      backgroundColor: '#ffffff',
      backgroundColorTop: '#ffffff',
      backgroundColorBottom: '#ffffff',
    })
  },
  globalData: {
    user: '',
    windowHeight: '',
    windowWidth: '',
    StatusBar: '',
    CustomBar: '',
    TitleBar: '',
    pageBackground: '',
    fresherbackground: '#fff',
    fresherstyle: 'black',
    pageStyle: 'whitebg', //默认主题风格，whitebg白色风格，blackbg深灰色风格
    //skinSwitch: true,
  }

})