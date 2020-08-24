Component({
  properties: {
    margintop: {
      type: Number,
      value: 0
    },
    isshowCnt: {
      type: Boolean,
      value: false
    },
  },
  data: {

  },
  ready: function ready() {},
  attached() {},
  methods: {
    closewel: function (e) {

        var myEventDetail = {
          isFirst: false,
        } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('myevent', myEventDetail, myEventOption)
      
    },
  }
});