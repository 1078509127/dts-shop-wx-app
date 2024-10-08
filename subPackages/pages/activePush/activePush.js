// pages/activePush/activePush.js
var util = require('../../../utils/util.js');
var check = require('../../../utils/check.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme:"",
    time:"",
    provider:"",
    site:"",
    organ:"",
    content:"",
    onShow:true,
  },
  bindTheme:function(e){
    this.setData({
      theme:e.detail.value
    })
  },
  bindTime:function(e){
    this.setData({
      time:e.detail.value
    })
  },
  bindProvider:function(e){
    this.setData({
      provider:e.detail.value
    })
  },
  bindSite:function(e){
    this.setData({
      site:e.detail.value
    })
  },
  bindOrgan:function(e){
    this.setData({
      organ:e.detail.value
    })
  },
  bindContent:function(e){
    this.setData({
      content:e.detail.value
     })
    
  },
  submitBtn:function(){
    if (this.data.theme == '') {
      util.showErrorToast('请输入活动主题');
      return false;
    }
    if (this.data.time == '') {
      util.showErrorToast('请输入活动时间');
      return false;
    }
    const regex = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/
    const regexs = /^\d{4}\/\d{2}\/\d{2}\~\d{4}\/\d{2}\/\d{2}$/
    if(!regex.test(this.data.time) && !regexs.test(this.data.time)){
      util.showErrorToast('日期格式错误');
      return false;
    }
    if (this.data.provider == '') {
      util.showErrorToast('请输入发布者');
      return false;
    }
    if (this.data.site == '') {
      util.showErrorToast('请输入活动地点');
      return false;
    }
    if (this.data.organ == '') {
      util.showErrorToast('请输入组织机构');
      return false;
    }
    // if (this.data.content == '') {
    //   util.showErrorToast('请输入详情');
    //   return false;
    // }
    util.request(
      api.activePush,
       {theme:this.data.theme,
         time:this.data.time,
         provider:this.data.provider,
         site:this.data.site,
         organ:this.data.organ,
      },'GET').then(res => {
        wx.showModal({
          title: '发布成功',
          icon: 'success',
          duration: 2000,
        })  
        // if(res.errcode == 0){
        //   wx.showModal({
        //     title: '发布成功',
        //     icon: 'success',
        //     duration: 2000,
        //   })  
        // }else{
        //   wx.showModal({
        //     title: res.errmsg,
        //     icon: 'error',
        //     duration: 2000,
        //   })  
        // }
    })
  },
  /**检测 */
  checked:function(e){
    if (e.detail.value != '') {
      util.request(api.MsgSecCheck,{content:e.detail.value},'GET').then(res => {
        if (!res) {
          wx.showToast({
            title: '含有敏感词汇,请重新输入',
            icon: 'none'
          })
          return false;
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      onShow:app.globalData.isExamine
    })
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