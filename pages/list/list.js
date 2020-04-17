/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
// pages/list/list.js
const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  properties: {
    // 接受页面参数
    posttype: String,
    catstype: String,
    id: Number,
    s: String,
  },
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    page: 1,
    posts: [],
    isLoadAll: false,

    isActive: false, //定义头部导航是否显示背景
    isGoback: true,
    pageStyle: app.globalData.pageStyle
  },
  attached: function(options) {
    var self = this;
    self.setData({
      pageBackground: app.globalData.pageBackground,
      pageStyle: app.globalData.pageStyle
      //skinSwitch: app.globalData.skinSwitch
    })
  },
  pageLifetimes: {
    show: function() {
      var self = this;
      app.setNavBarBg(); //设置标题栏背景色
      self.setData({
        pageBackground: app.globalData.pageBackground,
        pageStyle: app.globalData.pageStyle
      });
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
      // this.getAdvert()
      if (options.id) {
        this.setData({
          listtype: 'category'
        })
        this.getPostList(options.posttype,{
          categories: options.id,
          page: this.data.page
        });
        this.getCategories(options.catstype, this.data);
        this.getCategoryByID(options.catstype,options.id);
      }
      if (options.s) {
        this.getPostList(options.posttype,{
          search: options.s,
          page: this.data.page
        });
        this.setData({
          listtype: 'search',
          searchtitle: '关键词“' + options.s + '”的结果'
        })
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
        isLastPage: false,
        posts: []
      })
      if (this.data.options.id) {
        this.getPostList(this.data.options.posttype,{
          categories: this.data.options.id
        });
      }
      if (this.data.options.s) {
        this.getPostList(this.data.options.posttype,{
          search: this.data.options.s
        });
      }

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
      this.setData({
        lasttip: true
      })
      if (!this.data.isLastPage) {
        if (this.data.options.id) {
          this.getPostList({
            categories: this.data.options.id,
            page: this.data.page
          });
        }
        if (this.data.options.s) {
          this.getPostList({
            search: this.data.options.s,
            page: this.data.page
          });
        }
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
      if (this.data.options.id) {
        return {
          title: this.data.catetitle + ' - APP比比',
          path: '/pages/list/list?id=' + this.data.options.id + '&isshare=1&posttype=' + this.data.options.posttype + '&catstype=' + this.data.options.catstype

        }
      }
      if (this.data.options.s) {
        return {
          title: '关键词“' + this.data.options.s + '”的结果 - APP比比',
          path: '/pages/list/list?id=' + this.data.options.id + '&isshare=1&posttype=' + this.data.options.posttype + '&s=' + this.data.options.s

        }
      }
      
    },

    getCategoryByID: function(catstype,id) {
      API.getCategoryByID(catstype,id).then(res => {
          this.setData({
            catetitle: res.name
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    getCategories: function (catstype, data) {
      API.getCategories(catstype, data).then(res => {
        this.setData({
          category: res
        })
      })
        .catch(err => {
          console.log(err)
        })
    },

    getPostList: function (posttype, data) {
      // wx.showLoading({
      //   title: '正在加载',
      //   mask: true
      // });
      wx.showNavigationBarLoading({
        complete() {
          wx.showNavigationBarLoading({
            complete() {
              //console.log('showNavigationBarLoading')
            }
          })
        }
      })

      if (this.data.page === 1) {
        this.setData({
          posts: []
        });
      };
      API.getPostsList(posttype, data).then(res => {
        let args = {}
        //this.data.is_load = false
        if (res.length < 10) {
          this.setData({

            isLastPage: true,
            // loadtext: '到底啦',
            // showloadmore: false
          })
        }
        if (this.data.isBottom) {
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
      })
        .catch(err => {
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

    getAdvert: function() {
      API.listAdsense().then(res => {
          console.log(res)
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

    bindCateByID: function (e) {
      let id = e.currentTarget.id;
      this.setData({
        showpop: false
      })
      wx.redirectTo({
        url: '/pages/list/list?id=' + id + '&posttype=' + this.data.posttype + '&catstype=' + this.data.catstype,
      })
    },

    bindDetail: function (e) {
      let id = e.currentTarget.id;
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + id + '&posttype=' + this.data.posttype,
      })
    },

    //card触摸交互
    touchstart: function (e) {
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

    touchmove: function (e) {
      var self = this,
        key = e.currentTarget.dataset.key,
        posts = self.data.posts;
      setTimeout(function () {
        posts.forEach((v, i, array) => {
          v.app_celltouch = '0';
        })
        self.setData({
          posts: self.data.posts,
        })
      }, 100);

    },

    touchend: function (e) {
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