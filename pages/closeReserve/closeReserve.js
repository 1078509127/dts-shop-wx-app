// pages/closeReserve/closeReserve.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');

//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setList:[],
    switchChecked:"",
  },
  //查询数据
  list:function(){
  util.request(api.activeList, null, 'GET').then(res => {
      this.setData({
        setList: res
      })
    })
  },
 
  //是否开通
  switch1Change:function(e){
    util.request(api.activeUpdate, {id:e.currentTarget.dataset.item.id,isOpen:e.detail.value}, 'GET').then(res => {
      if(res.code ==200){
        wx.showModal({
          title: '成功',
          icon: 'success',
          duration: 2000
        });
      }else{
        wx.showModal({
          title: res.message,
          icon: 'error',
          duration: 2000
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.list();
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