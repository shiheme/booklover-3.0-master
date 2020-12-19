const PCB = require('../../../utils/common');

let rewardedVideoAd = null

Component({
  behaviors: [PCB],
  properties: {
    libtype: {
      type: String,
      value: ''
    },
    detail: {
      type: Array,
      value: []
    },
    user: {
      type: Array,
      value: []
    },
  },
  data: {
    videolook: false
  },
  ready(options) {
    this.showVideoAd();
  },

  attached() {},
  methods: {
    onShow: function () {

    },
    showVideoAd: function () {
      let that = this
      var openAdLogs = wx.getStorageSync('openAdLogs') || [];
      if (openAdLogs.length > 19) {
        that.setData({
          videolook: true
        })
      } else if (openAdLogs.length > 0) {
        for (var i = 0; i < openAdLogs.length; i++) {
          if (openAdLogs[i].id == that.data.detail[0].id) {
            that.setData({
              videolook: true
            })
            break;
          }
        }
      }
      if (wx.createRewardedVideoAd) {
        rewardedVideoAd = wx.createRewardedVideoAd({
          adUnitId: 'adunit-3e6043b4117685cd'
        })
        rewardedVideoAd.onLoad(() => {
          // console.log('onLoad event emit')
        })
        rewardedVideoAd.onError((err) => {
          console.log(err);
          that.setData({
            videolook: true
          })
        })
        rewardedVideoAd.onClose((res) => {
          var id = that.data.detail[0].id;
          if (res && res.isEnded) {
            var nowDate = new Date();
            nowDate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
            var openAdLogs = wx.getStorageSync('openAdLogs') || [];
            // 过滤重复值
            if (openAdLogs.length > 0) {
              openAdLogs = openAdLogs.filter(function (log) {
                return log["id"] !== id;
              });
            }
            // 如果超过指定数量不再记录
            if (openAdLogs.length < 21) {
              var log = {
                "id": id,
                "date": nowDate
              }
              openAdLogs.unshift(log);
              wx.setStorageSync('openAdLogs', openAdLogs);
              // console.log(openAdLogs);
            }
            that.setData({
              videolook: true
            })
          } else {
            wx.showToast({
              title: "你中途关闭了视频",
              icon: "none",
              duration: 3000
            });
          }
        })
      }
    },

    //阅读更多
    readMore: function () {
      var that = this;


      rewardedVideoAd.show()
        .catch(() => {
          rewardedVideoAd.load()
            .then(() => rewardedVideoAd.show())
            .catch(err => {
              console.log('激励视频 广告显示失败');
              that.setData({
                videolook: true
              })
            })
        })


    },

  }
});