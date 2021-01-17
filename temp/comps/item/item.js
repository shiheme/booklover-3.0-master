// index/component/item.js

const PCB = require('../../../utils/common');
const API = require('../../../utils/api')

Component({
  /**
   * 组件的属性列表
   */
  behaviors: [PCB],
  properties: {
    posttype: {
      type: String
    },
    index: {
      type: Number,
      value: true
    },
    gridtype: {
      type: String
    },
    ani:{
      type: Boolean
    },
    item: {
      type: Array,
      value: ''
    },
    isadmin:{
      type:Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    setTime: '',
    num: 0,
    showpic: null,
    hidepic: null,
  },
  ready() {
    var that = this;
    var num = that.data.num;
    var animation = wx.createAnimation({}) //创建一个动画实例
    that.setData({ //创建一个计时器
      setTime: setInterval(function () {
        that.setData({
          num: num++
        })
        if (num > 5) {
          num = 0;
        } //淡入
        animation.opacity(1).step({
          duration: 1500
        }) //描述动画
        that.setData({
          showpic: animation.export()
        }) //输出动画
        //淡出
        animation.opacity(0).step({
          duration: 1500
        })
        that.setData({
          hidepic: animation.export()
        })
      }, 4000)
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})