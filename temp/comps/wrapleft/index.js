const PCB = require('../../../utils/common');
const API = require('../../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  data: {
    navBarHeight: app.globalData.StatusBar,
    customBarHeight: app.globalData.CustomBar,
    titleBarHeight: app.globalData.TitleBar,
    loading: 1
  },
  properties: {
    //属性值可以在组件使用时指定
    isShowabout: {
      type: Boolean,
      value: false //是否显示个人中心
    },
    
    // skinSwitch: {
    //   type: Boolean,
    //   value: true
    // },
  },
  attached() {
    let that = this ;
    that.setData({
      navBarHeight: app.globalData.StatusBar,
      customBarHeight: app.globalData.CustomBar,
      titleBarHeight: app.globalData.TitleBar,
    })
    this.getSiteInfo();
    
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
    getSiteInfo: function () {
      API.getSiteInfo().then(res => {
          this.setData({
            siteInfo: res
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 跳转至个人中心
    redictMine: function(e) {
      var url = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: url
      })
    },
    
    getSiteInfo: function () {
      API.getSiteInfo().then(res => {
          this.setData({
            siteInfo: res
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
  }
})