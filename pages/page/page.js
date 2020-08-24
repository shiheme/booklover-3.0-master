const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  data: {
    posts: [],
    page: 1,
    posttype: 'posts',
    catstype: 'categories',

    isActive: false, //定义头部导航是否显示背景
    isGoback: true,
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
    onLoad: function () {
      let that = this;
      this.getSiteInfo();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

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
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    onShareAppMessage: function () {

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
  }
})