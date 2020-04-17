// pages/posts/posts.js
const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  properties: {
    // 接受页面参数
    id: Number
  },
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    posts: [],

    isGoback: true,
    isActive: true, //定义头部导航是否显示背景
    pageStyle: app.globalData.pageStyle
  },
  attached: function(options) {
    var self = this;
    self.setData({
      pageBackground: app.globalData.pageBackground,
      pageStyle: app.globalData.pageStyle
    })
  },
  pageLifetimes: {
    show: function() {
      var self = this;
      app.setNavBarBg(); //设置标题栏背景色
      self.setData({
        pageBackground: app.globalData.pageBackground,
        pageStyle: app.globalData.pageStyle,
      })
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      this.setData({
        options: options
      })
      if (options.id == 1) {
        this.setData({
          categorytitle: '我的点赞'
        })
        this.getLikePosts();
      } else if (options.id == 2) {
        this.setData({
          categorytitle: '我的收藏'
        })
        this.getFavPosts();
      } else if (options.id == 3) {
        this.setData({
          categorytitle: '我的评论'
        })
        this.getCommentsPosts();
      }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
      this.setData({
        isshowError: false,
        isshowCnt: false,
        isshowLoad: true,
        page: 1,
        posts: [],
        isPull: true,
        isLastPage: flase
      })
      if (this.data.options.id == 1) {
        this.getLikePosts();
      } else if (this.data.options.id == 2) {
        this.getFavPosts();
      } else if (this.data.options.id == 3) {
        this.getCommentsPosts();
      }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
      this.setData({
        lasttip: true,
        isBottom: true
      })
      if (!this.data.isLastPage) {
        if (this.data.options.id == 1) {
          this.getLikePosts({
            page: this.data.page
          });
        } else if (this.data.options.id == 2) {
          this.getFavPosts({
            page: this.data.page
          });
        } else if (this.data.options.id == 3) {
          this.getCommentsPosts({
            page: this.data.page
          });
        }
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    getLikePosts: function(args) {
      wx.showNavigationBarLoading({
        complete() {
          wx.showNavigationBarLoading({
            complete() {
              //console.log('showNavigationBarLoading')
            }
          })
        }
      })
      API.getLikePosts(args).then(res => {
        let args = {}
        if (res.length < 10) {
          this.setData({
            isLastPage: true,
            loadtext: '到底啦',
            showloadmore: false
          })
        }
        if (this.data.isPull) {
          args.posts = [].concat(this.data.posts, res)
          args.page = this.data.page + 1
        } else if (this.data.isBottom) {
          args.posts = [].concat(this.data.posts, res)
          args.page = this.data.page + 1
        } else {
          args.posts = [].concat(this.data.posts, res)
          args.page = this.data.page + 1
        }
        this.setData(args)
        this.setData({
          isshowCnt: true,
          isshowLoad: false,
          //triggered: false
        })

        // wx.hideLoading();
        wx.hideNavigationBarLoading({
          complete() {
            //console.log('hideNavigationBarLoading')
          }
        })
        wx.stopPullDownRefresh()
      }).catch(err => {
        console.log(err)
        if (this.data.page == 1) {
          this.setData({
            isshowError: true,
            isshowLoad: false,
            isshowCnt: false,
            //triggered: false
          })
        } else {
          this.setData({
            lasttip: false
          })
        }
        wx.hideNavigationBarLoading({
          complete() {
            //console.log('hideNavigationBarLoading')
          }
        })
      })
    },

    getFavPosts: function(args) {
      API.getFavPosts(args).then(res => {
        let args = {}
        if (res.length < 10) {
          this.setData({
            isLastPage: true,
            loadtext: '到底啦',
            showloadmore: false
          })
        }
        if (this.data.isPull) {
          args.posts = [].concat(this.data.posts, res)
          args.page = this.data.page + 1
        } else if (this.data.isBottom) {
          args.posts = [].concat(this.data.posts, res)
          args.page = this.data.page + 1
        } else {
          args.posts = [].concat(this.data.posts, res)
          args.page = this.data.page + 1
        }
        this.setData(args)
      })
    },

    getCommentsPosts: function(args) {
      API.getCommentsPosts(args).then(res => {
        let args = {}
        if (res.length < 10) {
          this.setData({
            isLastPage: true,
            loadtext: '到底啦',
            showloadmore: false
          })
        }
        if (this.data.isPull) {
          args.posts = [].concat(this.data.posts, res)
          args.page = this.data.page + 1
        } else if (this.data.isBottom) {
          args.posts = [].concat(this.data.posts, res)
          args.page = this.data.page + 1
        } else {
          args.posts = [].concat(this.data.posts, res)
          args.page = this.data.page + 1
        }
        this.setData(args)

      })
    },

    bindDetail: function(e) {
      let id = e.currentTarget.id;
      let posttype = e.currentTarget.dataset.posttype;
      if (posttype == 'post') {
        posttype == 'posts'
      }
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + id + '&posttype=' + posttype,
      })
    },

    //card触摸交互
    touchstart: function(e) {
      var self = this,
        key = e.currentTarget.dataset.key,
        posts = self.data.posts;

      posts.forEach((v, i, array) => {
        v.app_celltouch = '0';
        if (i == key) {
          v.app_celltouch = '1';
        }
      })
      self.setData({
        posts: self.data.posts,
      })
    },

    touchmove: function(e) {
      var self = this,
        key = e.currentTarget.dataset.key,
        posts = self.data.posts;
      setTimeout(function() {
        posts.forEach((v, i, array) => {
          v.app_celltouch = '0';
        })
        self.setData({
          posts: self.data.posts,
        })
      }, 100);

    },

    touchend: function(e) {
      var self = this,
        key = e.currentTarget.dataset.key,
        posts = self.data.posts;
      posts.forEach((v, i, array) => {
        v.app_celltouch = '0';
      })
      self.setData({
        posts: self.data.posts,
      })
    },
  }
})