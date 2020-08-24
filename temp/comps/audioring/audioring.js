const API = require('../../../utils/api')
const myaudio = wx.createInnerAudioContext();

Component({
  properties: {
    index: {
      type: Number,
      value: true
    },
    type: {
      type: String,
      value: 'index'
    },
    height: {
      type: Number,
      value: true
    },
    margintop: {
      type: Number,
      value: true
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
  },
  data: {
    progressWidth: 0,
    deg: 0,
    waiting: true
  },
  ready: function ready() {},
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
        v.book_audio_state = 'false';
        if (i == key) {
          v.book_audio_state = 'true';
        }
      })

      var myEventDetail = {
        audKey: key,
        item: item
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)

      // console.log('state' + that.data.item[0].book_audio_state)

      myaudio.autoplay = true;
      var audKey = that.data.audKey,
        vidSrc = item[audKey].book_audio.guid;
      myaudio.src = vidSrc;

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
          } = this.setProgress(that.duration, that.currentTime);

          that.setData({
            waiting: false
          })

          //如果有定时器 就把它放定时器里面

          this.startcircle(deg);
          // console.log(myaudio.duration) //总时长
          // console.log(myaudio.currentTime) //当前播放进度
        })

      }, 500)
      //结束监听
      myaudio.onEnded(() => {
        // console.log('自动播放完毕');
        this.startcircle(0);
        item[key].book_audio_state = 'false';
        var myEventDetail = {
          audKey: key,
          item: item,
          deg: 0
        } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('myevent', myEventDetail, myEventOption)
      })

      //错误回调
      myaudio.onError((err) => {
        console.log(err);
        item[key].book_audio_state = 'false';
        // this.setData({
        //   item: item,
        // })
        var myEventDetail = {
          audKey: key,
          item: item
        } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('myevent', myEventDetail, myEventOption)
        return
      })

    },

    // 音频停止
    audioStop: function (e) {
      let that = this,
        key = e.currentTarget.dataset.key,
        item = that.data.item;
      //切换显示状态
      item.forEach((v, i, array) => {
        v.book_audio_state = 'false';
      })
      var myEventDetail = {
        audKey: key,
        item: item,
        deg: 0
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
      myaudio.stop();
      //停止监听
      myaudio.onStop(() => {
        // console.log('停止播放');
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