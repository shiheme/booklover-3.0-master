

Component({
    properties: {
        index: {
            type: Number,
            value: true
        },
        height: {
          type: Number,
          value: true
        },
        margintop: {
          type: Number,
          value: true
        },
        item: {
          type: Array,
          value: ''
        },
        ani: {
          type: Boolean,
          value: false
        }
    },
    data: {
      screenHeight: wx.getSystemInfoSync().windowHeight,
      screenWidth: wx.getSystemInfoSync().windowWidth,
      playstart: false,

    },
    ready: function ready() {
      // console.log(this.properties.index)
      // let that = this
      // setTimeout(function () {
      //   /** 监控视频是否需要播放 */
      //   let screenHeight = that.data.screenHeight //获取屏幕高度
      //   let screenWidth = that.data.screenWidth //获取屏幕宽度 
      //   let topBottomPadding = (screenHeight-20) / 2
      //   // console.log('topBottomPadding', screenHeight, topBottomPadding)
      //   const videoObserve = that.createIntersectionObserver()
      //   videoObserve.relativeToViewport({ bottom: -topBottomPadding, top: -topBottomPadding})
      //     // .observe(`.test}`, (res) => {
      //     .observe(`#vids${that.properties.index}`, (res) => {
      //       let { intersectionRatio } = res
      //       // console.log('intersectionRatio', intersectionRatio)
      //       if (intersectionRatio === 0) {
      //         //离开视界，因为视窗占比为0，停止播放
      //         that.setData({
      //           playstart: false,
      //         })
      //       } else {
      //         //进入视界，开始播放
      //         that.setData({
      //           playstart: true,
      //         })
      //       }
      //       // console.log('picture'+that.data.playstart)

      //     })
      // }, 2000)

    },
    attached() {
    },
    methods: {
      bindDetail: function (e) {
        let id = e.currentTarget.id;
        let posttype = e.currentTarget.dataset.posttype;
        wx.navigateTo({
          url: '/pages/detail/detail?id=' + id + '&posttype=' + posttype,
        })
      },
    }
});