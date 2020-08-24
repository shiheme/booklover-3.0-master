const PCB = require('../../utils/common');
const API = require('../../utils/api')
const app = getApp()

/* ------------------------- */
var canUseReachBottom = true; //触底函数控制变量
/* ------------------------- */

Component({
  behaviors: [PCB],
  data: {
    posts: [],
    page: 1,
    posttype: 'library',
    catstype: 'library_cats', //图书分类
    catsstate: 'library_state', //图书类型
    orderbyitem: [{
        value: 'date',
        name: '时间',
        checked: 'true'
      },
      {
        value: 'likes',
        name: '喜欢',
      },
      {
        value: 'views',
        name: '浏览'
      }
    ],
    library_cats: '', //留空为全部
    library_state: '', //留空为全部
    orderby: 'date',

    catstext: '',
    statetext: '',
    orderbytext: '时间',

    gridtype: 'list', //内容布局，在onload中设置，默认网格显示。water网格显示，list列表显示。布局会优先读取本地缓存


    isActive: true,
    isSearch: true,
    isTolist: true,
    opennavbarscroll: false,
  },
  attached: function () {

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
    bindUpdatepost(e) {
      var that = this;
      that.setData({
        selectchange: false,
        isshowLoad: true,
        page: 1,
        isLastPage: false,
        posts: [],
        catstxt: this.data.catstext,
        statetxt: this.data.statetext,
        orderbytxt: this.data.orderbytext,
      })
      this.bindHidepop();
      this.getPostList(that.data.posttype, {
        library_cats: that.data.library_cats,
        library_state: that.data.library_state,
        orderby: that.data.orderby,
        per_page: 12
      });
    },
    bindresetpost(e) {
      var that = this;
      that.setData({
        selectchange: false,
        isshowLoad: true,
        page: 1,
        isLastPage: false,
        posts: [],
        orderbyitem: [{
          value: 'date',
          name: '时间',
          checked: 'true'
        },
        {
          value: 'like',
          name: '喜欢',
        },
        {
          value: 'views',
          name: '浏览'
        }
      ],
        library_cats: '', 
        library_state: '', 
        orderby: 'date',
        catstxt: '',
        statetxt: '',
        orderbytxt: '时间',
      })
      this.bindHidepop();
      this.getCatstype(that.data.catstype, {
        per_page: 20
      });
      this.getPostList(that.data.posttype, {
        library_cats: that.data.library_cats,
        library_state: that.data.library_state,
        orderby: that.data.orderby,
        per_page: 12
      });
    },
    onLoad: function () {
      let that = this;
      this.getSiteInfo();
      this.getAdvert();
      this.bindUpdatepost();
      this.getCatstype(that.data.catstype, {
        per_page: 20
      });
      if (wx.getStorageSync('sourcegridtype')) {
        that.setData({
          gridtype: wx.getStorageSync('sourcegridtype')
        })
      } else {
        that.setData({
          gridtype: 'list'
        })
      }
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
      var that = this;
      that.setData({
        isshowError: false,
        isshowCnt: false,
        isshowLoad: true,
        page: 1,
        isLastPage: false,
        posts: []
      })
      this.getPostList(that.data.posttype, {
        library_cats: that.data.library_cats,
        library_state: that.data.library_state,
        orderby: that.data.orderby,
        per_page: 12
      });
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
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      var that = this;
      /* ------------------------- */
      if (!canUseReachBottom) return; //如果触底函数不可用，则不调用网络请求数据
      /* ------------------------- */
      this.setData({
        lasttip: true
      })
      if (!this.data.isLastPage) {
        this.getPostList(that.data.posttype, {
          library_cats: that.data.library_cats,
          library_state: that.data.library_state,
          orderby: that.data.orderby,
          page: that.data.page,
          per_page: 12
        })
      }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      return {
        title: this.data.siteInfo.description + ' - ' + this.data.siteInfo.name,
        path: '/pages/index/index'
      }
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
    getPostList: function (posttype, data) {
      let that = this;
      /* ------------------------- */
      canUseReachBottom = false; //触底函数关闭
      /* ------------------------- */

      wx.showNavigationBarLoading({
        complete() {
          wx.showNavigationBarLoading({
            complete() {
            }
          })
        }
      })

      API.getPostsList(posttype, data).then(res => {
          let args = {}
          if (res.length < 10) {
            this.setData({

              isLastPage: true,
            })
          }
          
            args.posts = [].concat(this.data.posts, res.map(function (item) {
              var strdate = item.date
              item.date = API.getDateDiff(strdate);
              return item;
            }))
            args.page = this.data.page + 1
            /* ------------------------- */
            canUseReachBottom = true; //有新数据，触底函数开启，为下次触底调用做准备
            /* ------------------------- */
          
          this.setData(args)
          this.setData({
            isshowCnt: true,
            isshowLoad: false
          })
          wx.hideNavigationBarLoading({
            complete() {
            }
          })
          wx.stopPullDownRefresh()
        })
        .catch(err => {
          console.log(err)
          if (this.data.page == 1) {
            this.setData({
              isshowError: true,
              isshowLoad: false,
              isshowCnt: false
            })
          } else {
            this.setData({
              lasttip: false
            })
          }
          wx.hideNavigationBarLoading({
            complete() {
            }
          })
        })
    },
    getAdvert: function () {
      API.indexAdsense().then(res => {
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
        library_cats: values.join(','),
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
        library_state: values.join(','),
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
    
  }
})