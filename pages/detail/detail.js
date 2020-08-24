// pages/detail/detail.js
const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

let isFocusing = false
//let rewardedVideoAd = null

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
    post:[],
    detailshow:[],

    page:1,
    textNum: 0,
    comments: [],
    placeholder: '输入评论',

    rating: 0,
    rating_none: 5,
    showtxvideo:false,

    // current: 0,
    // hidecontent:false,
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
      
      console.log(this.data.options)
      // console.log('option')
      if(this.data.scene == 1011 || this.data.scene == 1047 || this.data.scene == 1124) {
        this.setData({
          showOfficial: true
        })
      }
      this.getSiteInfo();
      if (options.posttype) {
        this.getPostsbyID(options.posttype, options.id)
        // this.getRelatePosts(options.posttype, options.id)
        this.getRelatePosts({
          post_type:options.posttype,
          id:options.id,
          per_page:6
        })
      } else {
        this.getPostsbyID('posts', options.id)
      }
      this.getAdvert()
      

      //this.getAdvert()
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
      let user = API.login()
      if (!user) {
        user = '';
      }
      this.setData({
        user: user,
      })
    },

    //自定义组件中通信
    setpost: function(e) {
      let that = this;
      // console.log(e)
      that.setData({
        post: e.detail.item,
        audKey: e.detail.audKey
      })
//       console.log(that.data.post)
// console.log('post')
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
      // console.log(scrolltop);
      // console.log('height:'+e.detail.scrollHeight);
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if (!this.data.isLastPage) {
        this.getComments();
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      return {
        title: this.data.detail.title.rendered + ' - ' + this.data.siteInfo.name,
        path: '/pages/detail/detail?id=' + this.data.detail.id + '&isshare=1&posttype=' + this.data.posttype
      }
    },
    getSiteInfo: function () {
      API.getSiteInfo().then(res => {
          this.setData({
            siteInfo: res
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    getPostsbyID: function (posttype, id) {
      let that = this;
      wx.showNavigationBarLoading({
        complete() {
          wx.showNavigationBarLoading({
            complete() {
              //console.log('showNavigationBarLoading')
            }
          })
        }
      })

      API.getPostsbyID(posttype, id).then(res => {

          let openAded = (res.app_openvideoads && res.app_openvideoads[0] == '1') ? false : true;
          that.setData({
            id: id,
            detail: res,
            post: [res],
            
            detailcontent: API.removeHTML(res.content.rendered),
            post_likes: res.post_likes.map(function (item) {
              var strdate = item.comment_date
              item.comment_date = API.getDateDiff(strdate);
              return item;
            }),
            // isDuringDate: API.isDuringDate(res.app_starttime, res.app_endtime),
            
            islike: res.islike,
            likes: res.likes,
            videolook: openAded ? true : false
          })
          // console.log(this.data.post)
          // console.log('index.post')
          // console.log(this.data.detail)
          // console.log('index.detail')
          if(res.book_birth){
            this.setData({
              book_birth_age : API.getAge(res.book_birth),
              book_birth : API.getBirth(res.book_birth),
            })
          }
          if(res.book_detailshow) {
            var detailshow = [].concat(this.data.detailshow, res.book_detailshow.map(function (item) {
              // var strdate = item[0]
              // var excerpt = item.excerpt.rendered
              // item.filed = item;
              // item.name = item;
              item = API.cutspit(item);
              item[0].value = res[[item[0].field]];
              // item.field = item[0][0];
              // item.name = item[1];
              // item.value = res[[item.field]];
              return item;
            }))
            this.setData({
              detailshow : detailshow,
            })
            // console.log(this.data.detailshow)
            // console.log('detailshow')
          }
          if(res.rating_avg !=null){
            this.setData({
              detailrating_avg: API.mathRoundRate(res.rating_avg.avg),
            })
          }

          this.setData({
            isshowCnt: true,
            isshowLoad: false,
            showzcm: true
          })

          if (res.comments != 0) {
            this.getComments()
          }

          

          // wx.hideLoading();
          wx.hideNavigationBarLoading({
            complete() {
              //console.log('hideNavigationBarLoading')
            }
          })

        })
        .catch(err => {
          console.log(err)
          this.setData({
            isshowError: true,
            isshowLoad: false,
            isshowCnt: false,
            triggered: false
          })
        })
    },


    getRelatePosts: function(args) {
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

    getAdvert: function () {
      API.detailAdsense().then(res => {
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

    bindFavTap: function (e) {
      // console.log(e)
      let args = {}
      let detail = this.data.detail
      args.id = detail.id
      API.fav(args).then(res => {
          //console.log(res)
          if (res.status === 200) {
            detail.isfav = true
            this.setData({
              detail: detail
            })
            wx.showToast({
              title: '加入收藏!',
              icon: 'success',
              duration: 900,
            })
          } else if (res.status === 202) {
            detail.isfav = false
            this.setData({
              detail: detail
            })
            wx.showToast({
              title: '取消收藏!',
              icon: 'success',
              duration: 900,
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '数据出错, 建议清除缓存重新尝试',
              success: response => {
                wx.removeStorageSync('user')
                wx.removeStorageSync('token')
                wx.removeStorageSync('expired_in')
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    bindLikeTap: function(e) {
      // console.log(e)
      let args = {}
      let detail = this.data.detail
      args.id = detail.id
      API.like(args).then(res => {
          // console.log(res)
          if (res.status === 200) {
            if (this.data.options.posttype) {
              API.getPostsbyID(this.data.options.posttype, this.data.options.id).then(res => {
                this.setData({
                  islike: true,
                  post_likes: res.post_likes,
                  likes: res.likes,
                })
              })
            } else {
              API.getPostsbyID('posts', this.data.options.id).then(res => {
                this.setData({
                  islike: true,
                  post_likes: res.post_likes,
                  likes: res.likes,
                })
              })
            }
            wx.showToast({
              title: '谢谢点赞!',
              icon: 'success',
              duration: 900,
            })
          } else if (res.status === 202) {
            // detail.islike = false
            if (this.data.options.posttype) {
              API.getPostsbyID(this.data.options.posttype, this.data.options.id).then(res => {
                this.setData({
                  islike: false,
                  post_likes: res.post_likes,
                  likes: res.likes,
                })
              })
            } else {
              API.getPostsbyID('posts', this.data.options.id).then(res => {
                this.setData({
                  islike: false,
                  post_likes: res.post_likes,
                  likes: res.likes,
                })
              })
            }
            wx.showToast({
              title: '取消点赞!',
              icon: 'success',
              duration: 900,
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '数据出错, 建议清除缓存重新尝试',
              success: response => {
                wx.removeStorageSync('user')
                wx.removeStorageSync('token')
                wx.removeStorageSync('expired_in')
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
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
      let templates = API.template().comments
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

    getProfile: function (e) {
      console.log(e);
      API.getProfile().then(res => {
          // console.log(res)
          this.setData({
            user: res
          })
          wx.hideLoading()
          if (!res) {
            wx.showToast({
              title: '拒绝授权了',
              icon: 'none',
              image: '',
              duration: 2000,
            })
          } else {
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000,
            })

            API.getPostsbyID('posts', this.data.options.id).then(res => {
              this.setData({
                detail: res,
                isDuringDate: API.isDuringDate(res.app_starttime, res.app_endtime),
                islike: res.islike,
                post_likes: res.post_likes.map(function (item) {
                  var strdate = item.comment_date
                  item.comment_date = API.getDateDiff(strdate);
                  return item;
                }),
                likes: res.likes,
              })
            })

          }
        })
        .catch(err => {
          wx.hideLoading()
        })
    },

    //阅读更多
    bindreadMore: function () {
      let that = this
      let platform = wx.getSystemInfoSync().platform
      // console.log(platform)

      that.setData({
        videolook: true
      })

      // if (platform == 'devtools') {
      //   wx.showToast({
      //     title: "开发工具无法显示激励视频",
      //     icon: "none",
      //     duration: 2000
      //   });
      //   that.setData({
      //     videolook: true
      //   })
      // } else {
      //   rewardedVideoAd.show()
      //     .catch(() => {
      //       rewardedVideoAd.load()
      //         .then(() => rewardedVideoAd.show())
      //         .catch(err => {
      //           console.log('激励视频 广告显示失败');
      //           that.setData({
      //             videolook: true
      //           })
      //         })
      //     })
      // }

    },

    downloadPrefix: function () {
      let that = this
      let args = {}
      let qrcodePath = ''
      let prefixPath = ''
      let title = this.data.detail.title.rendered + '-' + this.data.detail.app_shop[0].shop_name
      let excerpt = this.data.detail.app_shop[0].shop_ads
      let tel = this.data.detail.app_shop[0].shop_tel
      let durtime = this.data.detail.app_starttime + '至' + this.data.detail.app_endtime
      args.id = this.data.detail.id
      API.getCodeImg(args).then(res => {
        if (res.status === 200) {
          const downloadTaskqrCode = wx.downloadFile({
            url: res.qrcode,
            success: qrcode => {
              if (qrcode.statusCode === 200) {
                qrcodePath = qrcode.tempFilePath;
                console.log("二维码图片本地位置：" + qrcode.tempFilePath);
                const downloadTaskCoverPrefix = wx.downloadFile({
                  url: res.cover,
                  success: response => {
                    if (response.statusCode === 200) {
                      prefixPath = response.tempFilePath;
                      console.log("文章图片本地位置：" + response.tempFilePath);
                      if (prefixPath && qrcodePath) {
                        that.createPostPrefix(prefixPath, qrcodePath, title, excerpt, tel, durtime);
                      }
                    } else {
                      wx.hideLoading();
                      wx.showToast({
                        title: "下载封面失败",
                        mask: true,
                        duration: 2000
                      });
                    }
                  }
                });
                downloadTaskCoverPrefix.onProgressUpdate((res) => {
                  wx.showLoading({
                    title: "正在下载封面...",
                    mask: true,
                  });
                  console.log('下载下载封面进度：' + res.progress)
                })
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: "下载二维码失败",
                  mask: true,
                  duration: 2000
                });
              }
            }
          })
          downloadTaskqrCode.onProgressUpdate((res) => {
            wx.showLoading({
              title: "正在下载二维码...",
              mask: true,
            });
            console.log('下载二维码进度', res.progress)
          })
        }
      })
    },
    //将canvas转换为图片保存到本地，然后将路径传给image图片的src
    createPostPrefix: function (prefixPath, qrcodePath, title, excerpt, tel, durtime) {
      //console.log(excerpt);
      wx.showLoading({
        title: "正在生成海报",
        mask: true,
      });
      let textTitle = title.replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, "").replace(/ /g, "")
      let textExcerpt = excerpt.replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, "").replace(/ /g, "")
      let context = wx.createCanvasContext('prefix');
      context.setFillStyle('#ffffff'); //填充背景色
      context.fillRect(0, 0, 600, 1000);
      context.drawImage(prefixPath, 10, 10, 580, 896); //绘制首图
      context.setFillStyle('rgba(255,255,255,.8)')
      context.fillRect(10, 410, 580, 200)
      context.setFillStyle('rgba(255,255,255,1)')
      context.fillRect(10, 610, 580, 380)
      context.drawImage(qrcodePath, 380, 750, 180, 180); //绘制二维码
      context.setFillStyle("#696969");
      context.setFontSize(22);
      context.setTextAlign('left');
      context.fillText("来自小程序的同城福利分享", 30, 450);

      context.setFillStyle("#696969");
      context.setFontSize(22);
      context.setTextAlign('left');
      context.fillText("活动时间：", 30, 650);

      context.setFillStyle("#696969");
      context.setFontSize(24)
      context.setTextAlign('left')
      context.fillText(tel, 30, 735)
      context.setFillStyle("#000000");
      context.setFontSize(30)
      context.setTextAlign('left')
      context.fillText(durtime, 30, 690)
      context.setFillStyle("#333333");
      context.setFontSize(28);
      context.setTextAlign('left');
      context.fillText(this.data.siteInfo.name, 30, 930);
      context.setFillStyle("#666666");
      context.setFontSize(22);
      context.setTextAlign('left');
      context.fillText(this.data.siteInfo.description, 30, 960);
      context.setFillStyle("#696969");
      context.setFontSize(18);
      context.setTextAlign('left');
      context.fillText("长按识别二维码", 400, 960);
      context.setFillStyle("#000000");
      context.rect(10, 10, 580, 980)
      context.setStrokeStyle('#eeeeee')
      context.stroke()

      this.CanvasTextContent(context, textTitle, textExcerpt); //文章标题
      context.draw();
      //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'prefix',
          success: function (res) {
            wx.hideLoading();
            wx.previewImage({
              current: res.tempFilePath,
              urls: [res.tempFilePath]
            })
            console.log("海报图片路径：" + res.tempFilePath);
          },
          fail: function (res) {
            console.log(res);
            wx.hideLoading();
          }
        });
      }, 900);
    },

    CanvasTextContent: function (context, title, excerpt) {
      let textLength = title.replace(/[\u0391-\uFFE5]/g, "aa").length
      context.setFillStyle("#000000")
      if (textLength <= 12) {
        //14字以内绘制成一行，美观一点
        context.setFontSize(40)
        context.setTextAlign('left')
        context.fillText(title, 30, 500)
      } else {
        //题目字数很多的，只绘制前34个字（如果题目字数在15到18个字则也是一行，不怎么好看）
        context.setFontSize(40)
        context.setTextAlign('left')
        context.fillText(title.substring(0, 12), 30, 500)
        context.fillText(title.substring(12, 24), 30, 550)
        context.fillText(title.substring(24, 36), 30, 600)
      }
      context.setFillStyle("#666666")
      context.setFontSize(24)
      context.setTextAlign('left')
      context.fillText(excerpt.substring(0, 22), 30, 770)
      context.fillText(excerpt.substring(22, 44), 30, 814)
      context.fillText(excerpt.substring(44, 64), 30, 858)
      context.stroke()
      context.save()
    },
    touchmove: function (e) {
      this.setData({
        isTrans: true
      })
    },
    touchend: function (e) {
      this.setData({
        isTrans: false
      })
    },
    touchcancel: function (e) {
      this.setData({
        isTrans: false
      })
    },
    closeFloatads: function (e) {
      this.setData({
        closezcm: true
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
    bindBack: function () {
      wx.navigateBack()
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
        url: '/pages/detail/detail?id=' + id + '&posttype=' + posttype + '&cnttype='+ cnttype,
      })
    },

    getComments: function() {
      API.getComments({
        id: this.data.options.id,
        page: this.data.page
      }).then(res => {
        let data = {}
        if (res.length < 10) {
          this.setData({
            isLastPage: true,
            loadtext: '到底啦',
            showloadmore: false
          })
        }
        if (this.data.isBottom) {
          data.comments = [].concat(this.data.comments, res)
          data.page = this.data.page + 1
        } else {
          data.comments = [].concat(this.data.comments, res)
          data.page = this.data.page + 1
        }
        this.setData(data)
        console.log(data.comments)
          console.log('data.comments')
      })
    },

    //评论打分
    userrating: function (e) {
      var in_xin = e.currentTarget.dataset.in;
      var rating;
      if (in_xin === 'use_sc2') {
        rating = Number(e.currentTarget.id);
      } else {
        rating = Number(e.currentTarget.id) + this.data.rating;
      }
      this.setData({
        rating: rating,
        rating_none: 5 - rating
      })
      if (rating == 1) {
        this.setData({
          ratingtip: '很差'
        })
      } else if (rating == 2) {
        this.setData({
          ratingtip: '较差'
        })
      } else if (rating == 3) {
        this.setData({
          ratingtip: '还行'
        })
      } else if (rating == 4) {
        this.setData({
          ratingtip: '推荐'
        })
      } else if (rating == 5) {
        this.setData({
          ratingtip: '力荐'
        })
      } else {
        this.setData({
          ratingtip: ''
        })
      }
    },

    addComment: function(e) {
      console.log(e)
      let args = {}
      let that = this
      args.id = this.data.detail.id
      args.content = this.data.content
      args.parent = this.data.parent
      args.rating = this.data.rating
      if (!this.data.user) {
        wx.showModal({
          title: '提示',
          content: '必须授权登录才可以评论',
          success: function(res) {
            if (res.confirm) {
              that.getProfile();
            }
          }
        })
      } else if (args.rating == 0 && args.content.length === 0) {
        wx.showModal({
          title: '提示',
          content: '请打分，且评论内容不能为空'
        })
      } else if (args.rating == 0) {
        wx.showModal({
          title: '提示',
          content: '请打分'
        })
      } else if (args.content.length === 0) {
        wx.showModal({
          title: '提示',
          content: '评论内容不能为空'
        })
      } else {
        API.addComment(args).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.setData({
              page: 1,
              showTextarea: false,
              content: "",
              comments: [],
              rating: 0,
              placeholder: "",
              isFocus: false
            })
            setTimeout(function() {
              wx.showModal({
                title: '温馨提示',
                content: res.message
              })
            }, 900)
            if (!this.data.isComments) {
              this.setData({
                isComments: true,
                placeholder: ''
              })
            }
            this.bindSubscribe()
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
              success: function(res) {
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
  
    // replyComment: function(e) {
    //   console.log(e)
    //   isFocusing = true
    //   let parent = e.currentTarget.dataset.parent
    //   let reply = e.currentTarget.dataset.reply
    //   this.setData({
    //     isFocus: true,
    //     isReply: true,
    //     parent: parent,
    //     placeholder: " 回复 " + reply + ":"
    //   })
    // },

    // onRepleyFocus: function(e) {
    //   // isFocusing = false
    //   // console.log('onRepleyFocus', isFocusing)
    //   // if (!this.data.isFocus) {
    //   //   this.setData({
    //   //     isFocus: true
    //   //   })
    //   // }
    //   const text = e.detail.value.trim();
    //     if (text === '') {
    //       that.setData({
    //         parent: "0",
    //         placeholder: "评论...",
    //         commentdate: ""
    //       });
    //     }
    // },
  
    // onReplyBlur: function(e) {
    //   var that = this;
    //   // if (!that.data.focus) {
    //     const text = e.detail.value.trim();
    //     if (text === '') {
    //       that.setData({
    //         parent: "0",
    //         placeholder: "填写评论",
    //         commentdate: ""
    //       });
    //     }
    //   // } 
    //   // console.log(isFocusing)
    // },
  
    bindInputContent: function(e) {
      if (e.detail.value.length > 0) {
        this.setData({
          content: e.detail.value,
          textNum: e.detail.value.length,
          iscanpublish: true
        })
      } else {
        this.setData({
          iscanpublish: false
        })
      }
    },
  
    tapcomment: function(e) {
      let that = this;
      let id = e.currentTarget.id;
      if (id) {
        this.setData({
          id: id,
          showTextarea: true
        })
      } else {
        this.setData({
          showTextarea: true
        })
      }
      setTimeout(function() {
        that.setData({
          focus: true
        });
      }, 100);
    },
  
    closeCommentary: function() {
      this.setData({
        showTextarea: false
      });
    },

    showTxvideo: function() {
      this.setData({
        showtxvideo: true
      });
    },

    hideTxvideo: function() {
      this.setData({
        showtxvideo: false
      });
    },

    keyboardheightchange: function(e) {
      let that =this,
      keyboardheight=e.detail.height,
      keyboardduration=e.detail.duration;

      that.setData({
        keyboardheight: keyboardheight,
        keyboardduration:keyboardduration,
      });

      // console.log('keyboardheight:'+keyboardheight)
      // console.log('keyboardduration:'+keyboardduration)
    },

  }
})