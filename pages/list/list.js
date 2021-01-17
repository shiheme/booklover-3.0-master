// pages/list/list.js
const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  properties: {
    // 接受页面参数
    id: Number,
    tabid: Number, //我操作的 1点赞 2收藏 3评星
    posttype: String,
    postcnttype: String,
    catsid: String,
    stateid: String,
    statetxt: String,
    catstxt: String,
    s: String,
    cnt_tp: String,
    title: {
      type: String,
      value: ''
    },

    libid: Number,
    libtit: String,
    libcolor: String,

  },
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    page: 1,
    hasnextpage: true,
    loading: false,
    per_page: 12,
    posts: [],

    catstext: '',
    statetext: '',
    catsid: '', //留空为全部
    stateid: '', //留空为全部
    catstype: '', //图书分类
    catsstate: '', //图书类型

    showemoji: false,
    islib: false,
    placeholder: '说点什么吧～',
    parent:0,

    gridtype: 'list', //内容布局，在onload中设置，默认网格显示。water网格显示，list列表显示。布局会优先读取本地缓存
    ani: true,

    isActive: true, //定义头部导航是否显示背景
    isGoback: true,
  },
  attached: function (options) {

  },

  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        options: options
      })
      // 对于分享进入的链接做内容类型缓存
      if (options.cnttype) {
        let cnttype = options.cnttype;
        app.globalData.cnttype = cnttype
      } else if (wx.getStorageSync('cnttype')) {
        let cnttype = wx.getStorageSync('cnttype');
        app.globalData.cnttype = cnttype
      } else {
        let cnttype = this.data.cnttype;
        app.globalData.cnttype = cnttype
      }

      this.setData({
        cnttype: app.globalData.cnttype
      })
      //保存到本地
      wx.setStorage({
        key: "cnttype",
        data: app.globalData.cnttype
      })
      console.log(app.globalData.cnttype)
      // 结束对于分享进入的链接做内容类型缓存
      if (wx.getStorageSync('sourcegridtype')) {
        this.setData({
          gridtype: wx.getStorageSync('sourcegridtype')
        })
      } else {
        this.setData({
          gridtype: 'list'
        })
      }

      // this.getSiteInfo();
        this.setData({
          siteinfo: app.globalData.siteinfo
        })
      // this.getAdvert()
      this.setData({
        options: options
      })
      if (options.tabid == 1) {
        this.getLikePosts({
          post_type: 'library',
        });
        this.setData({
          posttype: 'library'
        })
      } else if (options.tabid == 2) {
        this.getFavPosts();
      } else if (options.tabid == 3) {
        this.getCommentsPosts();
      } else if (options.toptype) {
        this.getMostPosts(this.data.cnttype, {
          page: this.data.page,
          per_page: this.data.per_page
        });
        this.setData({
          toptype: '按照“' + options.toptypetitle + '”排序',
          
        })
      } else if (options.id && options.posttype == 'talk') {
        this.getPostsbyID(options.posttype, options.id)
      } else if (options.s) {
        this.getPostList(options.posttype, {
          search: options.s,
          page: this.data.page,
          per_page: this.data.per_page
        });
        this.setData({
          searchtitle: '“' + options.s + '”的'+options.cnt_tp+'结果',
          title: '搜索',
          
        })
      } else if(options.posttype == 'library') {
        this.getPostList(options.posttype, {
          library_cats: this.data.catsid,
          library_state: this.data.stateid,
          page: this.data.page,
          per_page: this.data.per_page
        });
        this.setData({
          title: options.title,
          catstype: 'library_cats', //图书分类
          catsstate: 'library_state', //图书类型
        });
        this.getCatstype(this.data.catstype, {
          per_page: 20
        });
      } else if(options.posttype == 'films') {
        this.getPostList(options.posttype, {
          films_cats: this.data.catsid,
          page: this.data.page,
          per_page: this.data.per_page
        });
        this.setData({
          title: options.title,
          catstype: 'films_cats', 
        })
        this.getCatstype(this.data.catstype, {
          per_page: 20
        });
        
      } else if(options.posttype == 'app') {
        this.getPostList(options.posttype, {
          app_cats: this.data.catsid,
          page: this.data.page,
          per_page: this.data.per_page
        });
        this.setData({
          title: options.title,
          catstype: 'app_cats', 
        })
        this.getCatstype(this.data.catstype, {
          per_page: 20
        });
        
      } else if(options.posttype == 'pro') {
        this.getPostList(options.posttype, {
          pro_cats: this.data.catsid,
          page: this.data.page,
          per_page: this.data.per_page
        });
        this.setData({
          title: options.title,
          catstype: 'pro_cats', 
        })
        this.getCatstype(this.data.catstype, {
          per_page: 20
        });
        
      }else if(options.posttype == 'act') {
        this.setData({
          title: options.title,
          catstype: 'act_cats', 
        })
        this.getCatstype(this.data.catstype, {
          per_page: 10
        });
        this.getPostList(options.posttype, {
          page: this.data.page,
          per_page: this.data.per_page
        });
        
      }else if(options.posttype == 'faq') {
        this.setData({
          title: options.title,
          catstype: 'faq_cats', 
        })
        this.getCatstype(this.data.catstype, {
          per_page: 10
        });
        this.getPostList(options.posttype, {
          page: this.data.page,
          per_page: this.data.per_page
        });
        
      } else {
        this.getPostList(options.posttype, {
          page: this.data.page,
          per_page: this.data.per_page
        });
        this.setData({
          title: options.title
        })
      }
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
      if (user.role == 'administrator') {
        this.setData({
          isadmin: true
        })
      }
      console.log('user', this.data.user)
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
      this.setData({
        isshowError: false,
        isshowCnt: false,
        isshowLoad: true,
        page: 1,
        isLastPage: false,
        posts: []
      })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if (this.data.hasnextpage && !this.data.loading) {
        this.setData({
          page: this.data.page + 1
        });
        if (this.data.options.id && this.data.options.posttype == 'talk') {
          this.getPostsbyID(this.data.options.posttype, this.data.options.id)
        } else if (this.data.options.s) {
          this.getPostList(this.data.options.posttype, {
            search: this.data.options.s,
            page: this.data.page,
            per_page: this.data.per_page
          });
          this.setData({
            searchtitle: '“' + this.data.options.s + '”的结果',
            title: '搜索',
            
          })
        } else if(this.data.options.posttype == 'library') {
          this.getPostList(this.data.options.posttype, {
            library_cats: this.data.catsid,
            library_state: this.data.stateid,
            page: this.data.page,
            per_page: this.data.per_page
          });
          this.setData({
            title: this.data.options.title,
            catstype: 'library_cats', //图书分类
            catsstate: 'library_state', //图书类型
          });
          this.getCatstype(this.data.catstype, {
            per_page: 20
          });
        } else if(this.data.options.posttype == 'films') {
          this.getPostList(this.data.options.posttype, {
            films_cats: this.data.catsid,
            page: this.data.page,
            per_page: this.data.per_page
          });
          this.setData({
            title: this.data.options.title,
            catstype: 'films_cats', 
          })
          this.getCatstype(this.data.catstype, {
            per_page: 20
          });
          
        } else if(this.data.options.posttype == 'app') {
          this.getPostList(this.data.options.posttype, {
            app_cats: this.data.catsid,
            page: this.data.page,
            per_page: this.data.per_page
          });
          this.setData({
            title: this.data.options.title,
            catstype: 'app_cats', 
          })
          this.getCatstype(this.data.catstype, {
            per_page: 20
          });
          
        } else if(this.data.options.posttype == 'pro') {
          this.getPostList(this.data.options.posttype, {
            pro_cats: this.data.catsid,
            page: this.data.page,
            per_page: this.data.per_page
          });
          this.setData({
            title: this.data.options.title,
            catstype: 'pro_cats', 
          })
          this.getCatstype(this.data.catstype, {
            per_page: 20
          });
          
        }  else {
          this.getPostList(this.data.options.posttype, {
            page: this.data.page,
            per_page: this.data.per_page
          });
          this.setData({
            title: this.data.options.title
          })
        }
      }
    },

    bindCateByID: function (e) {
      let id = e.currentTarget.id;
      this.setData({
        posts:[],
        page:1,
        hasnextpage:true
      })
      if(this.data.options.posttype == 'act') {
        this.getPostList(this.data.options.posttype, {
          act_cats: id,
          page: this.data.page,
          per_page: this.data.per_page
        });
        
      }else if(this.data.options.posttype == 'faq') {
        this.getPostList(this.data.options.posttype, {
          faq_cats: id,
          page: this.data.page,
          per_page: this.data.per_page
        });
        
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      return {
        title: this.data.siteinfo.description + ' - ' + this.data.siteinfo.name,
        path: '/pages/index/index?cnttype='+this.data.cnttype
      }
    },

    bindUpdatepost(e) {
      this.setData({
        selectchange: e.detail.selectchange,
        isreset: e.detail.isreset,
        catstxt: e.detail.catstxt,
        statetxt: e.detail.statetxt,
        catsid: e.detail.catsid,
        stateid: e.detail.stateid,
        posts: e.detail.posts,
        page: e.detail.page,
        hasnextpage: e.detail.hasnextpage
      })
      if(this.data.options.posttype == 'library') {
        this.getPostList(this.data.options.posttype, {
          library_cats: this.data.catsid,
          library_state: this.data.stateid,
          page: this.data.page,
          per_page: this.data.per_page
        });
        // this.setData({
        //   title: this.data.options.title,
        //   catstype: 'library_cats', //图书分类
        //   catsstate: 'library_state', //图书类型
        // });
        // this.getCatstype(this.data.catstype, {
        //   per_page: 20
        // });
      } else if(this.data.options.posttype == 'films') {
        this.getPostList(this.data.options.posttype, {
          films_cats: this.data.catsid,
          page: this.data.page,
          per_page: this.data.per_page
        });
        // this.setData({
        //   title: this.data.options.title,
        //   catstype: 'films_cats', 
        // })
        // this.getCatstype(this.data.catstype, {
        //   per_page: 20
        // });
        
      } else if(this.data.options.posttype == 'app') {
        this.getPostList(this.data.options.posttype, {
          app_cats: this.data.catsid,
          page: this.data.page,
          per_page: this.data.per_page
        });
        // this.setData({
        //   title: this.data.options.title,
        //   catstype: 'app_cats', 
        // })
        // this.getCatstype(this.data.catstype, {
        //   per_page: 20
        // });
        
      } else if(this.data.options.posttype == 'pro') {
        this.getPostList(this.data.options.posttype, {
          pro_cats: this.data.catsid,
          page: this.data.page,
          per_page: this.data.per_page
        });
        // this.setData({
        //   title: this.data.options.title,
        //   catstype: 'pro_cats', 
        // })
        // this.getCatstype(this.data.catstype, {
        //   per_page: 20
        // });
        
      }
      if (this.data.isreset) {
        this.getCatstype(this.data.catstype, {
          per_page: 20
        });
      }
    },
    getPostList: function (posttype, data) {
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
            item.date = API.getDateDiff(strdate);
            if(item.act_starttime && item.act_endtime){
            item.isDuringDate = API.isDuringDate(item.act_starttime, item.act_endtime);
          }
            return item;
          }))
          // args.page = this.data.page + 1
console.log(args)
          this.setData(args)
          // console.log(args)
          wx.stopPullDownRefresh()
        })
        .catch(err => {
          console.log(err)
        })
    },
    bindtablike: function (e){
      let posttype= e.currentTarget.dataset.posttype;
      this.setData({
        hasnextpage: true,
        posts:[],
        posttype:posttype
      })
      this.getLikePosts({
        post_type: posttype
      });
    },
    getLikePosts: function (args) {
      let that = this;

      API.getLikePosts(args).then(res => {
          let args = {}
          if (res.length < 10) {
            this.setData({
              hasnextpage: false,
            })
          }

          args.posts = [].concat(this.data.posts, res.map(function (item) {
            var strdate = item.date
            item.date = API.getDateDiff(strdate);
            if(item.act_starttime && item.act_endtime){
              item.isDuringDate = API.isDuringDate(item.act_starttime, item.act_endtime);
            }
            return item;
          }))
          // args.page = this.data.page + 1

          this.setData(args)
          // console.log(args)
          wx.stopPullDownRefresh()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getFavPosts: function (args) {
      let that = this;

      API.getFavPosts(args).then(res => {
          let args = {}
          if (res.length < 10) {
            this.setData({
              hasnextpage: false,
            })
          }

          args.posts = [].concat(this.data.posts, res.map(function (item) {
            var strdate = item.date
            item.date = API.getDateDiff(strdate);
            return item;
          }))
          // args.page = this.data.page + 1

          this.setData(args)
          // console.log(args)
          wx.stopPullDownRefresh()
        })
        .catch(err => {
          console.log(err)
        })
    },

    getMostPosts: function (posttype, data) {
      let that = this;
      let args = [];
      if(this.data.options.toptype == 'views'){
      API.getMostViewsPosts(posttype, data).then(res => {
        let args = {}
          if (res.length < this.data.per_page) {
            this.setData({
              hasnextpage: false,
            })
          }
          args.posts = res
          // args.page = this.data.page + 1
          args.loading = false
          this.setData(args)
      });
    } else if(this.data.options.toptype == 'likes'){
      API.getMostLikePosts(posttype, data).then(res => {
        let args = {}
          if (res.length < this.data.per_page) {
            this.setData({
              hasnextpage: false,
            })
          }
          args.posts = res
          // args.page = this.data.page + 1
          args.loading = false
          this.setData(args)
      });
    }else if(this.data.options.toptype == 'comments'){
      API.getMostCommentPosts(posttype, data).then(res => {
        let args = {}
          if (res.length < this.data.per_page) {
            this.setData({
              hasnextpage: false,
            })
          }
          args.posts = res
          // args.page = this.data.page + 1
          args.loading = false
          this.setData(args)
      });
    }else if(this.data.options.toptype == 'favs'){
      API.getMostFavPosts(posttype, data).then(res => {
        let args = {}
          if (res.length < this.data.per_page) {
            this.setData({
              hasnextpage: false,
            })
          }
          args.posts = res
          // args.page = this.data.page + 1
          args.loading = false
          this.setData(args)
      });
    }
      


    },

    getCommentsPosts: function (args) {
      let that = this;

      API.getCommentsPosts(args).then(res => {
          let args = {}
          if (res.length < 10) {
            this.setData({
              hasnextpage: false,
            })
          }

          args.posts = [].concat(this.data.posts, res.map(function (item) {
            var strdate = item.date
            item.date = API.getDateDiff(strdate);
            return item;
          }))
          // args.page = this.data.page + 1

          this.setData(args)
          // console.log(args)
          wx.stopPullDownRefresh()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCatstype: function (catstype, data) {
      let that = this;
      API.getCategories(catstype, data).then(res => {
          this.setData({
            category: res
          })
          this.getCatsstate(that.data.catsstate, {
            per_page: 10
          });
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCatsstate: function (catsstate, data) {
      API.getCategories(catsstate, data).then(res => {
          this.setData({
            state: res
          })
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    bindGridchange: function (e) {
      if (this.data.gridtype == 'list') {
        this.setData({
          gridtype: 'water'
        })
        //保存到本地
        wx.setStorage({
          key: "sourcegridtype",
          data: "water"
        })
      } else {
        this.setData({
          gridtype: 'list'
        })
        //保存到本地
        wx.setStorage({
          key: "sourcegridtype",
          data: "list"
        })
      }
    },
    getPostsbyID: function (posttype, id) {
      let that = this;

      API.getPostsbyID(posttype, id).then(res => {

          that.setData({
            id: id,
            detail: res,
          })
          if (this.data.options.libid != '') {
            that.setData({
              islib: true,
              focus: true,
            })

          }
          // console.log('index.post')
          // console.log(this.data.detail)

          if (res.comments != 0) {
            this.getComments()
          }

        })
        .catch(err => {
          console.log(err)
        })
    },
    getComments: function () {
      API.getComments({
        id: this.data.id,
        page: this.data.page
      }).then(res => {
        let data = {}

        // data.isshowCnt = true
        // data.isshowLoad = false

        if (res.length < 10) {
          this.setData({
            hasnextpage: false,
            // showloadmore: false,
          })
        }


        var face = this.data.detail.face_emoji;
        var reg = /\[.+?\]/g;
        //var content = "[(1904)%#333333%书目:哈利·波特与火焰杯]";
        var regdt = /\[\((.+?)\]/g;

        data.posts = [].concat(this.data.posts, res.map(function (item) {
          var content = item.content;

          content = content.replace(regdt, function () {
            var regc = /\[\((.+?)\)/g;
            regc = regc.exec(content)[1].trim();
            var regc1 = /书目:(.+?)\]/g;
            regc1 = regc1.exec(content)[1].trim();
            // var regc2 = /\%(.+?)\%/g;
            if ((/\%(.+?)\%/g).exec(content)) {
              var regc2 = (/\%(.+?)\%/g).exec(content)[1].trim();
              // console.log(regc2)
            }

            if ((/\^(.+?)\^/g).exec(content)) {
              var regc3 = (/\^(.+?)\^/g).exec(content)[1].trim();
              // console.log(regc2)
              if(regc3 == 'library'){
                var regc3txt = '书籍'
              } else if(regc3 == 'films'){
                var regc3txt = '影视'
              } else if(regc3 == 'app'){
                var regc3txt = 'APP'
              } else if(regc3 == 'pro'){
                var regc3txt = '商品'
              }
            } else {
              var regc3 = 'library'
              var regc3txt = '书籍'
            }

            // console.log(content)

            var str = '<div><a class="talktolibrary" style="background-color:' + regc2 + '" href="/pages/detail/detail?id=' + regc + '&posttype='+ regc3 +'" bgcolor="" >来自' + regc3txt + '《' + regc1 + '》</a></div>'
            return str;
          });
          content = content.replace(reg, function (a, b) {
            return face[a];
          });

          item.content = content;
          return item;
        }))

        this.setData(data)
        // console.log(data.posts)
        // console.log('data.comments')
      })
    },

    //显示或隐藏功能菜单
    ShowEmoji: function () {
      this.setData({
        showemoji: true,
        showfixed: true,
        showfixbg: true,
      })
    },
    //点击非留言区隐藏功能菜单
    HideEmoji: function () {
      this.setData({
        showemoji: false,
        showfixed: true,
        showfixbg: true,
        focus: true,
      })
    },

    addComment: function (e) {
      // console.log(e)
      let args = {}
      let that = this
      if (that.data.islib) {
        var libmsg = '[(' + this.data.options.libid + ')%' + this.data.options.libcolor + '%^'+this.data.options.postcnttype+'^书目:' + this.data.options.libtit + ']'
      } else {
        var libmsg = ''
      }
      args.id = this.data.detail.id
      args.content = libmsg + this.data.talkKey
      args.parent = this.data.parent
      if (!this.data.user) {
        wx.showModal({
          title: '提示',
          content: '必须授权登录才可以评论',
          success: function (res) {
            if (res.confirm) {
              that.getProfile();
            }
          }
        })
      } else if (args.content.length === 0) {
        wx.showModal({
          title: '提示',
          content: '评论内容不能为空'
        })
      } else {
        API.addComment(args).then(res => {
            // console.log(res)
            if (res.status === 200) {
              this.setData({
                page: 1,
                talkKey: "",
                comments: [],
                placeholder: ""
              })
              setTimeout(function () {
                wx.showModal({
                  title: '温馨提示',
                  content: res.message
                })
              }, 900)
              this.getComments()
            } else if (res.status === 500) {
              wx.showModal({
                title: '提示',
                content: '评论失败，请稍后重试。'
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '必须授权登录才可以评论',
                success: function (res) {
                  if (res.confirm) {
                    that.getProfile();
                  }
                }
              })
            }
          })
          .catch(err => {
            console.log(err)
            wx.showModal({
              title: '提示',
              content: '评论失败，请稍后重试。'
            })
          })
      }
    },
    bindInputContent: function (e) {
      if (e.detail.value.length > 0) {
        this.setData({
          talkKey: e.detail.value,
          iscanpublish: true
        })
      } else {
        this.setData({
          iscanpublish: false
        })
      }
    },
    bindFocus: function (e) {
      this.setData({
        showemoji: false,
        showfixbg: true,
      })
    },
    bindBlur: function (e) {
      if (!this.data.showemoji) {
        this.setData({
          showfixed: false,
          showfixbg: false,
        })
      }
    },
    keyboardheightchange: function (e) {
      let that = this,
        keyboardheight = e.detail.height,
        keyboardduration = e.detail.duration;

      that.setData({
        keyboardheight: keyboardheight,
        keyboardduration: keyboardduration,
      });

      // console.log('keyboardheight:' + keyboardheight)
      // console.log('keyboardduration:'+keyboardduration)
    },
    getemojival: function (e) {
      if (this.data.talkKey) {
        this.setData({
          talkKey: this.data.talkKey + e.currentTarget.dataset.title,
          iscanpublish: true
        })
      } else {
        this.setData({
          talkKey: e.currentTarget.dataset.title,
          iscanpublish: true
        })
      }
    },
    onClear: function () {
      this.setData({
        talkKey: '',
        iscanpublish: false,
      })
    },
    HideFixedAll: function () {
      this.setData({
        showfixed: false,
        showfixbg: false,
        showemoji: false,
      })
    },
  }
})