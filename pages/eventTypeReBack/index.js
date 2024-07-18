// pages/eventType/eventType.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const WxValidate = require('../../utils/WxValidate.js');


//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:"",
    eventType:"",
    scene:"",
    form:{
      userName:"",
      phone:"",
      unit:"",
      sex:"",
      memberCard:"",
      date:"",
      startTime:"",
      endTime:"",
      tableNumber:"",
      activeNumber:"",
      remark:"",
    },
    checkStartTime:"",
    checkEndTime:"",
    sexList: ['男', '女'],
    tableList: [1, 2, 3, 4, 5, 6],
    idx:"",
    tableList:[
      { number: "1号桌"},
      { number: "2号桌"},
      { number: "3号桌"},
      { number: "4号桌"},
      { number: "5号桌"},
      { number: "6号桌"},
      { number: "7号桌"},
      { number: "8号桌"},
    ],
    flag:true,
  },
  
  initValidate() {
    const rules = {
      userName: {required: true},
      phone: {required: true,tel: true},
      sex: {required: true},
      unit: {required: true},
      memberCard: {required: true},
      date: {required: true},
      startTime: {required: true},
      endTime: {required: true},
      tableNumber: {required: true},
      activeNumber: {required: true},
      remark: {required: true}
    }
    const messages = { //提示信息
      userName: {required: "请输入姓名",fax: "请输入正确的姓名"},
      phone: {required: "请输入手机号",tel: "请输入正确的手机号"},
      sex: {required: "请选择性别",fax: "请输入正确传真号码"},
      unit: {required: "请输入工作单位",fax: "请输入正确传真号码"},
      memberCard: {required: "请输入会员卡号",fax: "请输入正确传真号码"},
      date: {required: "请选择日期",fax: "请输入正确传真号码"},
      startTime: {required: "请选择开始时间",fax: "请输入正确传真号码"},
      endTime: {required: "请选择结束时间",fax: "请输入正确传真号码"},
      tableNumber: {required: "请选择桌号",fax: "请输入正确传真号码"},
      activeNumber: {required: "请输入活动人数",fax: "请输入正确传真号码"},
      remark: {required: "请简单描述",fax: "请输入正确传真号码"},
    }
    if(this.data.eventType === "个人预约" ){
      if(this.data.scene === "乒乓球馆"){
        delete rules.activeNumber;delete rules.remark;
        delete messages.activeNumber;delete messages.remark;
      }else{
        delete rules.tableNumber;delete rules.activeNumber;delete rules.remark;
        delete messages.tableNumber;delete messages.activeNumber;delete messages.remark;
      }
    }else{
      delete rules.tableNumber;delete rules.memberCard;
      delete messages.tableNumber;delete rules.memberCard;
    }
    // 创造飙到验证实例
    this.WxValidate = new WxValidate.WxValidate(rules,messages);
    console.log("wxV",this.WxValidate)
  },
  submitForm(e){
    let formData = e.detail.value;
    formData.tableNumber = this.data.tableNumber;
    formData.eventType = this.data.eventType;
    formData.scene = this.data.scene;
    formData.userId = this.data.userinfo.userId;
    console.log(formData)
    //验证规则 失败报错 成功请求后端
    if(!this.WxValidate.checkForm(formData)){
      const error = this.WxValidate.errorList[0];
      wx.showModal({
        title: error.msg,
        icon: 'error',
        duration: 2000
      });
    }else{
      util.request(api.SaveReserve,formData,'POST').then(function (res) {
        if(res.code == 200){
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
    }
  },
  bindSex: function(e) {
    let that = this;
    this.setData({
      sex: that.data.sexList[e.detail.value]
    })
  },
  bindDate: function(e) {
    wx.request({
      url: api.isFull,
      method: 'GET',
      data: {
        scene: this.data.scene,
        date: e.detail.value
      },
      success: function (res) {
        console.log(res)
        if(res.data.code == 200){
          wx.showModal({
            title: res.message,
            icon: 'success',
            duration: 2000
          });
        }else{
          wx.showModal({
            title: res.data.message,
            icon: 'error',
            duration: 2000
          });
        }
      },
    });
    this.setData({
      date: e.detail.value
    })
  },
  bindStart: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEnd: function(e) {
    wx.request({
      url: api.isFull,
      method: 'GET',
      data: {
        scene: this.data.scene,
        date: this.data.date,
        startTime: this.data.startTime+":00",
        endTime: e.detail.value+":00"
      },
      success: function (res) {
        if(res.data.code == 200){
          wx.showModal({
            title: res.message,
            icon: 'success',
            duration: 2000
          });
        }else{
          wx.showModal({
            title: res.data.message,
            icon: 'error',
            duration: 2000
          });
        }
      }
    });
    this.setData({
      endTime: e.detail.value
    })
  },
  bindTNumber: function(e) {
  },
  selectApply:function(e){
     this.setData({
      idx:e.currentTarget.dataset.number,
      tableNumber: this.data.tableList[e.currentTarget.dataset.id]
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      form: JSON.parse(options.form)
    })
    that.setData({
      eventType: this.data.form.eventType,
      scene: this.data.form.scene,
      idx: this.data.form.tableNumber,
      sex:this.data.form.sex,
      date : this.data.form.startTime.substring(0,this.data.form.startTime.indexOf(' ')),
      startTime : this.data.form.startTime.substring(this.data.form.startTime.indexOf(' '),this.data.form.startTime.length),
      endTime :  this.data.form.endTime.substring(this.data.form.endTime.indexOf(' '),this.data.form.endTime.length),
    })
    console.log("==============",this.data.form)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 明天
    var start = new Date();
    start.setTime(start.getTime()+24*60*60*1000);
    this.data.checkStartTime = start.getFullYear()+"-" + (start.getMonth()+1) + "-" + start.getDate();
    // 30天后
    var end = new Date();
    end.setTime(start.getTime()+30*24*60*60*1000);
    this.data.checkEndTime = end.getFullYear()+"-" + (end.getMonth()+1) + "-" + end.getDate();
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