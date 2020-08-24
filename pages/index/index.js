const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

/* ------------------------- */
var canUseReachBottom = true; //触底函数控制变量
/* ------------------------- */


Component({
  behaviors: [PCB],
  data: {
    posts: [],
    page: 1,
    posttype: 'topic',

    isActive: true,
    isSearch: true,
    isTolist: true,
    opennavbarscroll: true, //开启底部导航跟随上下滑隐藏
    ani: false, //是否让首页内容呈现交互动画
  },
  attached: function (options) {},
  pageLifetimes: {
    show: function () {

    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  methods: {
    onLoad: function () {
      let that = this;
      this.getSiteInfo();
      this.getAdvert();
      //判断用户是否第一次使用小程序
      var isFirst = wx.getStorageSync('isFirst');
      if (!isFirst) {
        that.setData({
          isFirst: true
        });
        wx.setStorageSync('isFirst', 'no')
      }
      this.getPostList(that.data.posttype, {
        per_page: 10
      });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      let user = API.login()
      if (!user) {
        user = '';
      }
      this.setData({
        user: user,
      })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    // onHide: function () {

    // },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      let that = this;
      that.setData({
        isshowError: false,
        isshowCnt: false,
        isshowLoad: true,
        istrue_scroll: false,
        page: 1,
        isLastPage: false,
        posts: []
      })
      that.getPostList(that.data.posttype, {
        per_page: 10
      });
    },
    getSiteInfo: function () {
      let that = this;
      API.getSiteInfo().then(res => {
          that.setData({
            siteInfo: res
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      let that = this;
      /* ------------------------- */
      if (!canUseReachBottom) return; //如果触底函数不可用，则不调用网络请求数据
      /* ------------------------- */

      that.setData({
        lasttip: true
      })
      if (!that.data.isLastPage) {
        this.getPostList({
          page: that.data.page
        })
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      let that = this;
      return {
        title: that.data.siteInfo.description + ' - ' + that.data.siteInfo.name,
        path: '/pages/index/index'
      }
    },

    getPostList: function (posttype, data) {
      let that = this;
      /* ------------------------- */
      canUseReachBottom = false; //触底函数关闭
      /* ------------------------- */

      wx.showNavigationBarLoading({
        complete() {
          wx.showNavigationBarLoading({
            complete() {}
          })
        }
      })

      API.getPostsList(posttype, data).then(res => {
          let args = {}
          if (res.length < 10) {
            this.setData({
              isLastPage: true,
            })
          }
          args.posts = [].concat(this.data.posts, res.map(function (item) {
            var strdate = item.date
            var excerpt = item.excerpt.rendered
            item.date = API.getDateDiff(strdate);
            // item.excerpt.rendered = API.removeHTML(excerpt);
            return item;
          }))
          args.page = this.data.page + 1
          args.isshowCnt = true
          args.isshowLoad = false
          /* ------------------------- */
          canUseReachBottom = true; //有新数据，触底函数开启，为下次触底调用做准备
          /* ------------------------- */

          that.setData(args)

          wx.hideNavigationBarLoading({
            complete() {}
          })
          wx.stopPullDownRefresh()
        })
        .catch(err => {
          console.log(err)
          if (that.data.page == 1) {
            that.setData({
              isshowError: true,
              isshowLoad: false,
              isshowCnt: false,
            })
          } else {
            this.setData({
              lasttip: false
            })
          }
          wx.hideNavigationBarLoading({
            complete() {}
          })
        })
    },

    getAdvert: function () {
      API.indexAdsense().then(res => {
          // console.log(res)
          if (res.status === 200) {
            this.setData({
              advert: res.data
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 判断底部菜单跟随。页面使用scroll-view时生效
    // scroll: function (e) {
    //   let that = this;
    //     scrollfx = e.detail.deltaY,
    //     scrolltop = e.detail.scrollTop,
    //     windowHeight = that.data.windowHeight,
    //     scrollheight = e.detail.scrollHeight - 50;

    //   if (that.data.opennavbarscroll) {
    //     if (scrolltop <= 0) {
    //       scrollfx = 1;
    //     } else if ((scrolltop + windowHeight) > scrollheight) {
    //       scrollfx = 1;
    //     }
    //     if (scrollfx < -1 && !that.data.istrue_scroll) {
    //       that.setData({
    //         istrue_scroll: true
    //       })
    //     } else if (scrollfx > -1 && that.data.istrue_scroll) {
    //       that.setData({
    //         istrue_scroll: false
    //       })
    //     }
    //   }
    //   console.log(scrollfx);
    //   console.log('height:'+e.detail.scrollHeight);
    // },

    //自定义组件中通信
    setpost: function (e) {
      let that = this;
      // console.log(e)
      that.setData({
        posts: e.detail.item,
        audKey: e.detail.audKey
      })
    },
    closewel: function (e) {
      let that = this;
      that.setData({
        isFirst: false,
      })
    },
  }
})