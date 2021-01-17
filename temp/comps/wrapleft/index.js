const PCB = require('../../../utils/common');
const API = require('../../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  data: {
    // navBarHeight: app.globalData.StatusBar,
    // customBarHeight: app.globalData.CustomBar,
    // titleBarHeight: app.globalData.TitleBar,
    // loading: 1,

    placeHolder: '',
    searchLogs: [],
    inputEnable: true,
    autoFocus: false,
    keydown_number: 0,
  },
  properties: {
    //属性值可以在组件使用时指定
    // isShowabout: {
    //   type: Boolean,
    //   value: false //是否显示个人中心
    // },

    // skinSwitch: {
    //   type: Boolean,
    //   value: true
    // },
    siteinfo:{
      type:Array
    },
    isadmin:{
      type:Boolean
    }
  },
  attached() {
    // let that = this ;
    // that.setData({
    //   navBarHeight: app.globalData.StatusBar,
    //   customBarHeight: app.globalData.CustomBar,
    //   titleBarHeight: app.globalData.TitleBar,
    // })

    this.setData({
      placeHolder:'输入你要查找的'+this.data.cnttypetitle+'名'
    })

  },
  pageLifetimes: {
    show: function () {
      var self = this;

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
  ready() {
    this.refresh();
  },
  methods: {
    refresh: function () {
      this.setData({
        posts: []
      });
      // this.getSiteInfo();
      // app.loaclCallBack = res => {
      //   this.setData({
      //     siteinfo: app.globalData.siteinfo
      //   })
      //   console.log(this.data.siteinfo)
      // }
      this.getComments({
        post_type: this.data.cnttype,
        page: 1
      });
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
    formSubmit: function (e) {
      if (this.data.keydown_number == 1) {
        var url = '/pages/list/list'
        var key = this.data.searchKey;
        var posttype = this.data.cnttype;

        var cnt_tp = this.data.cnttypetitle;


        url = url + '?s=' + key + '&posttype=' + posttype + '&cnt_tp='+cnt_tp;

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
        url = url + '?s=' + key + '&posttype=' + posttype + '&cnt_tp' +cnt_tp;
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

    getComments: function (args) {
      API.getComments(args).then(res => {
        let args = {}
        args.posts = [].concat(this.data.posts, res)
        this.setData(args)
        console.log('args', res)
      })
    },


    // 跳转至个人中心
    redictMine: function (e) {
      var url = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: url
      })
    },

  }
})