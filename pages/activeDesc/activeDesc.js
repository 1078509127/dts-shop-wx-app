//  pages/activeDesc/activeDesc.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
var ArticleDetail=""
var isClick=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ArticleDetailInfo:""
  },
    //编辑富文本后失去光标调用
    getInputValue:function(e){
      debugger
      wx.showModal({
        content: '确认修改',
        complete: (res) => {
          //点击取消修改按钮
          if (res.cancel) {
            return;
          }
          // 确认修改按钮
          if (res.confirm) {
            util.request(api.AdmUpArticle,{
                  id:1,
                  content:e.detail.value,
                },"POST").then(res => {
                  //跳转上一画面防止重复提交
                  if(res.errmsg == "成功"){
                    wx.switchTab({
                      url: '/pages/index/index'
                    });
                  }
                })
          }
        }
      })



      // 判断如果点击提交按钮 就修改
      // if(isClick == true){
      //   util.request(api.AdmUpArticle,{
      //     id:1,
      //     content:e.detail.value,
      //   },"POST").then(res => {
      //     //console.log(res+"----------------")
      //     if(res.errmsg == "成功"){
          
      //       // wx.switchTab({
      //       //   url: '/pages/index/index'
      //       // });
      //     }
      //   })
        
      // }


    },
    upclick(event) {
      //点击修改公告
      isClick = true
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     //活动描述
      util.request(api.AdmArticleDetail,{
       id:1
     },"GET").then(res => {
         if(res.data.content != undefined){
           //var ss=""
           //去掉文本中的<p>标签，该方法replace(/<[^>]+>/g,'')
           res.data.content.replace(/<[^>]+>/g,'')
           this.setData({
             ArticleDetailInfo: res.data.content.replace(/<[^>]+>/g,'')
           });
         }else{
           console.log(res.data.content)
           this.setData({
             ArticleDetailInfo: res.data.content
           });
         }
     })
////////////////////end
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