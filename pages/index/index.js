const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

Component({
  behaviors: [PCB],
  data: {
    isActive: true,
    isSearch: true,
  },
  attached: function (options) {},
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

      this.getIndexnavList();
      //判断用户是否第一次使用小程序
      var isFirst = wx.getStorageSync('isFirst');
      if (!isFirst) {
        that.setData({
          isFirst: true
        });
        wx.setStorageSync('isFirst', 'no')
      }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

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
    
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      let that = this;
      return {
        title: that.data.siteInfo.description + ' - ' + that.data.siteInfo.name,
        path: '/pages/index/index'
      }
    },

    getIndexnavList() {
      API.getIndexnav().then(res => {
  
        // 加载第一个分类的列表
        res[0].loaded = true;
  
        this.setData({
          indexnav: res
        });
      });
    },
  
    handleIndexnavChange(e) {
      const { current, data } = e.detail;
      // data是组件返回的，当前选中选项的数据，也就是对应 categoryList[current] 那个
  
      // 让 tab 和 swiper同步
      this.setData({
        current
      })
  
      // 如果切换到了还没加载的分类，加载这个分类
      if(!this.data.indexnav[current].loaded){
        this.setData({
          [`indexnav[${current}].loaded`] : true
        })
      }
    }

  }
})