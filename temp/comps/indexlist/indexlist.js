// index/component/list.js
const PCB = require('../../../utils/common');
const API = require('../../../utils/api');
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

    siteinfo: {
      type: Array
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
    loading: false,
    per_page:5,
  },

  ready() {
    if (this.data.loaded) {
      this.refresh();
    }

  },


  methods: {
    refresh: function () {
      this.setData({
        page: 1,
        hasnextpage: true,
        // hasNextPage: true
        // posts: []
      });
      // console.log(this.data.siteinfo)

      if (this.data.posttype == 'topic') {
        this.getCatsstate(this.data.catsstate, {
          per_page: 10
        });
        this.getPostsList(this.data.posttype, {
          per_page: this.data.per_page
        });
        console.log(this.data.siteinfo)
      } else if (this.data.posttype == 'quot') {
        this.getPostsList(this.data.posttype, {
          per_page: this.data.per_page
        });
      } else {
        this.onShow();
      }
    },

    onShow: function () {
      let that = this;
      let user = app.globalData.user
      if (!user) {
        user = '';
      }
      this.setData({
        user: user,
      })
      console.log('user', this.data.user)

      if (user) {
        this.refreshmsg();
      }

    },
    refreshmsg: function () {
      API.getProfile().then(res => {
          // console.log(res)
          this.setData({
            user_likes: res.user_likes,
            user_fav: res.user_fav,
            user_comment: res.user_comment,
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    onPullDownRefresh: function (e) {
      this.setData({
        page: 1,
        hasnextpage: true,
        posts: [],
        loading:true,
        ani: false
      })
      if (this.data.posttype == 'topic') {
        this.getCatsstate(this.data.catsstate, {
          per_page: 10
        });
        this.getPostsList(this.data.posttype, {
          per_page: this.data.per_page
        });
        console.log(this.data.siteinfo)
      } else if (this.data.posttype == 'quot') {
        this.getPostsList(this.data.posttype, {
          per_page: this.data.per_page
        });
      }
    },


    onReachBottom: function () {
      if (this.data.hasnextpage && !this.data.loading) {
        this.setData({
          page: this.data.page + 1
        });
        if (this.data.posttype == 'topic') {
          this.getPostsList(this.data.posttype, {
            per_page: this.data.per_page,
            page: this.data.page
          });
        } else if (this.data.posttype == 'quot') {
          this.getPostsList(this.data.posttype, {
            per_page: this.data.per_page,
            page: this.data.page
          });
        }
      }

    },

    getPostsList: function (posttype, data) {
      let that = this;
      API.getPostsList(posttype, data).then(res => {
          let args = {}
          if (res.length < this.data.per_page) {
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
          // args.page = this.data.page + 1
          args.loading = false
          this.setData(args)

          // console.log(args);
          wx.stopPullDownRefresh()
        })
        .then(res => {
          setTimeout(function () {
            that.setData({
              ani: true
            });
            // console.log(that.data.ani)
          }, 200);
        })
        .catch(err => {
          console.log(err)
          this.setData({
            isshowError: true,
          })
        })
    },

    

    //自定义组件中通信
    setpost: function (e) {
      let that = this;
      // console.log(e)
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
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    loginOut: function () {
      API.Loginout();
    },

    subscribeMessage: function (template, status) {
      let args = {}
      args.openid = this.data.user.openId
      args.template = template
      args.status = status
      args.pages = getCurrentPages()[0].route
      args.platform = wx.getSystemInfoSync().platform
      args.program = 'WeChat'
      API.subscribeMessage(args).then(res => {
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    bindSubscribe: function () {
      let that = this
      let templates = API.template().subscribe
      wx.requestSubscribeMessage({
        tmplIds: templates,
        success(res) {
          if (res.errMsg == "requestSubscribeMessage:ok") {
            for (let i = 0; i < templates.length; i++) {
              let template = templates[i]
              that.subscribeMessage(template, "accept")
            }
            wx.showToast({
              title: "订阅完成",
              icon: 'success',
              duration: 1000
            })
          }
        },
        fail: function (res) {
          // console.log(res)
        }
      })
    },
  }
});