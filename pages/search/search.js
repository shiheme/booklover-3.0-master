const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  data: {
    placeHolder: '输入你要查找的内容',
    searchLogs: [],
    inputEnable: true,
    autoFocus: false,
    keydown_number: 0,
    posttype: "posts",

    showScan: false,
    //navBarHeight: wx.getSystemInfoSync().statusBarHeight,
    isActive: true, //定义头部导航是否显示背景
    isTomine: true,
    isSkin: true, 
    pageStyle: app.globalData.pageStyle,
  },
  attached: function (options) {
    var self = this;
    self.setData({
      pageBackground: app.globalData.pageBackground,
      pageStyle: app.globalData.pageStyle,
    })
    var searchlogs = wx.getStorageSync('searchlogs') || [];
    this.setData({
      searchLogs: searchlogs
    })
  },
  pageLifetimes: {
    show: function () {
      var self = this;
      app.setNavBarBg(); //设置标题栏背景色
      self.setData({
        pageBackground: app.globalData.pageBackground,
        pageStyle: app.globalData.pageStyle,
      })

      var searchlogs = wx.getStorageSync('searchlogs') || [];
      self.setData({
        searchLogs: searchlogs
      })
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  methods: {
    onLoad: function () {
      let that = this;
 
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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

    onInput: function (e) {
      this.setData({
        searchKey: e.detail.value,
      })
      if (e.detail.cursor != 0) {
        this.setData({
          keydown_number: 1
        })
      } else {
        this.setData({
          keydown_number: 0
        })
      }
    },
    radioChange: function (e) {
      this.setData({
        posttype: e.detail.value,
      })
      if (e.detail.value == 'appver') {
        this.setData({
          showScan: true,
        })
      } else {
        this.setData({
          showScan: false,
        })
      }
    },
    formSubmit: function (e) {
      if (this.data.keydown_number == 1) {
        var url = '/pages/list/list'
        var key = this.data.searchKey;
        var posttype = this.data.posttype;

        var cnt_tp = "";


        url = url + '?s=' + key + '&posttype=' + posttype;
        
        let arr = this.data.searchLogs;
        // 判断数组中是否已存在
        if (arr.length >= 1) {
          arr = arr.filter(function (log) {
            return log[0] !== key;
          });
        }
        if (arr.length > 10) {
          arr.pop(); //去除最后一个
        }
        arr.unshift([key, url, cnt_tp]);
        wx.setStorageSync('searchlogs', arr);
        //存储搜索记录

        
        url = url + '?s=' + key + '&posttype=' + posttype;
          wx.navigateTo({
            url: url
          })
        
      } else {
        wx.showModal({
          title: '提示',
          content: '请输入内容',
          showCancel: false,
        });
      }
    },
    //点击历史也记录到缓存顺序中
    historyValue: function (e) {
      let url = e.currentTarget.dataset.url;
      let key = e.currentTarget.dataset.key;
      let cnt_tp = e.currentTarget.dataset.cnt_tp;

      let arr = this.data.searchLogs;
      // 判断数组中是否已存在
      if (arr.length >= 1) {
        arr = arr.filter(function (log) {
          return log[0] !== key;
        });
      }
      if (arr.length > 10) {
        arr.pop(); //去除最后一个
      }
      arr.unshift([key, url, cnt_tp]);
      wx.setStorageSync('searchlogs', arr);
      wx.setStorage({
        key: "searchlogs",
        data: arr
      })
      wx.navigateTo({
        url: url
      })
    },
    //清除搜索记录
    deleteHistory: function () {
      //清除当前数据
      this.setData({
        searchLogs: []
      });
      //清除缓存数据
      wx.removeStorageSync('searchlogs')
    },

    onClear: function () {
      this.setData({
        searchKey: '',
      })
    },

  }
})