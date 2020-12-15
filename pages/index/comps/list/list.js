// index/component/list.js
const PCB = require('../../../../utils/common');
const API = require('../../../../utils/api');
const app = getApp()

Component({
  behaviors: [PCB],
  /**
   * 组件的属性列表
   */
  properties: {
    // 这个东西一般应该是分类的id，这里就用名称来模拟一下
    posttype: {
      type: String
    },

    // 是否加载，loaded 设置为 true 就加载数据，false时表示还未加载
    loaded: {
      type: Boolean,
      value: true,
      observer(val) {
        if (val) {
          this.refresh();
        }
      }
    }
  },

  data: {
    posts: [],
    // quot:[],
    catsstate: 'library_state', //图书类型

    page: 1,
    hasnextpage: true,
    loading: false
  },

  ready() {
    if (this.data.loaded) {
      this.refresh();
    }
  },


  methods: {
    refresh: function() {
      this.setData({
        page: 1,
        hasnextpage: true,
        // hasNextPage: true
        // posts: []
      });
      if(this.data.posttype=='topic'){
        this.getCatsstate(this.data.catsstate, {
          per_page: 10
        });
      this.getPostsList(this.data.posttype, {
          per_page: 10
        });
      } else if(this.data.posttype=='quot') {
        this.getPostsList(this.data.posttype, {
          per_page: 10
        });
      } else {
        this.onShow();
      }
    },
    onShow: function() {
      let that = this;
      let user = app.globalData.user
      if (!user) {
        user = '';
      }
      this.setData({
        user: user,
      })
      console.log('user',this.data.user)
      
      
      
      //获取缓存使用情况
      wx.getStorageInfo({
        success(res) {
          var currentSize = res.currentSize;
          if (currentSize < 1024) {
            that.setData({
              currentSize: currentSize + 'Kb'
            });
          } else {
            currentSize = currentSize / 1024;
            currentSize = String(currentSize).replace(/^(.*\..{2}).*$/, "$1");
            currentSize = parseFloat(currentSize);
            that.setData({
              currentSize: currentSize + 'Mb'
            });
          }
          console.log('size',res.currentSize);
        }
      })
    },
    getPostsList: function (posttype, data) {
      let that = this;
      API.getPostsList(posttype, data).then(res => {
          let args = {}
          if (res.length < 10) {
            this.setData({
              hasnextpage: false,
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
          this.setData(args)
          console.log(args);
          wx.stopPullDownRefresh()
        })
        .then(res => {
        setTimeout(function () {
          that.setData({
            ani: true
          });
          console.log(that.data.ani)
        }, 200);
      })
        .catch(err => {
          console.log(err)
            this.setData({
              isshowError: true,
            })
        })
    },

    onPullDownRefresh: function () {
      this.setData({
        isshowError: false,
        isshowCnt: false,
        page: 1,
        isLastPage: false,
        posts: []
      })
      that.getPostList(this.data.posttype, {
        per_page: 10
      });
    },


    onReachBottom: function () {
      this.setData({
        lasttip: true
      })
      if (!this.data.isLastPage && !this.data.loading) {
        this.getPostList(this.data.posttype, {
          page: this.data.page,
          per_page: 10
        })
      }

    },

    //自定义组件中通信
    setpost: function (e) {
      let that = this;
      console.log(e)
      that.setData({
        posts: e.detail.item,
        audKey: e.detail.audKey,
        waiting: e.detail.waiting
      })
    },
    getCatsstate: function (catstype, data) {
      API.getCategories(catstype, data).then(res => {
          this.setData({
            state: res
          })
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    
    loginOut: function() {
      API.Loginout();
      this.onLoad();
    },

    clear: function(e) {
      wx.clearStorageSync();
      wx.showToast({
        title: '清除完毕',
      })
      this.onLoad();
    },
  }
});
