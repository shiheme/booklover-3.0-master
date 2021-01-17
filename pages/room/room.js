const PCB = require('../../utils/common');
const API = require('../../utils/api');
const app = getApp()

Component({
  behaviors: [PCB],
  data: {

    id: 0,
    page: 1,
    hasnextpage: true,
    loading: false,
    per_page: 12,
    cats_posts: [],

    posttype: '',

    loading: false,
    ani:false,

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
     
      this.setData({
        siteinfo: app.globalData.siteinfo,
        title:'目录'
      })

      if(this.data.cnttype=="library"){
        this.getCatstype('library_cats', {
          per_page: 20,
          posttype: 'library',
        });
        
      } else if(this.data.cnttype=="films"){
        this.getCatstype('films_cats', {
          per_page: 20,
          posttype: 'films',
        });
      } else if(this.data.cnttype=="app"){
        this.getCatstype('app_cats', {
          per_page: 20,
          posttype: 'app',
        });
      }else if(this.data.cnttype=="pro"){
        this.getCatstype('pro_cats', {
          per_page: 20,
          posttype: 'pro',
        });
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
        title: this.data.siteinfo.description + ' - ' + this.data.siteinfo.name,
        path: '/pages/index/index'
      }
    },

    getCatstype: function (cats, data) {
      let that = this;
      let str = [];
      let cats_posts = [];
      API.getCategories(cats, data).then(res => {
          
          for(let i = 0, len = res.length; i < len; i += 2) {
            str.push(res.slice(i, i + 2))
          }
          for(let i = 0; i < str.length; i++) {
            let obj = {}
            obj['list'] = str[i]
            cats_posts.push(obj)
          }
          this.setData({
            cats_posts: cats_posts
          })
          console.log(cats_posts)
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
        })
    },

  },

  
  
})