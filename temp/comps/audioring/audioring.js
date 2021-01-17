const PCB = require('../../../utils/common');
const API = require('../../../utils/api')
const plugin = requirePlugin('WechatSI');
const myaudio = wx.createInnerAudioContext();


Component({
  behaviors: [PCB],
  properties: {
    index: {
      type: Number,
      value: true
    },
    type: {
      type: String,
      value: 'index'
    },
    item: {
      type: Array,
      value: []
    },
    detail: {
      type: Array,
      value: []
    },
    audKey: {
      type: Number,
      value: true
    },
    waiting: {
      type: Boolean,
      value: true
    }
  },
  data: {
    progressWidth: 0,
    deg: 0,
    waiting: true
  },
  ready: function ready() {
    // console.log(this.data.waiting)
    // console.log('waiting')
  },
  attached() {},
  methods: {
    startcircle(deg) {
      var leftani = wx.createAnimation({
        duration: '0',
        timingFunction: 'ease',
        transformOrigin: '100% 50% 0',
      })
      var rightani = wx.createAnimation({
        duration: '0',
        timingFunction: 'ease',
        transformOrigin: '0 50% 0',
      })
      if (deg <= 180) {
        leftani.rotateZ(0).step();
        rightani.rotateZ(deg).step()
      } else if (deg > 180) {
        leftani.rotateZ(deg - 180).step();
        rightani.rotateZ(180).step()
      }

      this.setData({
        leftani: leftani.export(),
        rightani: rightani.export()
      })
    },

    //音频播放  
    audioPlay: function (e) {

      this.startcircle(0);
      let that = this,
        //id = e.currentTarget.dataset.id,
        key = e.currentTarget.dataset.key,
        item = that.data.item;
      // console.log(item)
      // console.log('item')
      //设置状态
      item.forEach((v, i, array) => {
        v.quot_audio_state = 'false';
        if (i == key) {
          v.quot_audio_state = 'true';
        }
      })

      var myEventDetail = {
        audKey: key,
        item: item,
        waiting: true
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)

      // console.log('state' + that.data.item[0].quot_audio_state)
      myaudio.autoplay = true;
      
      var audKey = that.data.audKey,
        vidTxt = item[audKey].title.rendered + item[audKey].book_tolibrary[0].book_author + item[audKey].book_tolibrary[0].book_director + item[audKey].book_tolibrary[0].book_title + '。' + item[audKey].date + '。建始同城共享书为您朗读。';

      plugin.textToSpeech({
        lang: "zh_CN",
        tts: true,
        content: vidTxt,
        success: function (res) {
          // console.log(res);
          // console.log("succ tts", res.filename);
          // that.setData({
          //   quot_audio: res.filename
          // })
          // 播报语音

          // that.audioPlaying();
          if (res.filename == '') {
            // console.log("暂无语音");
            return;
          }
          // var vidSrc = res.filename;
          wx.downloadFile({
            url: res.filename, //仅为示例，并非真实的资源
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                // console.log(res.tempFilePath)
                myaudio.src = res.tempFilePath;

                //开始监听

                myaudio.play();
                //开始监听
                myaudio.onPlay(() => {
                  // console.log('开始播放');

                })

                setTimeout(() => {
                  myaudio.duration
                  myaudio.onTimeUpdate(() => {
                    that.duration = myaudio.duration;
                    that.currentTime = myaudio.currentTime;

                    const {
                      duration,
                      currentTime,
                      progressWidth,
                      deg
                    } = that.setProgress(that.duration, that.currentTime);

                    that.setData({
                      waiting: false
                    })

                    //如果有定时器 就把它放定时器里面

                    that.startcircle(deg);

                    // console.log(myaudio.duration) //总时长
                    // console.log(myaudio.currentTime) //当前播放进度
                  })
                }, 500)

                //结束监听
                myaudio.onEnded(() => {
                  // console.log('自动播放完毕');
                  that.startcircle(0);
                  item[key].quot_audio_state = 'false';
                  var myEventDetail = {
                    audKey: key,
                    item: item,
                    deg: 0,
                    waiting: true
                  } // detail对象，提供给事件监听函数
                  var myEventOption = {} // 触发事件的选项
                  that.triggerEvent('myevent', myEventDetail, myEventOption)

                  that.setData({
                    waiting: true
                  })
                })

                //错误回调
                myaudio.onError((err) => {
                  console.log(err);
                  item[key].quot_audio_state = 'false';
                  // this.setData({
                  //   item: item,
                  // })
                  var myEventDetail = {
                    audKey: key,
                    item: item,
                    waiting: true
                  } // detail对象，提供给事件监听函数
                  var myEventOption = {} // 触发事件的选项
                  that.triggerEvent('myevent', myEventDetail, myEventOption)
                  that.setData({
                    waiting: true
                  })
                  return
                })
              }
            }
          })


        },
        fail: function (res) {
          // console.log("fail tts", res)
        }
      });

      // },
      // audioPlaying: function (e) {

    },

    // 音频停止
    audioStop: function (e) {
      let that = this,
        key = e.currentTarget.dataset.key,
        item = that.data.item;
      //切换显示状态
      item.forEach((v, i, array) => {
        v.quot_audio_state = 'false';
      })
      var myEventDetail = {
        audKey: key,
        item: item,
        deg: 0,
        waiting: true
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
      this.setData({
        waiting: true
      })
      myaudio.stop();
      //停止监听
      myaudio.onStop(() => {
        // console.log('停止播放');
        this.setData({
          waiting: true
        })
      })
    },

    setProgress(duration, currentTime) {
      return {
        duration: API.formatTime(new Date(duration)),
        currentTime: API.formatTime(new Date(currentTime)),
        progressWidth: parseFloat(currentTime / duration * 100).toFixed(2),
        deg: 360 * parseFloat(currentTime / duration * 100).toFixed(0) / 100,
      };
    },
  }
});