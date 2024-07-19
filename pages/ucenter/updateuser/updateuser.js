var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasLogin: false,
    userSharedUrl: '',


    username: '',
    mobile: '',
    userid:'',

  },

  /**
      * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    let that = this;
    //获取用户的登录信息
    let userInfo = wx.getStorageSync('userInfo');
    debugger
    this.setData({
      userInfo: userInfo,
      hasLogin: true
    });
    //如果无分享推广码,则需要获取分享二维码
    if (this.data.hasLogin && this.data.userSharedUrl == '') {
      that.getUserSharedUrl();
    }
  },
  getUserSharedUrl: function () {
    let that = this;
    util.request(api.GetSharedUrl).then(function (res) {
      that.setData({
        userSharedUrl: res.data.userSharedUrl
      });
    });
  },
  applyAgency: function () {
    let that = this;
    if (!this.data.hasLogin) {
      wx.showToast({
        title: '绑定失败：请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!this.data.userInfo.phone || this.data.userInfo.phone.length == 0) {
        wx.showToast({
          title: '绑定失败：请先绑定手机号',
          icon: 'none',
          duration: 3000
        });
        return;
     }
    
    util.request(api.ApplyAgency, { desc: "代理申请" }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let userInfo = wx.getStorageSync('userInfo');
        userInfo.status = 3;//设置用户的状态为申请代理中...
        wx.setStorageSync('userInfo', userInfo);
        that.setData({
          userInfo: userInfo,
          hasLogin: true
        });
        wx.showToast({
          title: '申请成功，等待管理员审批',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },
  getPhoneNumber: function (e) {
    let that = this;
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }

    if (!this.data.hasLogin) {
      wx.showToast({
        title: '绑定失败：请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    util.request(api.AuthBindPhone, {
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let userInfo = wx.getStorageSync('userInfo');
        userInfo.phone = res.data.phone;//设置手机号码
        wx.setStorageSync('userInfo', userInfo);
        that.setData({
          userInfo: userInfo,
          hasLogin: true
        });
        wx.showToast({
          title: '绑定手机号码成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },
  // 保存推广码到相册
  saveShare: function () {
    let that = this;
    wx.downloadFile({
      url: that.data.userSharedUrl,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showModal({
              title: '推广码下载',
              content: '推广二维码成功保存到相册!!',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#a78845',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          },
          fail: function (res) {
            console.log('fail')
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    })
  },
  upuserInfo: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '确认修改？',
      success: function (res) {
        if (!res.confirm) {
          return;
        }
        
        // util.request(api.AuthRegister, {
        //   data: {
        //   username: that.data.username,
        //   mobile: that.data.mobile,
        //   userid:userInfo.userId.toLocaleString()
        
        // },}, 'POST');
        // 点击确认修改
        wx.request({
          url: api.AuthRegister,
          data: {
            username: that.data.username,
            mobile: that.data.mobile,
            userid:userInfo.userId.toLocaleString()
           
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            if (res.data.errno == 0) {
              app.globalData.hasLogin = true;
              wx.setStorageSync('userInfo', res.data.data.userInfo);
              wx.setStorageSync('register',true);
              wx.switchTab({
                 url: '/pages/ucenter/index/index'
               });
              // wx.setStorage({
              //   key: "token",
              //   data: res.data.data.token,
              //   success: function() {
              //     wx.navigateTo({
              //       url: '/pages/ucenter/index/index'
              //     });
              //   }
              // });
            } else {
              wx.showModal({
                title: '错误信息',
                content: res.data.errmsg,
                showCancel: false
              });
            }
          }
        });
        
       
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    })
  },





  bindUsernameInput: function(e) {
    if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(e.detail.value))) { 
          wx.showToast({ title: '请输入中文/英文名字', duration: 2000, icon: true });     
          return ; 
        }
    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function(e) {
    if (!(/^1[345768]\d{9}$/.test(e.detail.value.phone))) {
           wx.showToast({ title: '手机号码有误', duration: 2000, icon:'none' });    
            return 
           }
    this.setData({
      password: e.detail.value
    });
  },
})
 
