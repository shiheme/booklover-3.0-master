const API_HOST = 'https://www.appbeebee.com'  // 更换为你的网站域名, 需要有 https 协议
const templates = {
	comments:['fNlp81kLJvCKLNBdendgPG7Pe1lCJFKmIMHt2r76YZ0','zYvY02QIIrAD1snUHBHZzKdlWzN54lRX05KYvSSTvUk'], // 评论回复与审核模板ID
  subscribe: ['lY9CntlXomutTwjGTbzzK1w6q9NTLNvft5fXZDSioS8'] // 资讯更新提醒模板ID
}

const Auth = require('./auth')

 
const API = {}

API.getHost = function(){
	return API_HOST;
}

API.template = function() {
	return templates;
}

API.getUrlFileName = function (url, domain) {
  var filename = url.substring(url.lastIndexOf("/") + 1);

  if (filename == domain || filename == '') {
    filename = "index";
  }
  else {
    filename = filename;
  }

  return filename;
}

API.getUrlPosttypeName = function (url, domain) {
  var posttype = url.substring(url.indexOf("//", 1) + 2, url.lastIndexOf("/"));
  if (posttype.indexOf("/") != -1) {
    var split = posttype.split("/");
    posttype = split[1];
 }
  return posttype;
}

API.request = function(url, method = "GET", data={}, args = { token: false }) {
	
	return new Promise(function(resolve, reject) {
		
		url = API_HOST + url;
		
		if (args.token) {
			const token = API.token();
			if(token) {
				if(url.indexOf("?")>0) {
					url = url + '&access_token=' + token;
				} else {
					url = url + '?access_token=' + token;
				}
			} else {
				console.warn('[提示]','部分数据需要授权，检测出当前访问用户未授权登录小程序');
			}
		}
		console.log(url)
		//console.log(data)
		wx.request({
			url: url,
			data: data,
			method: method,
			success: function(res) {
				console.log(res);
				if(res.statusCode == 200) {
					resolve(res.data);
				} else if(res.data.code === "rest_post_invalid_page_number") {
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
					console.log(res.data.message);
					reject(res.data);
				}
			},
			fail: function(err) {
				console.log(err);
				reject(err);
			}
		})
	});
	
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

API.get = function(url, data={}, args = { token: false }) {
	return API.request(url, "GET", data, args);
}

API.post = function(url, data, args = { token: false }) {
	return API.request(url, "POST", data, args);
}

API.getUser = function(){
	if(Auth.check()){
		return Auth.user();
	}else{
		return false;
	}
	
}

API.login = function() {
	return new Promise(function(resolve, reject) {
		if(Auth.check()){
			resolve(Auth.user());
		}else{
			Auth.login().then(data=>{
				API.post('/wp-json/mp/v1/user/openid', data, { token: false }).then(res => {
					API.storageUser(res);
					//console.log(res);
					resolve(res);
				}, err => {
					reject(err);
				});
			}).catch( err =>{
				reject(err);
			})
		}
	});
}

API.logout = function() {
	let logout = Auth.logout();
	if(logout) {
		getApp().globalData.user = '';
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

API.getUserInfo = function() {
	return new Promise(function(resolve, reject) {
		Auth.getUserInfo().then(data=>{
			API.post('/wp-json/mp/v1/user/login', data, { token: false }).then(res => {
				API.storageUser(res);
				console.log(res);
				resolve(res.user);
			}, err => {
				reject(err);
			});
		})
		.catch( err =>{
			reject(err);
		})
	});
}

API.token = function() {
	let token = Auth.token();
	let datetime = Date.now();
	if(token && datetime < wx.getStorageSync('expired_in')) {
		return token;
	} else {
		return false;
	}
}

API.storageUser = function(res) {
	getApp().globalData.user = res.user;
	wx.setStorageSync('user', res.user);
	wx.setStorageSync('openid', res.openid);
	if(res.access_token){
		wx.setStorageSync('token', res.access_token);
		wx.setStorageSync('expired_in', Date.now() + parseInt(res.expired_in, 10) * 100000 - 60000);
	}
}

 /**
 * 需要授权的接口调用
 * @param	{Function} fn
 * @return {Promise}
 */
API.guard = function(fn) {
	const self = this
	return function() {
		if(API.getUser()) {
			return fn.apply(self, arguments)
		} else {
			return API.getUserInfo().then(res => {
				console.log('登录成功', res);
				return fn.apply(self, arguments)
			}, err => {
				console.log('登录失败', err);
				return err
			})
		}
	}
}

module.exports = API