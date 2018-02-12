App({
  globalData: {
    // 将音乐播放的状态保存到全局变量中，主要解决从详情页面A到达列表页在
    // 到达详情页面B时，播放状态isPlaying紊乱的问题
    g_isPlaying: false,
    // 记录当前 g_isPlaying 是那个页面的播放状态值，与 g_isPlaying 
    // 共同作用。保证不同详情页的播放状态正确
    g_currentPostId: -1
  }
})