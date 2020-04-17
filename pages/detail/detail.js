// pages/detail/detail.js
/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const WxParse = require('../../wxParse/wxParse');
const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()
//let rewardedVideoAd = null

Component({
  behaviors: [PCB],
  properties: {
    // 接受页面参数
    posttype: String,
    id: Number,
  },
  data: {
    detail: '',

    isActive: false, //定义头部导航是否显示背景
    isGoback: true,
    pageStyle: app.globalData.pageStyle,
  },
  attached: function(options) {},
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
    onLoad: function(options) {
      let that = this
      this.setData({
        options: options
      })
      this.getPostsbyID(options.posttype, options.id)
      //this.getAdvert()
      console.log(options)
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
      let user = app.globalData.user
      if (!user) {
        user = '';
      }
      this.setData({
        user: user,
      })
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
        page: 1,
        detail: ''
      })
      this.getPostsbyID(this.data.options.posttype, this.data.options.id)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
      return {
        title: this.data.detail.title.rendered + ' - APP比比',
        path: '/pages/detail/detail?id=' + this.data.detail.id + '&isshare=1&posttype=' + this.data.posttype
      }
    },

    getPostsbyID: function(posttype, id) {
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
            videolook: openAded ? true : false
          })
          WxParse.wxParse('article', 'html', res.content.rendered, this, 20);
          WxParse.wxParse('videoadscnt', 'html', res.app_videoadscnt, this, 20);

        this.setData({
          isshowCnt: true,
          isshowLoad: false,
          triggered: false
        })
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

    getAdvert: function() {
      API.detailAdsense().then(res => {
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

    bindLikeTap: function(e) {
      console.log(e)
      let args = {}
      let detail = this.data.detail
      args.id = detail.id
      API.like(args).then(res => {
          //console.log(res)
          if (res.status === 200) {
            detail.islike = true
            this.setData({
              detail: detail,
            })
            wx.showToast({
              title: '谢谢点赞!',
              icon: 'success',
              duration: 900,
            })
          } else if (res.status === 202) {
            detail.islike = false
            this.setData({
              detail: detail,
            })
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

    subscribeMessage: function(template, status) {
      let args = {}
      args.openid = this.data.user.openId
      args.template = template
      args.status = status
      args.pages = getCurrentPages()[0].route
      args.platform = wx.getSystemInfoSync().platform
      args.program = 'WeChat'
      API.subscribeMessage(args).then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },

    bindSubscribe: function() {
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
        fail: function(res) {
          console.log(res)
        }
      })
    },

    getProfile: function(e) {
      console.log(e)
      wx.showLoading({
        title: '正在登录...',
      })
      API.getProfile().then(res => {
          console.log(res)
          this.setData({
            user: res
          })
          wx.hideLoading()
        })
        .catch(err => {
          console.log(err)
          wx.hideLoading()
        })
    },

    //阅读更多
    bindreadMore: function() {
      let that = this
      let platform = wx.getSystemInfoSync().platform
      console.log(platform)
     
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

    downloadPrefix: function() {
      let that = this
      let args = {}
      let qrcodePath = ''
      let prefixPath = ''
      let title = this.data.detail.title.rendered
      let excerpt = this.data.detail.excerpt.rendered
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
                        that.createPostPrefix(prefixPath, qrcodePath, title, excerpt);
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
    createPostPrefix: function(prefixPath, qrcodePath, title, excerpt) {
      //console.log(excerpt);
      wx.showLoading({
        title: "正在生成海报",
        mask: true,
      });
      let textTitle = title.replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, "").replace(/ /g, "")
      let textExcerpt = excerpt.replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, "").replace(/ /g, "")
      let context = wx.createCanvasContext('prefix');
      context.setFillStyle('#ffffff'); //填充背景色
      context.fillRect(0, 0, 600, 970);
      context.drawImage(prefixPath, 0, 0, 600, 400); //绘制首图
      context.drawImage(qrcodePath, 40, 720, 180, 180); //绘制二维码
      context.setFillStyle("#333333");
      context.setFontSize(32);
      context.setTextAlign('left');
      context.fillText("丸子小程序", 240, 780);
      context.setFillStyle("#666666");
      context.setFontSize(28);
      context.setTextAlign('left');
      context.fillText("又一个 WordPress 小程序", 240, 830);
      context.setFillStyle("#696969");
      context.setFontSize(24);
      context.setTextAlign('left');
      context.fillText("阅读详情,请长按识别二维码", 240, 880);
      context.setFillStyle("#000000");
      this.CanvasTextContent(context, textTitle, textExcerpt); //文章标题
      context.draw();
      //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'prefix',
          success: function(res) {
            wx.hideLoading();
            wx.previewImage({
              current: res.tempFilePath,
              urls: [res.tempFilePath]
            })
            console.log("海报图片路径：" + res.tempFilePath);
          },
          fail: function(res) {
            console.log(res);
            wx.hideLoading();
          }
        });
      }, 900);
    },

    CanvasTextContent: function(context, title, excerpt) {
      let textLength = title.replace(/[\u0391-\uFFE5]/g, "aa").length
      context.setFillStyle("#000000")
      if (textLength <= 17) {
        //14字以内绘制成一行，美观一点
        context.setFontSize(30)
        context.setTextAlign('left')
        context.fillText(title, 30, 460)
      } else {
        //题目字数很多的，只绘制前34个字（如果题目字数在15到18个字则也是一行，不怎么好看）
        context.setFontSize(30)
        context.setTextAlign('left')
        context.fillText(title.substring(0, 18), 30, 460)
        context.fillText(title.substring(18, 36), 30, 520)
      }
      context.setFillStyle("#666666")
      context.setFontSize(24)
      context.setTextAlign('left')
      context.fillText(excerpt.substring(0, 22), 35, 580)
      context.fillText(excerpt.substring(23, 44), 35, 624)
      context.fillText(excerpt.substring(45, 64), 35, 668)
      context.stroke()
      context.save()
    }
  }
})