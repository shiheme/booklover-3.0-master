Component({
  data: {
    selected: 0,
    color: "color",
    selectedColor: "selectedColor",
    "list": [
      {
        "pagePath": "/pages/index/index",
        "iconPath": "/btmnav-01.png",
        "selectedIconPath": "/btmnav-01-on.png",
        "text": "创意"
      },
      {
        "pagePath": "/pages/source/source",
        "iconPath": "/btmnav-02.png",
        "selectedIconPath": "/btmnav-02-on.png",
        "text": "作品"
      },
      {
        "pagePath": "/pages/search/search",
        "iconPath": "/btmnav-03.png",
        "selectedIconPath": "/btmnav-03-on.png",
        "text": "搜索"
      }
    ]
  },
  properties: {
    pageStyle: {
      type: String,
      value: ''
    },
    selected : {
      type: String,
      value: 0,
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
    }
  }
});