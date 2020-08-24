const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  data: {
    posts: [],
    page: 1,
    posttype: 'shop',
    catstype: 'shopcats', 

    isActive: true, //定义头部导航是否显示背景
    isTomine: true,
    isSkin: true,
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
    onLoad: function() {
      let that = this;
      this.getSiteInfo();
      //this.getStickyPosts();
      this.getCategories(that.data.catstype, that.data);
      //this.getAdvert();
      this.getPostList(that.data.posttype, that.data);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    // onShow: function () {

    // },

    /**
     * 生命周期函数--监听页面隐藏
     */
    // onHide: function () {

    // },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
      let that = this;
      that.setData({
        isshowError: false,
        isshowCnt: false,
        isshowLoad: true,
        page: 1,
        isLastPage: false,
        posts: []
      })
      that.getCategories(that.data.catstype, that.data);
      that.getPostList(that.data.posttype, that.data);
    },
    getSiteInfo: function() {
      API.getSiteInfo().then(res => {
        this.setData({
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
    onReachBottom: function() {
      this.setData({
        lasttip: true
      })
      if (!this.data.isLastPage) {
        this.getPostList({
          page: this.data.page
        })
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
      return {
        title: this.data.siteInfo.description + ' - ' + this.data.siteInfo.name,
        path: '/pages/index/index'
      }
    },

    getStickyPosts: function() {
      API.getStickyPosts().then(res => {
          this.setData({
            stickyPost: res
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    getCategories: function(catstype, data) {
      API.getCategories(catstype, data).then(res => {
          this.setData({
            category: res
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    getPostList: function(posttype, data) {
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
            args.posts = [].concat(this.data.posts, res.map(function (item) {
              var strdate = item.date
              var excerpt = item.excerpt.rendered
              item.date = API.getDateDiff(strdate);
              item.excerpt.rendered = API.removeHTML(excerpt);
              item.shop_men_tel = API.addxing(item.shop_men_tel);
              item.shop_tel = API.addxing(item.shop_tel);
              return item;
            }))
            args.page = this.data.page + 1
          } else {
            args.posts = [].concat(this.data.posts, res.map(function (item) {
              var strdate = item.date
              var excerpt = item.excerpt.rendered
              item.date = API.getDateDiff(strdate);
              item.excerpt.rendered = API.removeHTML(excerpt);
              item.shop_men_tel = API.addxing(item.shop_men_tel);
              item.shop_tel = API.addxing(item.shop_tel);
              item.shop_men_mail = API.addxing(item.shop_men_mail);
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

    bindCateByID: function(e) {
      let id = e.currentTarget.id;
      this.setData({
        showpop: false
      })
      wx.navigateTo({
        url: '/pages/list/list?id=' + id + '&posttype=' + this.data.posttype + '&catstype=' + this.data.catstype,
      })
    },

    bindDetail: function(e) {
      let id = e.currentTarget.id;
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + id + '&posttype=' + this.data.posttype,
      })
    },
    
  }
})