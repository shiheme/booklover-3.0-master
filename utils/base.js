const API_HOST = 'https://www.hellobeebee.com' // 更换为你的网站域名, 需要有 https 协议
const RESTAPI = "booklover"; //要和后台设置的一致

const templates = {
  comments: ['dZxF51K9fu-15C7Lc9J3VsMRCW0KvzNSxzq17Pr4oh0', 'DKsx_XFxtJlWBOtDkrAvg_rKqhJhlFOO0oXsC1kb5Bk'], // 评论回复与审核模板ID
  subscribe: ['BKF6TEYwG-rrcuhqV9M3LidgCc8HmfW83FeMQEbbJBw'] // 资讯更新提醒模板ID
}

const custompostcats = {
  library_topic_cats: '116', //
    library_quot_cats:'120',
    library_act_cats:'51',
    library_faq_cats:'50',

    films_topic_cats:'117',
    films_quot_cats:'121',
    films_act_cats:'124',
    films_faq_cats:'64',

    app_topic_cats:'118',
    app_quot_cats:'',
    app_act_cats:'125',
    app_faq_cats:'122',

    pro_topic_cats:'119',
    pro_quot_cats:'',
    pro_act_cats:'126',
    pro_faq_cats:'123',
  }

const Auth = require('./auth')


const API = {}

API.getHost = function () {
  return API_HOST;
}


API.getRestAPI = function () {
  return RESTAPI;
}


API.template = function () {
  return templates;
}

API.custompostcats = function () {
  return custompostcats;
}

API.getUrlFileName = function (url, domain) {
  var filename = url.substring(url.lastIndexOf("/") + 1);

  if (filename == domain || filename == '') {
    filename = "index";
  } else {
    filename = filename;
  }

  return filename;
}

// API.getUrlPosttypeName = function(url, domain) {
//   var posttype = url.substring(url.indexOf("//", 1) + 2, url.lastIndexOf("/"));
//   if (posttype.indexOf("/") != -1) {
//     var split = posttype.split("/");
//     posttype = split[1];
//   } else {
//     posttype = 'posts';
//   }
//   return posttype;
// }

API.request = function (url, method = "GET", data = {}, args = {
  token: true
}) {

  return new Promise(function (resolve, reject) {

    url = API_HOST + '/' + RESTAPI + url;

    if (args.token) {
      const token = API.token();
      if (token) {
        if (url.indexOf("?") > 0) {
          url = url + '&access_token=' + token;
        } else {
          url = url + '?access_token=' + token;
        }
      } else {
        console.warn('[提示]', '部分数据需要授权，检测出当前访问用户未授权登录小程序');
      }
    }
    // console.log(url)
    // console.log(data)
    wx.request({
      url: url,
      data: data,
      method: method,
      success: function (res) {
        // console.log(res);
        if (res.statusCode == 200) {
          resolve(res.data);
        } else if (res.data.code === "rest_post_invalid_page_number") {
          wx.showToast({
            title: '没有更多内容',
            mask: false,
            duration: 1000
          });
        } else {
          wx.showToast({
            title: "请求数据失败",
            duration: 1500
          });
          // console.log(res.data.message);
          reject(res.data);
          Auth.logout()
        }
      },
      fail: function (err) {
        console.log('error', err);
        reject(err);
      }
    })
  });

}
//无论promise对象最后状态如何都会执行
// Promise.prototype.finally = function(callback) {
//   let P = this.constructor;
//   return this.then(
//     value => P.resolve(callback()).then(() => value),
//     reason => P.resolve(callback()).then(() => {
//       throw reason
//     })
//   );
// };

API.vrequest = function (url, method = "GET", data = {}, token) {
  return new Promise(function (resolve, reject) {
    url = API_HOST + '/' + RESTAPI + url
    //console.log(url)
    //console.log(data)
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: function (res) {
        // console.log(res);
        resolve(res);
      },
      fail: function (err) {
        console.log(err);
        reject(err);
      }
    })
  });
}

API.get = function (url, data = {}, args = {
  token: false
}) {
  return API.request(url, "GET", data, args);
}

API.post = function (url, data, args = {
  token: true
}) {
  return API.request(url, "POST", data, args);
}

API.vget = function (url, data, token) {
  return API.vrequest(url, "GET", data, token);
}

API.vpost = function (url, data, token) {
  return API.vrequest(url, "POST", data, token);
}

API.vdelete = function (url, data, token) {
  return API.vrequest(url, "DELETE", data, token);
}

API.getUser = function () {
  if (Auth.check()) {

    // console.log('API.getUser进行了check成功');
    return Auth.user();
  } else {
    // console.log('API.getUser进行了check失败');
    return false;
  }

}

API.login = function () {
  return new Promise(function (resolve, reject) {
    if (Auth.check()) {
      resolve(Auth.user());
    } else {
      Auth.login().then(data => {
        API.post('/mp/v1/user/openid', data, {
          token: false
        }).then(res => {
          API.storageUser(res);
          // console.log('API.login成功', res);
          resolve(res);
        }, err => {
          // console.log('API.login错误', err);
          reject(err);
        });
      }).catch(err => {
        // console.log('API.login失败', res);
        reject(err);

      })
    }
  });
}

API.logout = function () {
  let logout = Auth.logout();
  if (logout) {
    getApp().globalData.user = '';
    wx.removeStorageSync('user');
    wx.removeStorageSync('openid');
    wx.removeStorageSync('token');
    wx.removeStorageSync('expired_in');
    wx.reLaunch({
      url: '/pages/index/index'
    })
  } else {
    wx.showToast({
      title: '注销失败!',
      icon: 'warn',
      duration: 1000,
    })
  }
}

API.getUserInfo = function () {
  return new Promise(function (resolve, reject) {
    Auth.getUserInfo().then(data => {
        API.post('/mp/v1/user/login', data, {
          token: false
        }).then(res => {
          API.storageUser(res);
          // console.log('getUserInfo成功', res);
          resolve(res.user);
        }, err => {
          // console.log('getUserInfo失败', res);
          reject(err);
        });
      })
      .catch(err => {
        // console.log('getUserInfo失败败', err);
        reject(err);
      })
  });
}

API.token = function () {
  let token = Auth.token();
  let datetime = Date.now();
  if (token && datetime < wx.getStorageSync('expired_in')) {
    return token;
  } else {
    return false;
  }
}

API.storageUser = function (res) {
  getApp().globalData.user = res.user;
  wx.setStorageSync('user', res.user);
  wx.setStorageSync('openid', res.openid);
  if (res.access_token) {
    wx.setStorageSync('token', res.access_token);
    wx.setStorageSync('expired_in', Date.now() + parseInt(res.expired_in, 10) * 100000 - 60000);
  }
}

/**
 * 需要授权的接口调用
 * @param	{Function} fn
 * @return {Promise}
 */
API.guard = function (fn) {
  let that = this
  return function () {
    if (API.getUser()) {
      return fn.apply(that, arguments)
    } else {
      return API.getUserInfo().then(res => {
        wx.showLoading({
          title: '正在登录',
        })
        // console.log('登录成功', res);
        return fn.apply(that, arguments)
      }, err => {
        // console.log('用户拒绝了授权', err);
        return ''
      })
    }
  }
}


API.upload = function (url, files = "", token) {
  return new Promise(function (resolve, reject) {
    url = API_HOST + '/' + RESTAPI + url;
    if (!token) {
      wx.showModal({
        title: '温馨提示',
        content: 'JSON WEB TOKEN 密钥获取失败'
      })
    }
    //console.log(url)
    //console.log(files)
    wx.uploadFile({
      url: url,
      filePath: files,
      name: 'file',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        resolve(data)
      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}


module.exports = API