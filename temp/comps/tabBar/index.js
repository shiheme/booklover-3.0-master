Component({
  data: {
    selected: 0,
    color: "color color-base-op40",
    selectedColor: "selectedColor color-base-op80",
    "list": [
      {
        "pagePath": "/pages/index/index",
        "iconPath": "icon-btmnav-01",
        "selectedIconPath": "icon-btmnav-01",
        "text": "发现"
      },
      {
        "pagePath": "/pages/library/library",
        "iconPath": "icon-btmnav-02",
        "selectedIconPath": "icon-btmnav-02",
        "text": "书架"
      },
      {
        "pagePath": "",
        "iconPath": "icon-btmnav-add",
        "selectedIconPath": "icon-btmnav-add",
        "text": ""
      },
      {
        "pagePath": "/pages/like/like",
        "iconPath": "icon-btmnav-03",
        "selectedIconPath": "icon-btmnav-03",
        "text": "喜欢"
      },
      {
        "pagePath": "/pages/mine/mine",
        "iconPath": "icon-btmnav-04",
        "selectedIconPath": "icon-btmnav-04",
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
    //显示/隐藏pop
    bindShowpop: function (e) {
      let that = this;
      that.setData({
        showpop: true
      })
    },
    bindHidepop: function (e) {
      let that = this;
      that.setData({
        showpop: false
      })
    },
    bindByurl: function (e) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url
      })
    },
  }
});