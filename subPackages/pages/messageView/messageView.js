// pages/messageView/messageView.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
var messageinfo;
var messageinfoArr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageinfoArr: [{}], //留言数据展示
    messageinfo:[{}],
    isSelect: false, //展示类型？
    types: ['查询全部', '优化建议', '功能异常'], //留言类型
    type: "", //公司/商户类型
  },
  //点击控制下拉框的展示、隐藏
  select: function () {

    var isSelect = this.data.isSelect
    this.setData({
      isSelect: !isSelect
    })
  },





  //点击下拉框选项，选中并隐藏下拉框
  getType: function (e) {

    let value = e.currentTarget.dataset.type
    util.request(api.selMessage, {
      type: value
    }, "GET").then(res => {
      if (res.code == 200) {
        console.log(res.data)
        messageinfo = res.data;
        console.log(messageinfo + "messageinfo")

      } else {
        //console.log(res.code+"=========================")
      }
    })

    console.log()
    this.setData({
      type: value,
      isSelect: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //初期查询留言
    messageinfoArr = []
    util.request(api.selMessage, {}, "GET").then(res => {
      if (res.code == 200) {
        debugger
        messageinfo = res.data;
        if (messageinfo.length > 0) {
          for (var j = 0; j < messageinfo.length; j++) {
            this.data.messageinfoArr.push(messageinfo[j])
          
            this.setData({
              //messageinfoArr: messageinfoArr, //将db数据赋值给messageinfoArr数组前台展示
              messageinfo:messageinfo
            })
            
          }
        }
      } else {
        console.log(res.code + "=========================")
      }
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