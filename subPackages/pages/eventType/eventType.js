// pages/eventType/eventType.js 
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const WxValidate = require('../../utils/WxValidate.js');
//  const { timePanelSharedProps } = require('element-plus/es/components/time-picker/src/props/shared');
// const { raycast } = require('XrFrame/physics/raycast');

//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: "",
    eventType: "",
    scene: "",
    userName: "",
    phone: "",
    sex: "",
    unit: "",
    memberCard: "",
    date: "",
    startTime: "15:00",
    endTime: "20:00",
    tableNumber: "",
    idx: "",
    activeNumber: "",
    remark: "",
    checkStartTime: "",
    checkEndTime: "",
    sexList: ['男', '女'],
    usedList: [],
    tableList: [{
        id: "0",
        number: "1号桌"
      },
      {
        id: "1",
        number: "2号桌"
      },
      {
        id: "2",
        number: "3号桌"
      },
      {
        id: "3",
        number: "4号桌"
      },
      {
        id: "4",
        number: "5号桌"
      },
    ],
    onShow:true,
  },

  initValidate() {
    const rules = {
      userName: { required: true},
      phone: {required: true,tel: true},
      sex: { required: true},
      unit: {required: true},
      memberCard: { required: true},
      date: { required: true},
      startTime: { required: true},
      endTime: {required: true},
      tableNumber: {required: true},
      activeNumber: {required: true},
      remark: {required: true}
    }
    const messages = { //提示信息
      userName: {
        required: "请输入姓名",
        fax: "请输入正确的姓名"
      },
      phone: {
        required: "请输入手机号",
        tel: "请输入正确的手机号"
      },
      sex: {
        required: "请选择性别",
      },
      unit: {
        required: "请输入工作单位",
      },
      memberCard: {
        required: "请输入会员卡号",
      },
      date: {
        required: "请选择日期",
      },
      startTime: {
        required: "请选择开始时间",
      },
      endTime: {
        required: "请选择结束时间",
      },
      tableNumber: {
        required: "请选择桌号",
      },
      activeNumber: {
        required: "请输入活动人数",
      },
      remark: {
        required: "请简单描述",
      },
    }

    if (this.data.eventType === "个人预约") {
      if (this.data.scene === "乒乓球馆") {
        delete rules.activeNumber;
        delete rules.remark;
        delete messages.activeNumber;
        delete messages.remark;
      } else {
        delete rules.tableNumber;
        delete rules.activeNumber;
        delete rules.remark;
        delete messages.tableNumber;
        delete messages.activeNumber;
        delete messages.remark;
      }
    } else {
      // 开始时间不显示提示
      delete messages.startTime;
      delete messages.endTime;
      delete rules.startTime;
      delete rules.endTime;
      //end 时间不显示提示
      delete rules.tableNumber;
      delete rules.memberCard;
      delete messages.tableNumber;
      delete rules.memberCard;
    }
    // 创造飙到验证实例
    this.WxValidate = new WxValidate.WxValidate(rules, messages);
  },
  submitForm(e) {
    var that = this;
    let formData = e.detail.value;
    formData.tableNumber = this.data.tableNumber;
    formData.eventType = this.data.eventType;
    formData.scene = this.data.scene;
    formData.userId = this.data.userinfo.userId;
    console.log("formData>>>>>", formData)
    //验证规则 失败报错 成功请求后端
    if(this.data.eventType == '个人预约'){
      // 会员卡号判断
      if(formData.memberCard.length>16|| formData.memberCard.length<16){
       
          wx.showToast({
            title: '请输入16位会员卡号',
            icon: 'none'
          })
          return
        }
        
      const validate = this.validateTime(this.data.startTime, this.data.endTime);
      if (validate != null) {
        wx.showModal({title: validate,icon: 'error',duration: 2000 });
        return ;
      }
    }
    if (!this.WxValidate.checkForm(formData)) {
      const error = this.WxValidate.errorList[0];
      wx.showModal({title: error.msg,icon: 'error',duration: 2000});
      return;
    }
    //预约按钮 ==团队type
    if (that.data.eventType === '团队预约') {
      // 活动人数数字check
      
      if (/[\u3400-\u4dbf\u4e00-\u9fff]+/g.test(formData.activeNumber)== true) {
          wx.showModal({
            title: '活动人数请输入数字',
            icon: 'error',
            duration: 2000,
          })
          return;
      }else{
        // 预约活动人数flag ==flase 超出标准预约人数
       var activeNumflag =  this.activeNum(formData.activeNumber)
      if(activeNumflag == false){
        return;
      }
      }
      
      util.request(api.TeamReserve, formData, 'POST').then(function (res) {
        if (res.code == 200) {
          if (that.data.eventType === '团队预约') {
            wx.showModal({
              title: '团队预约成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                that.setData({
                  userName: "",
                  phone: "",
                  sex: "",
                  unit: "",
                  memberCard: "",
                  date: "",
                  tableNumber: "",
                  idx: "",
                  activeNumber: "",
                  remark: "",
                });
              },
            });
          } else {
            wx.showModal({
              title: '个人预约成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                that.setData({
                  userName: "",
                  phone: "",
                  sex: "",
                  unit: "",
                  memberCard: "",
                  date: "",
                  startTime: "12:00",
                  endTime: "18:00",
                  tableNumber: "",
                  idx: "",
                  activeNumber: "",
                  remark: "",
                });
              },
            });
          }
        } else {
          wx.showModal({
            title: res.message,
            icon: 'error',
            duration: 2000
          });
        }
      })
    } else {
      //个人预约
      util.request(api.SaveReserve, formData, 'POST').then(function (res) {
        if (res.code == 200) {
          if (that.data.eventType === '团队预约') {
            wx.showModal({
              title: '团队预约成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                that.setData({
                  userName: "",
                  phone: "",
                  sex: "",
                  unit: "",
                  memberCard: "",
                  date: "",
                  startTime: "12:00",
                  endTime: "18:00",
                  tableNumber: "",
                  idx: "",
                  activeNumber: "",
                  remark: "",
                });
              },
            });
          } else {
            wx.showModal({
              title: '个人预约成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                that.setData({
                  userName: "",
                  phone: "",
                  sex: "",
                  unit: "",
                  memberCard: "",
                  date: "",
                  startTime: "12:00",
                  endTime: "18:00",
                  tableNumber: "",
                  idx: "",
                  activeNumber: "",
                  remark: "",
                });
              },
            });
          }
        } else {
          wx.showModal({
            title: res.message,
            icon: 'error',
            duration: 2000
          });
        }
      })
    }
  },

  bindSex: function (e) {
    let that = this;
    this.setData({
      sex: that.data.sexList[e.detail.value]
    })
  },
// 会员卡号的16位
  bindCard:function(e){
    let that = this;
  
    console.log(that.data.memberCard)
    console.log(e.detail.value)
    // if(e.detail.value.length<16 ||e.detail.value.length>16){
    //     setTimeout(() => {
    //     wx.showToast({
    //       title: '请输入16位会员卡号',
    //       icon: 'none'
    //     })
    //     return
    //   }, 1000);
    //   return
    //   }
      if(e.detail.value.length == 16){
         this.setData({
            memberCard:e.detail.value
        })
      }
  
  },
  //输入活动预约人数check
 NumCheck: function (type, rsNum, MaxNum) {
    if (!rsNum) {
        wx.showToast({
          title: '只能输入数字' + type + '最多预约' + MaxNum + '人',
          icon: 'none'
        })
      return;

    } else {
      if (Number(rsNum) > MaxNum) {
        // setTimeout(() => {
          wx.showToast({
            title: '只能输入数字' + type + '最多预约' + MaxNum + '人',
            icon: 'none'
          })
        // }, 1000);
        return false;
      }
    }

  },
  //活动人数
   activeNum: function (e) {
    
    var type = this.data.scene //活动室类型
    var regNum = new RegExp('[0-9]', 'g');
    if(typeof e === 'string'){
      var rsNum = regNum.exec(e);
    }else{
      var rsNum = regNum.exec(e.detail.value);
    }
    switch (type) {
      case '微机室':
        var activeNumflag =   this.NumCheck(type, rsNum.input, 30)
        return activeNumflag;
        break;
      case '瑜伽室':
        var activeNumflag = this.NumCheck(type, rsNum.input, 15)
        return activeNumflag;
        break;
      case '书法室':
        var activeNumflag =  this.NumCheck(type, rsNum.input, 20)
        return activeNumflag;
        break;
      case '录音教室':
        var activeNumflag =  this.NumCheck(type, rsNum.input, 15)
        return activeNumflag;
        break;
      case '烘培室':
       var activeNumflag = this.NumCheck(type, rsNum.input, 30)
       return activeNumflag;
        break;
      default:

    }

  },

  bindDate: function (e) {
    if (this.data.eventType == '个人预约') {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekday = new Date(e.detail.value).getDay();
      const week = weekdays[weekday]
      if (week == '周一' || week == '周二') {
        wx.showModal({
          title: '开放时间为：星期三 至 星期日',
          icon: 'error',
          duration: 2000
        });
        return;
      }
      wx.request({
        url: api.IsFull,
        method: 'GET',
        data: {
          scene: this.data.scene,
          userId: this.data.userinfo.userId,
          eventType: this.data.eventType,
          date: e.detail.value
        },
        success: function (res) {
          if (res.data.code == 200) {
            wx.showModal({
              title: res.message,
              icon: 'success',
              duration: 2000
            });
          } else {
            wx.showModal({
              title: res.data.message,
              icon: 'error',
              duration: 2000
            });
          }
        },
      });
    } else {
      //团队预约接口
      if (this.data.eventType == '团队预约') {
        wx.request({
          url: api.teamisFull,
          method: 'GET',
          data: {
            eventType: this.data.eventType,
            scene: this.data.scene,
            date: e.detail.value
          },
          success: function (res) {
            if (res.data.code == 200) {
              wx.showModal({
                title: res.message,
                icon: 'success',
                duration: 2000
              });
            } else {
              wx.showModal({
                title: '此日已预约，请选择其他日期',
                icon: 'error',
                duration: 2000
              });
            }
          },
        });
      }
    }
    this.setData({
      date: e.detail.value
    })
    if (this.data.scene === '乒乓球馆') {
      this.getTableList();
    }
  },

  bindStart: function (e) {
    let selectedTime = e.detail.value;
    let minute = parseInt(selectedTime.split(':')[1]);
    if (minute!== 0) {
      wx.showToast({
        title: '请选择整点时间',
        icon: 'none'
      });
      return;
    }
    this.setData({startTime: e.detail.value})
    if (this.data.scene === '乒乓球馆') {
      this.getTableList();
    }
  },
  bindEnd: function (e) {
    let selectedTime = e.detail.value;
    let minute = parseInt(selectedTime.split(':')[1]);
    if (minute!== 0) {
      wx.showToast({
        title: '请选择整点时间',
        icon: 'none'
      });
      return;
    }
    this.setData({ endTime: e.detail.value})
    if (this.data.scene === '乒乓球馆') {
      this.getTableList();
    }
  },
  //时间间隔
  validateTime: function (startTimeStr, endTimeStr) {
    // 将时间字符串转换为分钟数
    const [startHour, startMinute] = startTimeStr.split(':').map(Number);
    const [endHour, endMinute] = endTimeStr.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    // 检查结束时间是否大于等于开始时间
    if (endTotalMinutes <= startTotalMinutes) {
      return "结束时间不能小于开始时间";
    }
    // 检查时间间隔是否不大于两小时（120 分钟）
    const timeDifference = endTotalMinutes - startTotalMinutes;
    if (timeDifference > 120) {
      return "预约时间不能超过两个小时";
    }
    return null;
  },
  //点击结束时间获取已使用桌号
  getTableList: function () {
    var that = this
    util.request(api.GetTableList, {
        scene: this.data.scene,
        date: this.data.date,
        startTime: this.data.startTime,
        endTime: this.data.endTime
      },
      'GET').then(function (res) {
      if (res.code == 200) {
        that.setData({
          usedList: res.data
        })
      }
    })
  },
  bindTNumber: function (e) {},
  selectApply: function (e) {
    this.setData({
      idx: e.currentTarget.dataset.id,
      tableNumber: this.data.tableList[e.currentTarget.dataset.id].number
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
      onShow:app.globalData.isExamine,
      eventType: options.eventType,
      scene: options.scene,
      userinfo: wx.getStorageSync('userInfo')
    })
    console.log("跳转带过来的参数：==", this.data.eventType, this.data.scene)
    this.initValidate();
    this.astrictTime();
  },

  //健身房和团队预约时间限制不同
  astrictTime: function () {
    var start = ''
    var end = ''
    var sDate = new Date();
    var eDate = new Date();
    if (this.data.scene == '乒乓球馆') {
      sDate.setTime(sDate.getTime() + 24 * 60 * 60 * 1000);
      start = sDate.getFullYear() + "-" + (sDate.getMonth() + 1) + "-" + sDate.getDate();

      eDate.setTime(eDate.getTime() + 2 * 24 * 60 * 60 * 1000);
      end = eDate.getFullYear() + "-" + (eDate.getMonth() + 1) + "-" + eDate.getDate();
    } else {
      sDate.setTime(sDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      start = sDate.getFullYear() + "-" + (sDate.getMonth() + 1) + "-" + sDate.getDate();

      eDate.setTime(eDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      end = eDate.getFullYear() + "-" + (eDate.getMonth() + 1) + "-" + eDate.getDate();
    }
    this.setData({
      checkStartTime: start,
      checkEndTime: end
    })
  },

  /** 预约时查询是否预约过，直接回显部分字段 */
  getData: function () {
    util.request(api.Echo, {
      userId: this.data.userinfo.userId,
      eventType: this.data.eventType
    }, 'GET').then(res => {
      if (res.data.length > 0) {
        const datas = res.data[0];
        const that = this;
        that.setData({
          userName: datas.userName,
          phone: datas.phone,
          sex: datas.sex,
          unit: datas.unit,
          memberCard:datas.memberCard
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