// pages/detail/detail.js
const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  properties: {
    // 接受页面参数
    posttype: String,
    cnttype: {
      type: String,
      value: 'default'
    },
    id: Number,
  },
  data: {
    detail: [],
    post: [],
    post_likes: [],
    detailshow: [],

    page: 1,
    textNum: 0,
    comments: [],
    placeholder: '输入评论',
    showtxvideo: false,
    isActive: false, //定义头部导航是否显示背景
    isGoback: true,
    opennavbarscroll: true,
  },
  attached: function (options) {},
  pageLifetimes: {
    show: function () {},
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  methods: {
    onLoad: function (options) {
      let that = this

      this.setData({
        options: options
      })

      this.getSiteInfo();
      // console.log(this.data.options)
      // console.log('option')
      if (this.data.scene == 1011 || this.data.scene == 1047 || this.data.scene == 1124) {
        this.setData({
          showOfficial: true
        })
      }
      
      if (options.posttype) {
        this.getPostsbyID(options.posttype, options.id)
        // this.getRelatePosts(options.posttype, options.id)
        this.getRelatePosts({
          post_type: options.posttype,
          id: options.id,
          per_page: 6
        })
      } else {
        this.getPostsbyID('posts', options.id)
      }
      // this.getAdvert()
      // console.log(options)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */

    onShow: function () {
      let user = app.globalData.user
      if (!user) {
        user = '';
      }
      this.setData({
        user: user,
      })
      // console.log('user', this.data.user)
    },

    //自定义组件中通信
    setpost: function (e) {
      let that = this;
      // console.log(e)
      that.setData({
        post: e.detail.item,
        audKey: e.detail.audKey,
        waiting: e.detail.waiting
      })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    scroll: function (e) {
      var that = this,
        scrollfx = e.detail.deltaY,
        scrolltop = e.detail.scrollTop,
        windowHeight = that.data.windowHeight,
        scrollheight = e.detail.scrollHeight - 50;

      if (that.data.opennavbarscroll) {
        if (scrolltop <= 0) {
          scrollfx = 1;
        } else if ((scrolltop + windowHeight) > scrollheight) {
          scrollfx = 1;
        }
        if (scrolltop > 88) {
          that.setData({
            istrue_scroll: true,
            isActive: true
          })
        } else {
          that.setData({
            istrue_scroll: false,
            isActive: false
          })
        }
      }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      return {
        title: this.data.detail.title.rendered + ' - ' + this.data.siteinfo.name,
        path: '/pages/detail/detail?id=' + this.data.detail.id + '&isshare=1&posttype=' + this.data.posttype
      }
    },

    onShareTimeline: function () {
      return {
        title: this.data.detail.title.rendered + ' - ' + this.data.siteinfo.name,
        query: 'id=' + this.data.detail.id + '&isshare=1&posttype=' + this.data.posttype,
        imageUrl: this.data.detail.meta.thumbnail
      }
    },

    getPostsbyID: function (posttype, id) {
      let that = this;
      API.getPostsbyID(posttype, id).then(res => {
          that.setData({
            id: id,
            detail: res,
            post: [res],
            post_likes: res.post_likes
          })
          if (res.rating_avg != null) {
            this.setData({
              detailrating_avg: API.mathRoundRate(res.rating_avg.avg),
            })
          }
          this.setData({
            isshowCnt: true
          })
        })
        .catch(err => {
          console.log(err)
          this.setData({
            isshowError: true,
            isshowCnt: false,
          })
        })
    },

    getRelatePosts: function (args) {
      API.getRelatePosts(args).then(res => {
          let args = {}
          args.posts = res
          this.setData(args)
          // console.log(this.data.posts)
        })
        .catch(err => {
          console.log(err)
        })
    },

    bindFavTap: function (e) {
      let args = {}
      let detail = this.data.detail
      let count = detail.favs
      args.id = e.currentTarget.id
      API.fav(args).then(res => {
          //console.log(res)
          if (res.status === 200) {
            wx.showToast({
              title: '加入收藏!',
              icon: 'success',
              duration: 900,
            })
            detail.favs = count + 1
            detail.isfav = true
            this.setData({
              detail: detail
            })
          } else if (res.status === 202) {
            wx.showToast({
              title: '取消收藏!',
              icon: 'success',
              duration: 900,
            })
            detail.favs = count - 1
            detail.isfav = false
            this.setData({
              detail: detail
            })
          } else {
            wx.showToast({
              title: '数据出错!',
              icon: 'success',
              duration: 900,
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    bindLikeTap: function (e) {
      // console.log(e)
      let args = {}
      let detail = this.data.detail
      let count = detail.likes
      args.id = e.currentTarget.id
      API.like(args).then(res => {
          // console.log(res)
          if (res.status === 200) {
            wx.showToast({
              title: '谢谢点赞!',
              icon: 'success',
              duration: 900,
            })

            detail.likes = count + 1
            detail.islike = true

            this.setData({
              detail: detail
            })

            API.getPostsbyID(this.data.options.posttype, this.data.options.id).then(res => {
              this.setData({
                post_likes: res.post_likes
              })
            })

            // console.log(this.data.post_likes)
          } else if (res.status === 202) {
            wx.showToast({
              title: '取消点赞!',
              icon: 'success',
              duration: 900,
            })

            detail.likes = count - 1
            detail.islike = false
            this.setData({
              detail: detail
            })
            API.getPostsbyID(this.data.options.posttype, this.data.options.id).then(res => {
              this.setData({
                post_likes: res.post_likes
              })
            })
            // console.log(this.data.post_likes)

          } else {
            wx.showModal({
              title: '温馨提示',
              content: '数据出错, 建议清除缓存重新尝试'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    

    // 跳转至地图
    redictAmap: function (e) {
      var shop_location = e.currentTarget.dataset.shop_location,
        shop_name = e.currentTarget.dataset.shop_name,
        shop_ads = e.currentTarget.dataset.shop_ads,
        shop_tel = e.currentTarget.dataset.shop_tel,
        url = '../amap/amap?shop_location=' + shop_location + '&shop_name=' + shop_name + '&shop_ads=' + shop_ads + '&shop_tel=' + shop_tel;
      wx.navigateTo({
        url: url
      })
    },

    gotoworks: function () {
      this.setData({
        toView: 'worksarea'
      })
    },

    bindotherDetail: function (e) {
      let id = e.currentTarget.id;
      let posttype = e.currentTarget.dataset.posttype;
      let cnttype = e.currentTarget.dataset.cnttype
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + id + '&posttype=' + posttype + '&cnttype=' + cnttype,
      })
    },

    showTxvideo: function () {
      this.setData({
        showtxvideo: true
      });
    },

    hideTxvideo: function () {
      this.setData({
        showtxvideo: false
      });
    },
  }
})