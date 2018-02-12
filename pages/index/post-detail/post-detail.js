// pages/index/post-detail/post-detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPostId: "",//记录跳转时携带的id
    postData: {},//通过id取详情
    isPlaying: false,//监控音乐的播放状态，选择适合的图片
    collected: false//当前内容是否收藏
  },
  currentMusicUrl: "",//背景音乐url
  postsCollected: [],//记录收藏状态

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let postId = options.postId;
    var that = this;
    this.getHttpData(postId, "postData", function (data) {
      that.setData({ postData: data });
      that.setData({ currentPostId: postId });
      that.currentMusicUrl = data.music.url;
    });
    // 获取文章收藏数组
    this.getHttpData("postsCollected", "json", function (data) {
      that.postsCollected = data;
      // console.log(data);
      that.setData({ collected: that.postsCollected.indexOf(String(postId)) >= 0 });
    });
    // 若是有背景音乐正在播放的话话，判断是否是当前页面的背景音乐，以免在不同详情页的播放状态相互影响
    if (app.globalData.g_currentPostId == postId) {
      this.setData({ isPlaying: app.globalData.g_isPlaying });
    }
    this.onAudioState();
  },

  // 收藏
  onCollectionTap: function () {
    let collected = !this.data.collected;
    this.setData({ collected: collected });
    wx.showToast({
      title: collected ? '收藏成功' : '取消收藏', duration: 1000,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载    收藏状态的保存
   */
  onUnload: function () {
    let postId = this.data.currentPostId;
    if (this.data.collected === (this.postsCollected.indexOf(String(postId)) < 0)) {
      if (this.data.collected) {
        this.postsCollected.push(postId);
      } else {
        this.postsCollected.pop(postId);
      }
      this.postHttpData("postsCollected", this.postsCollected, "json");
    }
  },

  //点击播放背景音乐
  onMusicTap: function () {
    let isPlaying = this.data.isPlaying;
    let music = this.data.postData.music;
    if (isPlaying) {
      // 如果是正在播放，再次点击的话，暂停播放
      wx.pauseBackgroundAudio();
    } else {
      // 如果是正在暂停，再次点击的话，开始播放
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg
      });
      app.globalData.g_currentPostId = this.data.currentPostId;

    }
    app.globalData.g_isPlaying = !isPlaying;
    this.setData({ isPlaying: !isPlaying });
  },
  // 监听播放状态的事件（（PS：这里和社区极速文档的的音乐播放控制API篇，使用的方式不同，为了介绍多种解决方案，费尽心机呀！））
  onAudioState: function () {
    wx.getBackgroundAudioPlayerState({
      success: (res) => {
        if (res.status !== 2 && this.currentMusicUrl !== res.dataUrl) {
          wx.stopBackgroundAudio();
        }
      }
    })
    wx.onBackgroundAudioPlay(() => {
      app.globalData.g_isPlaying = true;
      if (app.globalData.g_currentPostId == this.data.currentPostId) {
        this.setData({ isPlaying: true });
      }
      // console.log('paly');
    });
    wx.onBackgroundAudioPause(() => {
      app.globalData.g_isPlaying = false;
      this.setData({ isPlaying: false });
      // console.log('pause');
    });
    wx.onBackgroundAudioStop(() => {
      app.globalData.g_isPlaying = false;
      app.globalData.g_currentPostId = -1;
      this.setData({ isPlaying: false });
      // console.log('stop');
    });
  },
  // key 表示数据名称，_type 数据类型，callback 表示请求成功的回调函数
  getHttpData: function (key, _type, callback) {
    wx.request({
      url: 'https://api.wxappclub.com/get',
      data: {
        // 笔者的API中心，提供给各位使用
        "appkey": "eaa7gcwem04j8sak7hm8g88mkftgb26h",
        "key": key,
        "type": _type
      },
      method: 'GET',
      header: {
        'content-type': 'json'
      },
      success: function (res) {
        // console.log(res.data.result);
        
        if (res.data.success) {
          // callback(res.data.result.value);
          callback(res.data.result.value);
        }
      }
    });
  },
  // 用于提交数据的方法（爱我的话，请不要随意提交数据。谢谢！！！）
  postHttpData: function (key, value, _type) {
    wx.request({
      url: 'https://api.wxappclub.com/put',
      data: {
        "appkey": "eaa7gcwem04j8sak7hm8g88mkftgb26h",
        "key": key,
        "value": value,
        "type": _type
      },
      method: 'GET',
      header: {
        'content-type': 'json'
      }
    });
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

  }
})