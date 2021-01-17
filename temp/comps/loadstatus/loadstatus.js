// component/loadstatus/loadstatus.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    length:{
      type: Number
    },
    errtext:{
      type: Boolean,
      value: false
    },
    hasnextpage:{
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    reLaunchpage: function (e) {
    wx.reLaunch({
      url: '/pages/index/index',
      // success: function (res) {
      //     app.onLaunch();
        
      // }
    })
  }
  }
})
