const PCB = require('../../../utils/common');
const API = require('../../../utils/api')

Component({
  behaviors: [PCB],
  properties: {
    siteinfo:{
      type:Array
    }
  },
  data: {
    selected: null,
    color: "color color-base-op40",
    selectedColor: "selectedColor color-base-op80",
    "list": [
      {
        "pagePath": "/pages/index/index",
        "iconPath": "icon-yeah",
        "selectedIconPath": "icon-yeah",
        "text": "发现"
      },
      {
        "pagePath": "/pages/room/room",
        "iconPath": "icon-library",
        "selectedIconPath": "icon-library",
        "text": "清单"
      },
      {
        "pagePath": "",
        "iconPath": "icon-hamburger",
        "selectedIconPath": "icon-hamburger",
      },
      {
        "pagePath": "/pages/like/like",
        "iconPath": "icon-like",
        "selectedIconPath": "icon-like",
        "text": "点赞"
      },
      {
        "pagePath": "/pages/mine/mine",
        "iconPath": "icon-mine",
        "selectedIconPath": "icon-mine",
        "text": "我的"
      }
    ]
  },
  properties: {
    tabbarStyle: {
      type: String,
      value: ''
    },
    selected : {
      type: String,
      value: 0,
    },
    istrue_scroll: {
      type: Boolean,
      value: false //判断页面上拉还是下拉
    },
    showitemadd: {
      type: Boolean,
      value: false //是否显示返回按钮/返回首页按钮
    }
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      var data = e.currentTarget.dataset;
      var index = data.index;
      var selected = data.selected;
      var url = data.path;
      if (selected === index) {
        return false;
      } else {
        wx.switchTab({ url })
      }
    },

  
    bindByurl: function (e) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url
      })
    },
  }
});