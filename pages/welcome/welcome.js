Page({
  data: {
    name: "大自然的搬运工",
    imgSrc: "/imgs/head.png",
    btnColor: "btncolor1"
  },
  toMina: function () {
    var that = this;
    this.setData({ btnColor: "btncolor2" })
    wx.redirectTo({
      url: '../index/index',
      success: function () {
        // 更改简易按钮的样式
        // 操作前后按钮样式的更改实现一个点击按下和松开的效果对比
        that.setData({ btnColor: "btncolor1" })
      }
    })
  }
})