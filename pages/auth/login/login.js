var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');

var app = getApp();
Page({
  data: {
    canIUseGetUserProfile: false, // 2.27之前用于向前兼容
    showPop: false,
  },
   getUserProfile(e) {
        wx.getUserProfile({
          desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            wx.showLoading({
              title: "登录中...",
              mask: true
            });
            user.checkLogin().catch(() => {
              user.loginByWeixin(res.userInfo).then(res => {
                user.authsubscribe();
                app.globalData.hasLogin = true;
                if (app.globalData.hasLogin == true) {
                  let userInfo = wx.getStorageSync('userInfo');
                  if (userInfo.register !=1) {//0未注册1已注册
                    wx.navigateTo({
                      url: "/pages/auth/register/register"
                    })
                  }else{
                    wx.navigateTo({
                      url: '/pages/index/index',
                    })
                  }

                }else{
                  wx.navigateBack({delta: 1 })
                }


              }).catch((err) => {
                app.globalData.hasLogin = false;
                util.showErrorToast('微信登录失败');
              });
            });
          },
          fail: (res) => {
            console.log(res)
            app.globalData.hasLogin = false;
            util.showErrorToast('微信登录失败');
          }
        });
      },
  wxLogin: function(e) {
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      util.showErrorToast('微信登录失败');
      return;
    }
    user.checkLogin().catch(() => {
      user.loginByWeixin(e.detail.userInfo).then(res => {
        app.globalData.hasLogin = true;
        wx.navigateBack({
          delta: 1
        })
      }).catch((err) => {
        app.globalData.hasLogin = false;
        util.showErrorToast('微信登录失败');
      });
    });
  },
  onLoad: function(options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // const privacySettingRes = this.getPrivacySetting();
    // console.log("privacySettingRes :>> ", privacySettingRes);
    // this.setData({
    //   showPop: privacySettingRes.needAuthorization,
    // });
  },
  
  /**
   * 获取隐私协议授权信息
   * @returns {object} {needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》'}
   */
  getPrivacySetting() {
    const res = {
      needAuthorization: false,
      privacyContractName: "基础库过低，不需要授权",
    };
    if (!wx.getPrivacySetting) return res;
    return new Promise((resolve, reject) => {
      wx.getPrivacySetting({
        success(res) {
          console.log(" 获取隐私协议授权信息成功",res)
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  },
  /**
   * 按钮点击回调
   */
  popBtnTap(res) {
    console.log("授权结果返回数据 :>> ", res);
    console.log("授权结果 :>> ", res.detail);
    if (res.detail.result) {
      wx.showToast({
        title: "同意授权",
        icon: "success",
      });
    } else {
      wx.showToast({
        title: "拒绝授权",
        icon: "error",
      });
    }
  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  
  accountLogin: function() {
    wx.navigateTo({
      url: "/pages/auth/accountLogin/accountLogin"
    });
  }
})