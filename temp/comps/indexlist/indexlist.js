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

    isadmin: {
      type:Boolean
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
    catsstate: '', //类型

    page: 1,
    hasnextpage: true,
    loading: false,
    per_page: 5
  },

  ready() {
    if (this.data.loaded) {
      this.refresh();
    }

  },
  attached: function (options) {

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
        if (this.data.cnttype == 'library') {
          this.setData({
            catsstate: "library_state",
          });
        } else if (this.data.cnttype == 'films') {
          this.setData({
            catsstate: "films_cats",
          });
        } else if (this.data.cnttype == 'app') {
          this.setData({
            catsstate: "app_cats",
          });
        }

        // this.getTags({
        //   per_page: 10
        // });
        this.getCatsstate(this.data.catsstate, {
          per_page: 10
        });
        this.getPostsList(this.data.posttype, {
          per_page: this.data.per_page,
          topic_cats: this.data.topic_cats
        });
      } else if (this.data.posttype == 'quot') {
        this.getPostsList(this.data.posttype, {
          per_page: this.data.per_page,
          quot_cats: this.data.quot_cats
        });
      } else if (this.data.posttype == 'top') {
        this.getMostViewsPosts(this.data.cnttype, {
          page: 1,
          per_page: 5
        });
      }
    },

    onShow: function () {
      
    },

    onPullDownRefresh: function (e) {
      this.setData({
        page: 1,
        hasnextpage: true,
        posts: [],
        loading: true,
        ani: false
      })
      if (this.data.posttype == 'topic') {
        this.getPostsList(this.data.posttype, {
          per_page: this.data.per_page,
          topic_cats: this.data.topic_cats
        });
      } else if (this.data.posttype == 'quot') {
        this.getPostsList(this.data.posttype, {
          per_page: this.data.per_page,
          quot_cats: this.data.quot_cats
        });
      } else if (this.data.posttype == 'top') {
        this.getMostViewsPosts(this.data.cnttype, {
          page: 1,
          per_page: 5
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
            topic_cats: this.data.topic_cats,
            page: this.data.page
          });
        } else if (this.data.posttype == 'quot') {
          this.getPostsList(this.data.posttype, {
            per_page: this.data.per_page,
            page: this.data.page,
            quot_cats: this.data.quot_cats
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

          console.log(args);
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

    getMostViewsPosts: function (posttype, data) {
      let that = this;
      let toplist = [];
      API.getMostViewsPosts(posttype, data).then(res => {
        
        let str = [];
        if (res.length > 0) {
          for (let i = 0, len = res.length; i < len; i += 5) {
            str.push(res.slice(i, i + 5))
          }
          for (let i = 0; i < str.length; i++) {
            let obj = {};
            obj['posts'] = str[i]
            obj['name'] = '浏览最多'
            obj['type'] = 'views'
            toplist.push(obj)
          }
        }
      
      });
     API.getMostLikePosts(posttype, data).then(res => {
        let str2 = [];
        if (res.length > 0) {
          for (let i = 0, len = res.length; i < len; i += 5) {
            str2.push(res.slice(i, i + 5))
          }
          for (let i = 0; i < str2.length; i++) {
            let obj2 = {};
            obj2['posts'] = str2[i]
            obj2['name'] = '点赞最多'
            obj2['type'] = 'likes'
            toplist.push(obj2)
          }
        }
      
      this.setData({
        toplist:toplist,
        hasnextpage:false,
        loading:false})
      console.log(this.data.toplist);
      }).then(res => {
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
      });
    
      


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
  }
});