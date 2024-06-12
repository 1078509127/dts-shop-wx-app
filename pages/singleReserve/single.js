// pages/singleReserve/single.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    single:"",
    sexList: ['男', '女'],
    date:"",
    startTime:"",
    endTime:"",
    tableList: [1, 2, 3, 4, 5, 6],
  },
  submitForm(e){
    console.log("123",e.detail.value)
  },
  bindSex: function(e) {
    console.log('性别选择改变，携带值为', e.detail.value)
  },
  bindDate: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
  },
  bindStart: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
  },
  bindEnd: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
  },
  bindTNumber: function(e) {
    console.log('bindTNumber发送选择改变，携带值为', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("这是接受的值",options)
    this.single = options.single;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})