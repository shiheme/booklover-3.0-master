const Auth = {}

/**
 * 获取当前登陆用户的openid
 * @return {string}
 */
Auth.openid = function () {
  const user = Auth.user()
  if (user && user.openid) {
    return user.openid
  } else {
    return ''
  }
}

/**
 * 获取当前登陆用户信息
 * @return {object}
 */
Auth.user = function() {
    return wx.getStorageSync('user');
}

/**
 * 获取token
 * @return {string}
 */
Auth.token = function() {
    return wx.getStorageSync('token');
}

/**
 * 判断是否有效期
 * @return {boolean}
 */
Auth.check = function() {
    let user = Auth.user()
    let token = Auth.token()
    if (user && Date.now() < wx.getStorageSync('expired_in') && token) {
        // console.log('access_token过期时间：', (wx.getStorageSync('expired_in') - Date.now()) / 1000, '秒');
      // console.log('Auth.check成功');
        return true;
    } else {
      // console.log('Auth.check失败');
        return false;
    }
}

/**
 * 登录
 * @return {Promise} 登录信息
 */
Auth.login = function() {
    return new Promise(function(resolve, reject) {
        wx.login({
            success: function(res) {
              // console.log('Auth.login成功',res);
                resolve(res);
            },
            fail: function(err) {
              // console.log('Auth.login失败',res);
                reject(err);
            }
        });
    });
}

/**
 * 通过 wx.login 获取code
 * @return code
 */
Auth.code = function () {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        // console.log('logincodesucess');
        resolve(res.code);
      },

      fail: function (err) {
        // console.log('logincodefail');
        reject(err);
      }
    });
  });
}


/**
 * 注销
 * @return {boolean}
 */
Auth.logout = function() {
    wx.removeStorageSync('user')
    wx.removeStorageSync('token')
    wx.removeStorageSync('expired_in')
    return true
}

/**
 * 获取授权登录加密数据
 */
Auth.getUserInfo = function(){
    return new Promise(function(resolve, reject) {
		Auth.login().then(data => {
			let args = {}
			args.code = data.code;
			wx.getUserInfo({
				success: function (res) {
					// console.log(res);
					args.iv = encodeURIComponent(res.iv);
					args.encryptedData = encodeURIComponent(res.encryptedData);
					resolve(args);
				},
				fail: function (err) {
          // console.log('Auth.getUserInfo失败',err);
					reject(err);
				}
			});
		})
    });
}

module.exports = Auth