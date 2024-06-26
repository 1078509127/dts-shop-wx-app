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
    userName:"",
    phone:"",
    sex:"",
    unit:"",
    memberCard:"",
    date:"",
    startTime:"12:00",
    endTime:"18:00",
    tableNumber:"",
    idx:"",
    activeNumber:"",
    remark:"",
    checkStartTime:"",
    checkEndTime:"",
    sexList: ['男', '女'],
    usedList: [],
    tableList:[
      {id: "0", number: "1号桌"},
      {id: "1", number: "2号桌"},
      {id: "2", number: "3号桌"},
      {id: "3", number: "4号桌"},
      {id: "4", number: "5号桌"},
      {id: "5", number: "6号桌"},
      {id: "6", number: "7号桌"},
      {id: "7", number: "8号桌"},
    ],
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
  },
  submitForm(e){
    var that = this;
    let formData = e.detail.value;
    formData.tableNumber = this.data.tableNumber;
    formData.eventType = this.data.eventType;
    formData.scene = this.data.scene;
    formData.userId = this.data.userinfo.userId;
    console.log("formData>>>>>",formData)
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
          user.authsubscribe();//接收订阅
          if(that.data.eventType === '团队预约'){
            wx.showModal({
              title: '团队预约成功',
              icon: 'success',
              duration: 2000,
              complete: function() {
                that.setData({
                  userName:"",
                  phone:"",
                  sex:"",
                  unit:"",
                  memberCard:"",
                  date:"",
                  startTime:"12:00",
                  endTime:"18:00",
                  tableNumber:"",
                  idx:"",
                  activeNumber:"",
                  remark:"",
                });
              },
            });
          }else{
            wx.showModal({
              title: '个人预约成功',
              icon: 'success',
              duration: 2000,
              complete: function() {
                that.setData({
                  userName:"",
                  phone:"",
                  sex:"",
                  unit:"",
                  memberCard:"",
                  date:"",
                  startTime:"12:00",
                  endTime:"18:00",
                  tableNumber:"",
                  idx:"",
                  activeNumber:"",
                  remark:"",
                });
              },
            });
          }
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
      url: api.IsFull,
      method: 'GET',
      data: {
        scene: this.data.scene,
        date: e.detail.value
      },
      success: function (res) {
        console.log(res.data)
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
      url: api.IsFull,
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
    if(this.data.scene === '乒乓球馆'){
      this.getTableList();
    }
  },

  //点击结束时间获取已使用桌号
  getTableList:function(){
    var that = this
    util.request(
      api.GetTableList,
      {scene:this.data.scene,date:this.data.date,startTime:this.data.startTime,endTime:this.data.endTime},
      'GET'
    ).then(function (res) {
      if(res.code == 200){
        that.setData({
          usedList: res.data
        })
      }
    })
  },
  bindTNumber: function(e) {
  },
  selectApply:function(e){
    console.log(e)
     this.setData({
      idx:e.currentTarget.dataset.id,
      tableNumber: this.data.tableList[e.currentTarget.dataset.id].number
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      eventType: options.eventType,
      scene:options.scene
    })
    this.data.userinfo = wx.getStorageSync('userInfo');
    this.initValidate();
    console.log("跳转带过来的参数：==",this.data.eventType,this.data.scene)

    // 明天
    var start = new Date();
    start.setTime(start.getTime()+24*60*60*1000);
    this.setData({
      checkStartTime: start.getFullYear()+"-" + (start.getMonth()+1) + "-" + start.getDate()
    })
    // 15天后
    var end = new Date();
    end.setTime(start.getTime()+15*24*60*60*1000);
    this.setData({
      checkEndTime: end.getFullYear()+"-" + (end.getMonth()+1) + "-" + end.getDate()
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