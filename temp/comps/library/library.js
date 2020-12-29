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
    siteinfo: {
      type: Array,
      value: []
    }
  },
  data: {
    videolook: false,
    borrowtime:['1个月','2个月'],
    borrowtimeindex:0
  },
  ready(options) {
    this.showVideoAd();
    this.setData({
      renttime: this.data.borrowtime[this.data.borrowtimeindex]
    })
    if(this.data.user[0].role=='contributor') {
      this.setData({
        rentprice:Number(0).toFixed(2),
        leveltxt:'*享有免费免押借阅特权'
      })
    } else {
      this.setData({
        rentprice: (Number(this.data.detail[0].book_rent[0])).toFixed(2),
        leveltxt:''
      })
    }
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
    bindborrowtime: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        borrowtimeindex: e.detail.value,
        renttime: this.data.borrowtime[e.detail.value]
        })
      if(this.data.user[0].role=='contributor') {
        this.setData({
          rentprice:Number(0).toFixed(2)
        })
      } else {
        this.setData({
          rentprice:((Number(e.detail.value)+1) * Number(this.data.detail[0].book_rent[0])).toFixed(2)
        })
      }
    },
    copytxt_borrow: function() {
      var booktit = this.data.detail[0].title.rendered;
      var bookisbn = this.data.detail[0].book_isbn;
      var auth = this.data.user[0].nickName;
      var level = this.data.user[0].role;
      var leveltxt = this.data.leveltxt;
      var openid = this.data.user[0].openId;
      var bookcost = this.data.rentprice;
      var booktime = this.data.renttime;

      wx.setClipboardData({
        data: '预借信息\n-----------\n\r书名：《' + booktit + '》\nISBN：' + bookisbn + '\n\r借书人：' + auth + '\n用户等级：' + level + leveltxt + '\n借书ID：' + openid + '\n\r借阅费：' + bookcost + '\n借阅时间：'+ booktime,
        success: function(res) {
          wx.getClipboardData({
            success: function(res) {
              wx.showToast({
                title: '内容已复制',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },

  }
});