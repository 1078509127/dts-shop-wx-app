// pages/eventType/eventType.js 
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const WxValidate = require('../../utils/WxValidate.js');
var startTime=''

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
    startTime:"15:00",
    endTime:"20:00",
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
      // 开始时间不显示提示
      delete messages.startTime; delete messages.endTime;
      delete rules.startTime; delete rules.endTime;
      //end 时间不显示提示
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
      //预约按钮 ==团队type
      if(that.data.eventType === '团队预约'){
        util.request(api.TeamReserve,formData,'POST').then(function (res) {
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
                    // startTime:"12:00",
                    // endTime:"18:00",
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
      }else{
        //个人预约
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
    }
  },

  bindSex: function(e) {
    let that = this;
    this.setData({
      sex: that.data.sexList[e.detail.value]
    })
  },
  //输入活动预约人数check
  NumCheck:function(type,rsNum,MaxNum){
    if(!rsNum){
      setTimeout(()=>{
         wx.showToast({
             title: '只能输入数字'+type+'最多预约'+MaxNum+'人',
             icon: 'none'
         })
         return
     },1000);
     
   }else{
     if(Number(rsNum.input)>MaxNum){
       setTimeout(()=>{
         wx.showToast({
             title: '只能输入数字'+type+'最多预约'+MaxNum+'人',
             icon: 'none'
         })
         return
     },1000);
     }
   }

  },
  //活动人数
  activeNum:function(e){
    var type = this.data.scene//活动室类型
    var regNum=new RegExp('[0-9]','g');
    var rsNum=regNum.exec(e.detail.value);
  switch(type) {
      case '微机室':
        this.NumCheck(type,rsNum,30)
         break;
      case '瑜伽室':
        this.NumCheck(type,rsNum,15)
         break;
      case '书法室':
        this.NumCheck(type,rsNum,20)
        break;
      case '录音教室':
        this.NumCheck(type,rsNum,15)
        break;
      case '烘培室':
        this.NumCheck(type,rsNum,30)
        break;
      default:
         
    }

  },
  bindDate: function(e) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = new Date(e.detail.value).getDay();
    const week = weekdays[weekday]
    if(week == '周一' || week == '周二'){
      wx.showModal({
        title: '开放时间为：星期三 至 星期日',
        icon: 'error',
        duration: 2000
      });
    }else{
      //团队预约接口
      if(this.data.eventType=='团队预约'){
        wx.request({
          url: api.teamisFull,
          method: 'GET',
          data: {
            eventType:this.data.eventType,
            scene: this.data.scene,
            date: e.detail.value
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
          },
        });
      }else{
        //个人预约接口
        wx.request({
          url: api.IsFull,
          method: 'GET',
          data: {
            eventType:this.data.eventType,
            scene: this.data.scene,
            date: e.detail.value
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
          },
        });
      }
      
      this.setData({
        date: e.detail.value
      })
    }
  },
  
  bindStart: function(e) {
    const validate = this.validateTime(e.detail.value,this.data.endTime);
    if(validate != null){
      wx.showModal({
        title: validate,
        icon: 'error',
        duration: 2000
      });
    }else{
      this.setData({
        startTime: e.detail.value
      })
    }
  },
  bindEnd: function(e) {
    const validate = this.validateTime(this.data.startTime,e.detail.value);
    if(validate != null){
      wx.showModal({
        title: validate,
        icon: 'error',
        duration: 2000
      });
    }else{
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
    }
  },
  //时间间隔
  validateTime:function(startTimeStr, endTimeStr) {
  // 将时间字符串转换为分钟数
  const [startHour, startMinute] = startTimeStr.split(':').map(Number);
  const [endHour, endMinute] = endTimeStr.split(':').map(Number);
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  // 检查结束时间是否大于等于开始时间
  if (endTotalMinutes <= startTotalMinutes) {
    return "结束时间不能小于等与开始时间";
  }
  // 检查时间间隔是否不大于两小时（120 分钟）
  const timeDifference = endTotalMinutes - startTotalMinutes;
  if (timeDifference > 120) {
    return "预约时间不能超过过两格小时";
  }
  return null;
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
    //健身房和团队预约时间限制不同
    let now = new Date();
    let later = new Date(now);//开始周
    let mon = new Date(now);// 结束
    let time2="";
    let timeMon="";

    var date = new Date();
    var start = ''
    var end = ''
    if(this.data.scene == '乒乓球馆'){
      let now = new Date(),
      time1=now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
      later.setDate(now.getDate());//当前日开始
      mon.setDate(now.getDate() + 2);//2天
      time2 = later.getFullYear() + "-" + (later.getMonth() +1 ) + "-" + later.getDate();
      timeMon = mon.getFullYear() + "-" + (mon.getMonth() +1 ) + "-" + mon.getDate();
    }else{

      let now = new Date(),
      time1=now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();

      //获取一周后日期
      later.setDate(now.getDate() + 7);//1周
      mon.setDate(now.getMonth() +2);//1月
       time2 = later.getFullYear() + "-" + (later.getMonth() +1 ) + "-" + later.getDate();
       timeMon = mon.getFullYear() + "-" + (mon.getMonth() +2 ) + "-" + mon.getDate();
    }
      this.setData({checkStartTime: time2})
      this.setData({checkEndTime: timeMon})
  },

  /** 预约时查询是否预约过，直接回显部分字段 */
  getData:function(){
    util.request(api.SelReserve,{userId:this.data.userinfo.userId,eventType:this.data.eventType},'GET').then(res => {
      if(res.data.length>0){
        const datas = res.data[0];
        const that = this;
        that.setData({
          userName:datas.userName,
          phone : datas.phone,
          sex : datas.sex,
          unit : datas.unit,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})