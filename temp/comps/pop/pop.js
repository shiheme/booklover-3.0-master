// index/component/item.js

const PCB = require('../../../utils/common');
const API = require('../../../utils/api')
var app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  behaviors: [PCB],
  properties: {
    posttype: {
      type: String
    },
    poptype: {
      type: String
    },
    showpop: {
      type: Boolean,
      value: true
    },
    showcolltip: {
      type: Boolean,
      value: true
    },
    height: {
      type: Number
    },
    state: {
      type: Array,
      value: []
    },
    category: {
      type: Array,
      value: []
    },
    item: {
      type: Array,
      value: []
    },
    detail: {
      type: Array,
      value: []
    },
    user: {
      type: Array,
      value: []
    },
    siteinfo:{
      type:Array
    },
    isadmin:{
      type:Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    catsid: '',
    stateid: '',
    catstxt: '',
    statetxt: '',

    rating: 0,
    parent:0,
    rating_none: 5,

    page: 1,
    comments: []
  },
  /**
   * 组件的方法列表
   */
  ready(options) {
    // console.log('cnttype',this.data.cnttype)
    if (this.data.poptype == 'libraryrate') {
      this.getComments();
    }
  },
  methods: {
    onShow: function() {
      let that = this;
      let user = app.globalData.user
      if (!user) {
        user = '';
      }
      this.setData({
        user: user,
      })

      console.log('user', this.data.user)
      
    },
    onReachBottom: function () {
      // if (this.data.hasnextpage) {
      //   this.setData({
      //     page: this.data.page + 1
      //   });
      //   this.getComments();
      // }
    },
    
    bindpengyouquan: function (e) {
      this.setData({
        pengyouquantip: true
      })
    },
    bindUpdatepost: function (e) {
      var myEventDetail = {
        selectchange: false,
        isreset: false,
        page: 1,
        hasnextpage: true,
        posts: [],
        catstxt: this.data.catstext,
        statetxt: this.data.statetext,
        catsid: this.data.catsid,
        stateid: this.data.stateid,
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
      this.bindHidepop();
    },
    bindResetpost(e) {
      var myEventDetail = {
        selectchange: false,
        isreset: true,
        page: 1,
        hasnextpage: true,
        posts: [],
        catstxt: '',
        statetxt: '',
        catsid: '',
        stateid: '',
      }
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
      this.bindHidepop();
    },
    checkcategoryChange(e) {
      const category = this.data.category;
      const values = e.detail.value;
      let text = '';
      for (let i = 0, lenI = category.length; i < lenI; ++i) {
        category[i].checked = false
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (category[i].id == values[j]) {
            category[i].checked = true
            break
          }
        }
        if (values.length > 1) {
          text = '多种分类'
        } else if (values.length = 1) {
          if (category[i].id == values[0]) {
            text = category[i].name
          }
        } else {
          text = ''
        }
      }
      this.setData({
        category,
        catsid: values.join(','),
        selectchange: true,
        catstext: text
      })
    },
    checkstateChange(e) {
      const state = this.data.state;
      const values = e.detail.value;
      let text = '';
      for (let i = 0, lenI = state.length; i < lenI; ++i) {
        state[i].checked = false
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (state[i].id == values[j]) {
            state[i].checked = true
            break
          }
        }
        if (values.length > 1) {
          text = '多种类型'
        } else if (values.length = 1) {
          if (state[i].id == values[0]) {
            text = state[i].name
          }
        } else {
          text = ''
        }
      }
      this.setData({
        state,
        stateid: values.join(','),
        selectchange: true,
        statetext: text
      })
    },
    radioorderChange(e) {
      const orderbyitem = this.data.orderbyitem
      const values = e.detail.value
      let text = '';
      for (let i = 0, len = orderbyitem.length; i < len; ++i) {
        orderbyitem[i].checked = orderbyitem[i].value == values

        if (orderbyitem[i].value == values) {
          text = orderbyitem[i].name
        }
      }
      this.setData({
        orderbyitem,
        orderby: values,
        selectchange: true,
        orderbytext: text
      })

      // console.log(text)
      // console.log(orderbyitem)
    },

    getComments: function () {
      console.log('平')
      API.getComments({
        id: this.data.detail[0].id,
        page: this.data.page,
        per_page:20
      }).then(res => {
        let data = {}
        console.log(res)
        console.log('平行')
        if (res.length < 10) {
          this.setData({
            hasnextpage: false,
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
        // console.log(data.comments)
        // console.log('data.comments')
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
        iscanpublish: true,
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

    addComment: function (e) {
      // console.log(e)
      let args = {}
      let that = this
      args.id = this.data.detail[0].id
      args.content = '这是一条评星('+this.data.rating+')'
      args.parent = this.data.parent
      args.rating = this.data.rating
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
      } else if (args.rating == 0) {
        wx.showModal({
          title: '提示',
          content: ''
        })
      } else {
        API.addComment(args).then(res => {
            console.log(res)
            if (res.status === 200) {
              this.setData({
                page: 1,
                content: "",
                comments: [],
                rating: 0,
                parent:0,
                rating_none: 5,
                ratingtip: '',
                iscanpublish: false
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
              content: '评论失败，请稍后重试吧。'
            })
          })
      }
    },

    downloadPrefix: function () {
      let that = this
      let args = {}
      let posttype= this.data.detail[0].type
      let apptype= this.data.detail[0].app_type?this.data.detail[0].app_type:''
      let qrcodePath = ''
      let prefixPath = ''
      let title = this.data.detail[0].title.rendered
      let excerpt = this.data.detail[0].excerpt.rendered
      let foreground = this.data.detail[0].book_foreground
      let name = ''
      let description = ''
      API.getSiteInfo().then(res => {
        name = res.name
        description = res.description
      })
      .catch(err => {
        console.log(err)
      })
      args.id = this.data.detail[0].id
      args.cnttype = this.data.cnttype
      console.log(this.data.detail[0].id)
      console.log(this.data.cnttype)
      API.getCodeImg(args).then(res => {
        wx.showLoading({
          title: "准备生成海报...",
          mask: true,
        });
        if (res.status === 200) {
          console.log(res)
          const downloadTaskqrCode = wx.downloadFile({
            url: res.qrcode,
            success: qrcode => {
              if (qrcode.statusCode === 200) {
                qrcodePath = qrcode.tempFilePath;
                console.log("二维码图片本地位置：" + qrcode.tempFilePath);
                // if (qrcodePath) {
                //   that.createPostPrefix(qrcodePath, title, excerpt);
                // }
                const downloadTaskCoverPrefix = wx.downloadFile({
                  url: this.data.detail[0].meta.thumbnail,
                  success: response => {
                    if (response.statusCode === 200) {
                      prefixPath = response.tempFilePath;
                      console.log("文章图片本地位置：" + response.tempFilePath);
                      if (prefixPath && qrcodePath) {
                        that.createPostPrefix(prefixPath, qrcodePath, title, excerpt, foreground, name, description, posttype, apptype);
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
    createPostPrefix: function (prefixPath, qrcodePath, title, excerpt, foreground, name, description, posttype, apptype) {
      //console.log(excerpt);
      wx.showLoading({
        title: "正在生成海报",
        mask: true,
      });
      let textTitle = title.replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, " ").replace(/ /g, " ")
      let textExcerpt = excerpt.replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, " ").replace(/ /g, " ")
      let context = wx.createCanvasContext('prefix');
      context.setFillStyle('#ffffff'); //填充背景色
      context.fillRect(0, 0, 600, 1000);
      context.setFillStyle(foreground); //填充背景色
      context.fillRect(10, 10, 580, 680);
      context.drawImage(qrcodePath, 380, 750, 180, 180); //绘制二维码
      context.setFillStyle("#333333");
      context.setFontSize(28);
      context.setTextAlign('left');
      context.fillText(name, 30, 930);
      context.setFillStyle("#666666");
      context.setFontSize(22);
      context.setTextAlign('left');
      context.fillText(description, 30, 960);
      context.setFillStyle("#696969");
      context.setFontSize(18);
      context.setTextAlign('left');
      context.fillText("长按识别二维码", 400, 960);
      context.setFillStyle("#000000");
      context.rect(10, 10, 580, 980)
      context.setStrokeStyle(foreground)
      context.stroke()
      this.CanvasTextContent(context, textTitle, textExcerpt); //文章标题

      if (posttype != 'app') {
        let bg_x = 170
      let bg_y = 120
      let bg_w = 260
      let bg_h = 360
      let bg_r = 5
      context.save()
      context.beginPath()
      context.arc(bg_x + bg_r, bg_y + bg_r, bg_r, Math.PI, Math.PI * 1.5)
      context.arc(bg_x + bg_w - bg_r, bg_y + bg_r, bg_r, Math.PI * 1.5, Math.PI * 2)
      context.arc(bg_x + bg_w - bg_r, bg_y + bg_h - bg_r, bg_r, 0, Math.PI * 0.5)
      context.arc(bg_x + bg_r, bg_y + bg_h - bg_r, bg_r, Math.PI * 0.5, Math.PI)
      context.clip()
      context.drawImage(prefixPath, bg_x, bg_y, bg_w, bg_h);
        } else if(posttype == 'app'&& apptype != 'wxapp') {
        let bg_x = 170
        let bg_y = 220
        let bg_w = 260
        let bg_h = 260
        let bg_r = 58
        context.save()
        context.beginPath()
        context.arc(bg_x + bg_r, bg_y + bg_r, bg_r, Math.PI, Math.PI*1.5)
        context.arc(bg_x + bg_w - bg_r, bg_y + bg_r, bg_r, Math.PI * 1.5, Math.PI * 2)
        context.arc(bg_x + bg_w - bg_r, bg_y + bg_h - bg_r, bg_r, 0, Math.PI * 0.5)
        context.arc(bg_x + bg_r, bg_y + bg_h - bg_r, bg_r, Math.PI * 0.5, Math.PI)
        context.clip()
        context.drawImage(prefixPath, bg_x, bg_y, bg_w, bg_h);
      } else if(posttype == 'app'&& apptype == 'wxapp') {
        let bg_x = 170
        let bg_y = 220
        let bg_w = 260
        let bg_h = 260
        let bg_r = 130
        context.save()
        context.beginPath()
        context.arc(bg_x + bg_r, bg_y + bg_r, bg_r, Math.PI, Math.PI*1.5)
        context.arc(bg_x + bg_w - bg_r, bg_y + bg_r, bg_r, Math.PI * 1.5, Math.PI * 2)
        context.arc(bg_x + bg_w - bg_r, bg_y + bg_h - bg_r, bg_r, 0, Math.PI * 0.5)
        context.arc(bg_x + bg_r, bg_y + bg_h - bg_r, bg_r, Math.PI * 0.5, Math.PI)
        context.clip()
        context.drawImage(prefixPath, bg_x, bg_y, bg_w, bg_h);
      } 

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

      context.setFillStyle("#ffffff")
      context.setFontSize(40)
      context.setTextAlign('center')
      context.fillText(title, 300, 550)
      context.setFillStyle("#ffffff")
      context.setFontSize(24)
      context.setTextAlign('center')
      context.fillText(excerpt.substring(0, 22), 300, 600)
      context.fillText(excerpt.substring(23, 44), 300, 630)
      context.fillText(excerpt.substring(45, 64), 300, 660)
      context.stroke()
      context.save()
    },

  }
})