//var myBehavior = require('../../../pages/index/index')
var app = getApp()
Component({
  //behaviors: [myBehavior],
  data: {
    navBarHeight: app.globalData.StatusBar,
    customBarHeight: app.globalData.CustomBar,
    titleBarHeight: app.globalData.TitleBar,
    loading: false
  },
  properties: {
    //属性值可以在组件使用时指定
    title: {
      type: String,
      value: ''
    },
    mineurl: {
      type: String,
      value: '' //帮助文档的路径
    },
    isshare: {
      type: String,
      value: '0' //如果为1则表示页面为分享来的页面
    },
    bgcolor: {
      type: String,
      value: '' //用于详情页的特别颜色
    },
    pageStyle: {
      type: String,
      value: 'light' //用于显示头部文字及图标颜色
    },
    isGoback: {
      type: Boolean,
      value: false //是否显示返回按钮/返回首页按钮
    },
    isSearch: {
      type: Boolean,
      value: false //是否显示搜索按钮
    },
    isScancode: {
      type: Boolean,
      value: false //是否显示扫码按钮
    },
    isTolist: {
      type: Boolean,
      value: false //是否显示个人中心
    },
    isSkin: {
      type: Boolean,
      value: false //是否显示切换风格
    },
    isTomine: {
      type: Boolean,
      value: false //是否显示个人中心
    },
    isActive: {
      type: Boolean,
      value: true
    },
    showLoad: {
      type: Boolean,
      value: false
    },
  },
  attached() {
    let that = this;
    that.setData({
      navBarHeight: app.globalData.StatusBar,
      customBarHeight: app.globalData.CustomBar,
      titleBarHeight: app.globalData.TitleBar,
    })


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

    // 跳转至个人中心
    redictMine: function (e) {
      var url = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: url
      })
    },
    taplistarea: function (e) {
      var myEventDetail = {
        opentabwrapper: true,
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('taplist', myEventDetail, myEventOption)
    },
    scanCode: function(event) {
      // 允许从相机和相册扫码
      wx.scanCode({
        //onlyFromCamera: true,
        //scanType: ['barCode'],
        success: res => {
          var url = '../list/list'
          var key = res.result;
          if (key != '') {
            url = url + '?posttype=library&s=' + key;
            wx.navigateTo({
              url: url
            })
          }
        },
        fail: err => {
          console.log(err);
        }
      })
    },
    bindByurl: function (e) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url
      })
    },
  }
})