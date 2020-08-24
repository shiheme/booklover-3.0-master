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
    id:1,
    posts: [],

    isGoback: true,
    isActive: true, //定义头部导航是否显示背景
  },
  attached: function(options) {

  },
  pageLifetimes: {
    show: function() {

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
      wx.showNavigationBarLoading({
        complete() {
          wx.showNavigationBarLoading({
            complete() {
              //console.log('showNavigationBarLoading')
            }
          })
        }
      })
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
          // args.posts = [].concat(this.data.posts, res)
          args.posts = [].concat(this.data.posts, res.map(function (item) {
            var strdate = item.date
            var excerpt = item.excerpt.rendered
            item.date = API.getDateDiff(strdate);
            item.excerpt.rendered = API.removeHTML(excerpt);
            item.isDuringDate = API.isDuringDate(item.app_starttime, item.app_endtime);
            return item;
          }))
          args.page = this.data.page + 1
        } else if (this.data.isBottom) {
          // args.posts = [].concat(this.data.posts, res) 
          args.posts = [].concat(this.data.posts, res.map(function (item) {
            var strdate = item.date
            var excerpt = item.excerpt.rendered
            item.date = API.getDateDiff(strdate);
            item.excerpt.rendered = API.removeHTML(excerpt);
            item.isDuringDate = API.isDuringDate(item.app_starttime, item.app_endtime);
            return item;
          }))
          args.page = this.data.page + 1
        } else {
          // args.posts = [].concat(this.data.posts, res)
          args.posts = [].concat(this.data.posts, res.map(function (item) {
            var strdate = item.date
            var excerpt = item.excerpt.rendered
            item.date = API.getDateDiff(strdate);
            item.excerpt.rendered = API.removeHTML(excerpt);
            item.isDuringDate = API.isDuringDate(item.app_starttime, item.app_endtime);
            return item;
          }))
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
      let posttype;
      if (e.currentTarget.dataset.posttype == 'post') {
        posttype = 'posts';
      } else {
        posttype = e.currentTarget.dataset.posttype;
      }
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + id + '&posttype=' + posttype,
      })
    },

    //card触摸交互
    touchstart: function(e) {
      let that = this,
        key = e.currentTarget.dataset.key,
        posts = that.data.posts;

      posts.forEach((v, i, array) => {
        v.app_celltouch = '0';
        if (i == key) {
          v.app_celltouch = '1';
        }
      })
      that.setData({
        posts: that.data.posts,
      })
    },

    touchmove: function(e) {
      let that = this,
        key = e.currentTarget.dataset.key,
        posts = that.data.posts;
      setTimeout(function() {
        posts.forEach((v, i, array) => {
          v.app_celltouch = '0';
        })
        that.setData({
          posts: that.data.posts,
        })
      }, 100);

    },

    touchend: function(e) {
      let that = this,
        key = e.currentTarget.dataset.key,
        posts = that.data.posts;
      posts.forEach((v, i, array) => {
        v.app_celltouch = '0';
      })
      that.setData({
        posts: that.data.posts,
      })
    },
  }
})