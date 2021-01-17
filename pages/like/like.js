// pages/list/list.js
const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  properties: {
    // 接受页面参数
    posttype: String,
    title: {
      type: String,
      value: ''
    },
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

    gridtype: 'list', //内容布局，在onload中设置，默认网格显示。water网格显示，list列表显示。布局会优先读取本地缓存
    ani: true,

    isActive: true, //定义头部导航是否显示背景
    isGoback: false,

  },
  attached: function (options) {

  },
  pageLifetimes: {
    show: function () {
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },

  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // this.getSiteInfo();
      // app.loaclCallBack = res => {

        this.getLikePosts({
          post_type: this.data.cnttype,
        });
        this.setData({
          siteinfo: app.globalData.siteinfo,
          posttype:this.data.cnttype,
          title: '我点赞的'
        })
      // }
      console.log(this.data.siteinfo)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      let that = this;
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
      
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      return {
        title: this.data.siteinfo.description + ' - ' + this.data.siteinfo.name,
        path: '/pages/index/index'
      }
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

   

    
  }
})