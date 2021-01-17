const API = require('./base')

// 定义首页切换菜单
const getIndexnav = function(cnttype) {
  return new Promise((resolve, reject) => {
    if(cnttype=='library') {
   const result =[{
        name: '好书',
        id: 0,
        posttype: 'topic',
        catstype: '',
      }, {
        name: '语录',
        id:1,
        posttype: 'quot',
        catstype: '',
      }, {
        name: '排行',
        id:2,
        posttype: 'top',
        catstype: '',
      }];
      resolve(result);
    } else if(cnttype=='films'){
        const result =[{
          name: '好剧',
          id: 0,
          posttype: 'topic',
          catstype: '',
        }, {
          name: '台词',
          id:1,
          posttype: 'quot',
          catstype: '',
        }, {
          name: '排行',
          id:2,
          posttype: 'top',
          catstype: '',
        }];
        resolve(result);
      } else if(cnttype=='app'){
        const result =[{
          name: 'APP',
          id: 0,
          posttype: 'topic',
          catstype: '',
        }, {
          name: '排行',
          id:1,
          posttype: 'top',
          catstype: '',
        }];
        resolve(result);
      }
      
      // console.log("分类列表", result);
  });
}

/**
 * 获取站点信息
 * @param  {object} args 参数,默认为空
 * @return {promise}
 */
const getSiteInfo = function(data) {
  return API.get('/mp/v1/setting', data);
}

/**
 * 获取置顶文章
 * @param  {object} args 参数,默认为空
 * @return {promise}
 */
const getStickyPosts = function(data) {
	return API.get('/mp/v1/posts/sticky', data);
}

/**
 * 获取文章列表
 * @param  {object} args 参数,默认为空
 * 参数可以访问: http://v2.wp-api.org/ 了解相关参数
 * @return {promise}
 */
const getPostsList = function (posttype,data) {
  return API.get('/wp/v2/' + posttype, data, { token:false });
}

/**
 * 获取文章详情
 * @param  {int} id 文章id
 * @return {promise}
 */
const getPostsbyID = function(posttype,id){
	return API.get('/wp/v2/'+posttype+'/'+id, {skip_cache:1}, { token:true });   
}

/**
 * 获取页面列表
 * @param  {object} args 参数,默认为空
 * 参数可以访问: http://v2.wp-api.org/ 了解相关参数
 * @return {promise}
 */
const getPagesList = function(data){
	return API.get('/wp/v2/pages', data);   
}

/**
 * 获取页面详情
 * @param  {int} id 页面id
 * @return {promise}
 */
const getPageByID = function(id){
	return API.get('/wp/v2/pages/'+id);   
}

/**
 * 获取所有分类列表
 * @param  {object} args 参数
 * 参数可以访问: http://v2.wp-api.org/ 了解相关参数
 * @return {promise}
 */
const getCategories = function(catstype,data){
	return API.get('/wp/v2/'+ catstype +'?orderby=id&order=asc', data);
}

/**
 * 获取指定分类
 * @param {int} id 分类ID
 * @return {promise}
 */
const getCategoryByID = function (catstype,id){
  return API.get('/wp/v2/' + catstype +'/'+id);   
}

/**
 * 获取所有标签列表
 * @param  {object} args 参数
 * 参数可以访问: http://v2.wp-api.org/ 了解相关参数
 * @return {promise}
 */
const getTags = function(data){
	return API.get('/wp/v2/tags?orderby=id&order=asc', data);   
}

/**
 * 获取指定标签
 * @param  {int} id 标签ID
 * @return {promise}
 */
const getTagByID = function(id){
	return API.get('/wp/v2/tags/'+id);   
}

/**
 * 获取随机文章列表
 * @param  {object} args 参数,默认为空
 * @return {promise}
 */
const getRandPosts = function(data){
	return API.get('/mp/v1/posts/rand', data);   
}

/**
 * 获取相关文章列表
 * @param  {object} data 参数
 * @return {promise}
 */
const getRelatePosts = function(data){
	return API.get('/mp/v1/posts/relate', data);   
}

/**
 * 获取热门文章列表
 * @param  {object} args 参数,默认为空
 * @return {promise}
 */
const getMostPosts = function(posttype,data){
	return API.get('/mp/v1/posts/most?post_type=' + posttype, data);   
}

/**
 * 获取热门文章列表
 * @param  {object} args 参数,默认为空
 * @return {promise}
 */
const getMostViewsPosts = function(posttype,data){
	return API.get('/mp/v1/posts/most?meta=views&post_type=' + posttype, data);   
}

/**
 * 获取热门收藏文章列表
 * @param  {object} args 参数
 * @return {promise}
 */
const getMostFavPosts = function(posttype,data){
	return API.get('/mp/v1/posts/most?meta=favs&post_type=' + posttype, data);   
}

/**
 * 获取热门点赞文章列表
 * @param  {object} args 参数
 * @return {promise}
 */
const getMostLikePosts = function(posttype,data){
	return API.get('/mp/v1/posts/most?meta=likes&post_type=' + posttype, data);   
}

/**
 * 获取热评文章列表
 * @param  {object} args 参数,默认为空
 * @return {promise}
 */
const getMostCommentPosts = function(posttype,data){
	return API.get('/mp/v1/posts/most?meta=comments&post_type=' + posttype, data);   
}

/**
 * 获取近期评论文章
 * @param  {object} args 参数,默认为空
 * @return {promise}
 */
const getRecentCommentPosts = function(data){
	return API.get('/mp/v1/posts/comment', data);   
}

/**
 * 文章评论列表
 * @param  {object} args 参数,默认为空
 * @return {promise}
 */
const getComments = function(data) {
	return API.get('/mp/v1/comments', data);
}

/**
 * 获取用户信息
 * @param  {object} args 参数
 * @return {promise}
 */
const getProfile = function() {
	return API.getUserInfo();
}

/**
 * 注销用户登录
 * @param  {object} args 参数
 * @return {promise}
 */
const Loginout = function() {
	return API.logout();
}

/**
 * 收藏文章
 * @param  {object} args 参数,POST 文章id
 * TOKEN 参数为 true ,需要用户授权使用
 * @return {promise}
 */
const fav = function(data) {
	return API.post('/mp/v1/comments?type=fav', data, { token: true });
}

/**
 * 点赞文章
 * @param  {object} args 参数,POST 文章id
 * TOKEN 参数为 true ,需要用户授权使用
 * @return {promise}
 */
const like = function(data) {
	return API.post('/mp/v1/comments?type=like', data, { token: true });
}

/**
 * 我的收藏文章列表
 * @param  {object} args 参数
 * TOKEN 参数为 true ,需要用户授权使用
 * @return {promise}
 */
const getFavPosts = function(data) {
	return API.get('/mp/v1/posts/comment?type=fav', data, { token: true });
}

/**
 * 我的点赞文章列表
 * @param  {object} args 参数
 * TOKEN 参数为 true ,需要用户授权使用
 * @return {promise}
 */
const getLikePosts = function(data) {
	return API.get('/mp/v1/posts/comment?type=like', data, { token: true });
}

/**
 * 我的评论文章列表
 * @param  {object} args 参数
 * TOKEN 参数为 true ,需要用户授权使用
 * @return {promise}
 */
const getCommentsPosts = function(data) {
	return API.get('/mp/v1/posts/comment?type=comment', data, { token: true });
}

/**
 * 发表评论
 * @param  {object} args 参数, POST 评论内容及文章id
 * TOKEN 参数为 true ,需要用户授权使用
 * @return {promise}
 */
const addComment = function(data) {
	return API.post('/mp/v1/comments?type=comment', data, { token: true });
}

/**
 * 投票表态
 * @param  {object} args 参数, POST 文章 ID 及选项 ID
 * TOKEN 参数为 true ,需要用户授权使用
 * @return {promise}
 */
const votePosts = function(data) {
	return API.post('/mp/v1/vote', data, { token: true });
}

/**
 * JWT认证
 * @param  {object} args 参数, POST 文章 ID 及选项 ID
 * TOKEN 参数为 true ,需要用户授权使用
 * @return {promise}
 */
const jsonToken = function(data) {
	return API.post('/mp/v1/jwt/token', data, { token: true });
}

/**
 * 微信小程序订阅消息
 * @param {*} data 
 */
const subscribeMessage = function(data) {
  return API.post('/mp/v1/subscribe', data, { token: true });
}

/**
 * 获取二维码
 * @param  {object} args 参数
 * @return {promise}
 */
const getCodeImg = function(data) {
	return API.post('/mp/v1/qrcode', data, { token: false });
}

/**
 * 导航数据
 */
const getMenuSetting = function(data) {
	return API.get('/mp/v1/menu', data);
}

/**
 * 首页广告数据
 */
const indexAdsense = function(data) {
	return API.get('/mp/v1/advert?type=index', data);
}

/**
 * 列表广告数据
 */
const listAdsense = function(data) {
	return API.get('/mp/v1/advert?type=list', data);
}

/**
 * 详情广告数据
 */
const detailAdsense = function(data) {
	return API.get('/mp/v1/advert?type=detail', data);
}

/**
 * 页面广告数据
 */
const pageAdsense = function(data) {
	return API.get('/mp/v1/advert?type=page', data);
}

/**
 * 图片上传
 */
const uploadMedia = function(files,token) {
	return API.upload('/wp/v2/media', files, token);
}

/**
 * 删除图片
 */
const deleteMedia = function(id,token) {
	return API.vdelete('/wp/v2/media/' + id + '?force=true', {}, token);
}

const addPosts = function(data,token,posttype) {
	return API.vpost('/wp/v2/' +posttype, data, token);
}

const getPosts = function(data,token) {
	return API.vget('/wp/v2/posts', data, token);
}

const previewPosts = function(id,token) {
	return API.vget('/wp/v2/posts/' + id, {}, token);
}

const updatePosts = function(id,token) {
	return API.vpost('/wp/v2/posts/' + id, { status: 'publish' }, token);
}

const deletePosts = function(id,token) {
	return API.vdelete('/wp/v2/posts/' + id + '?force=true', {}, token);
}

const transToVoice = function(data) {
	return API.post('/mp/v1/voice', data, { token: false })
}

const insertAdsense = function(data) {
	return API.get('/mp/v1/advert/insert', data);
}

// 获取特定slug的文章内容
const getPostBySlug = function (posttype, slug) {
  return API.get('/wp/v2/' + posttype + '?slug=' + slug);
}

const getAge = function (dateStr) {
  var r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  if (r == null)
    return false;
  var d = new Date(r[1], r[3] - 1, r[4]);
  if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3]
      && d.getDate() == r[4]) {
    var Y = new Date().getFullYear();
    return (Y - r[1]);
  }
  return "";

  // var publishTime = Date.parse(dateStr) / 1000,
  // date = new Date(publishTime * 1000),
  // Y = date.getFullYear(),
  //   M = date.getMonth() + 1,
  //   D = date.getDate();
  //   if (M < 10) {
  //     M = '0' + M;
  //   }
  //   if (D < 10) {
  //     D = '0' + D;
  //   }

}

const getBirth = function (dateStr) {
  // var r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  // if (r == null)
  //   return false;
  // var d = new Date(r[1], r[3] - 1, r[4]);
  // if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3]
  //     && d.getDate() == r[4]) {
  //   var Y = new Date().getFullYear();
  //   return (Y - r[1]);
  // }
  // return "";

  var publishTime = Date.parse(dateStr) / 1000,
  date = new Date(publishTime * 1000),
  Y = date.getFullYear().toString().substr(2, 2),
    M = date.getMonth() + 1,
    D = date.getDate();
    if (M < 10) {
      M = '0' + M;
    }
    if (D < 10) {
      D = '0' + D;
    }

    return Y + '.' + M + '.' + D;

}

const getDateDiff = function (dateStr) {
  var dateStr = dateStr.replace("T", " "),
    publishTime = Date.parse(dateStr.replace(/-/gi, "/")) / 1000,
    d_seconds,
    d_minutes,
    d_hours,
    d_days,
    timeNow = parseInt(new Date().getTime() / 1000),
    d,
    date = new Date(publishTime * 1000),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  //小于10的在前面补0
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  if (H < 10) {
    H = '0' + H;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }

  d = timeNow - publishTime;
  d_days = parseInt(d / 86400);
  d_hours = parseInt(d / 3600);
  d_minutes = parseInt(d / 60);
  d_seconds = parseInt(d);

  if (d_days > 0 && d_days < 3) {
    return d_days + '天前';
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + '小时前';
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + '分钟前';
  } else if (d_seconds < 60) {
    if (d_seconds <= 0) {
      return '刚刚发表';
    } else {
      return d_seconds + '秒前';
    }
  } else if (d_days >= 3 && d_days < 30) {
    return M + '月' + D + '日';
  } else if (d_days >= 30) {
    return Y + '年' + M + '月' + D + '日';
  }

  return publishTime;
}

const cutstr = function (str, len, flag) {
  var str_length = 0;
  var str_len = 0;
  var str_cut = new String();
  var str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    var a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4  
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      if (flag == 0) {
        str_cut = str_cut.concat("...");
      }
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串；  
  if (str_length < len) {
    return str;
  }
}

const removeHTML = function (s) {
  var str = s.replace(/<\/?.+?>/g, "");
  str = str.replace("[&hellip;]", "...");
  str = str.replace(/[\r\n]/g, ""); //去掉回车换行    
  return str.replace(/ /g, "");
}

const addxing = function (s) {
  var str = s.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");  
  return str.replace(/ /g, "");
}

const isDuringDate = function (startDateStr, endDateStr) {
  var curDate = new Date(),
    startDate = new Date(startDateStr),
    endDate = new Date(endDateStr);
  if (curDate >= startDate && curDate <= endDate) {
    return '1';
  }
  if (curDate < startDate) {
    return '0';
  }
  if (curDate > endDate) {
    return '2';
  }
}

const mathRoundRate = function (num) {
  var result = parseFloat(num);
  result = Math.round(num * 2 * 10) / 10;
   var str = result.toString();
  var pos_decimal = str.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = str.length;
    str += '.';
  }
  while (str.length <= pos_decimal + 1) {
    str += '0';
  }
  return str;
}

const formatNumber = function (num) {
  if (num >= 0 && num < 10) {
    return `0${num}`;
  }
  return num;
}

const formatTime =  function (time, showHour){
  const h = time.getUTCHours();
  const m = time.getUTCMinutes();
  const s = time.getUTCSeconds();
  if (showHour || h > 0) {
    return [h, m, s].map(formatNumber).join(':');
  } else {
    return [m, s].map(formatNumber).join(':');
  }
}

const cutspit = function(s, len) {
  var arr = [];
  var str = s.split('-');
    arr.push({'field':str[0],'name':str[1]});
  // str = [field:str[0],name:str[1]]
  return arr;
}

// const cutspit = function(s, len) {
//   // var arr = [];
//   var str = s.split('-');
//     // arr.push(str[0],str[1]);
//   // str = [felid:str[0],name:str[1]]
//   return str[len];
// }

API.getIndexnav = getIndexnav
API.getSiteInfo					    = getSiteInfo
API.getStickyPosts			    = getStickyPosts
API.getPostsList				    = getPostsList
API.getPostsbyID				    = getPostsbyID
API.getPagesList				    = getPagesList
API.getPageByID					    = getPageByID
API.getCategories				    = getCategories
API.getCategoryByID			    = getCategoryByID
API.getTags						      = getTags
API.getTagByID					    = getTagByID
API.getRandPosts				    = getRandPosts
API.getRelatePosts				  = getRelatePosts
API.getMostPosts            = getMostPosts
API.getMostViewsPosts		  	= getMostViewsPosts
API.getMostFavPosts				  = getMostFavPosts
API.getMostLikePosts			  = getMostLikePosts
API.getMostCommentPosts			= getMostCommentPosts
API.getRecentCommentPosts		= getRecentCommentPosts
API.getComments					    = getComments
API.getProfile					    = API.guard(getProfile)
API.fav							        = API.guard(fav)
API.getFavPosts					    = API.guard(getFavPosts)
API.like						        = API.guard(like)
API.getLikePosts				    = API.guard(getLikePosts)
API.getCommentsPosts			  = API.guard(getCommentsPosts)
API.addComment					    = API.guard(addComment)
API.votePosts					      = API.guard(votePosts)
API.jsonToken						= API.guard(jsonToken)
API.subscribeMessage        = API.guard(subscribeMessage)
API.getCodeImg					    = getCodeImg
API.Loginout					      = Loginout
API.getMenuSetting				  = getMenuSetting
API.indexAdsense				    = indexAdsense
API.listAdsense					    = listAdsense
API.detailAdsense				    = detailAdsense
API.pageAdsense					    = pageAdsense
API.uploadMedia						= uploadMedia
API.deleteMedia						= deleteMedia
API.addPosts						= addPosts
API.getPosts						= getPosts
API.previewPosts					= previewPosts
API.updatePosts						= updatePosts
API.deletePosts						= deletePosts
API.transToVoice					= transToVoice
API.insertAdsense					= insertAdsense
API.getPostBySlug           = getPostBySlug
API.getAge                  = getAge
API.getBirth                = getBirth
API.getDateDiff             = getDateDiff
API.cutstr                  = cutstr
API.removeHTML              = removeHTML
API.addxing                 = addxing
API.isDuringDate            = isDuringDate
API.mathRoundRate           = mathRoundRate
API.formatTime              = formatTime
API.cutspit                 = cutspit

module.exports = API