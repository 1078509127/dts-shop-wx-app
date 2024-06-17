/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    wx.checkSession({
      success: function() {
        resolve(true);
      },
      fail: function() {
        reject(false);
      }
    })
  });
}

/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {
  let shareUserId = wx.getStorageSync('shareUserId');
  if (!shareUserId || shareUserId =='undefined'){
    shareUserId = 1;
  }
  return new Promise(function(resolve, reject) {
    return login().then((res) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, {
        code: res.code,
        userInfo: userInfo,
        shareUserId: shareUserId
      }, 'POST').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.data.token);
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function(resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}

/**
 * 获取用户订阅授权
 */
function authsubscribe(){
  wx.getSetting({
    withSubscriptions: true,   //  这里设置为true,下面才会返回mainSwitch
    success: function(res){  
      // 调起授权界面弹窗
      if (res.subscriptionsSetting.mainSwitch) {  // 用户打开了订阅消息总开关
        if (res.subscriptionsSetting.itemSettings != null) {   // 用户同意总是保持是否推送消息的选择, 这里表示以后不会再拉起推送消息的授权
          let moIdState = res.subscriptionsSetting.itemSettings['FAapMIqVsN3El4ONaIeHha1B0LHuYkJE4yCzLnCvMvk'];  // 用户同意的消息模板id
          const status = res.subscriptionsSetting.itemSettings['FAapMIqVsN3El4ONaIeHha1B0LHuYkJE4yCzLnCvMvk'].status; // 检查特定模板的订阅状态
          if(moIdState === 'accept'){   
            console.log('接受了消息推送');
          }else if(moIdState === 'reject'){
            console.log("拒绝消息推送");
          }else if(moIdState === 'ban'){
            console.log("已被后台封禁");
          }else{
            console.log("默认状态，未做选择");
          }
        }else {
          // 当用户没有点击 ’总是保持以上选择，不再询问‘  按钮。那每次执到这都会拉起授权弹窗
          wx.showModal({
            title: '提示',
            content:'请授权开通服务通知',
            showCancel: true,
            success: function (ress) {
              if (ress.confirm) {  
                wx.requestSubscribeMessage({   // 调起消息订阅界面
                  tmplIds: ['FAapMIqVsN3El4ONaIeHha1B0LHuYkJE4yCzLnCvMvk'],
                  success (res) { 
                    console.log('订阅消息 成功 ',res);
                  },
                  fail (res){
                    console.log();
                    console.log("订阅消息 失败 ",res);
                  }
                })     
              }
            },
            fail(ress){
              console.log(ress)
            }
          })
        }
      }else {
        console.log('订阅消息未开启')
      }      
    },
    fail: function(error){
      console.log(error);
    },
  })
}

module.exports = {
  loginByWeixin,
  checkLogin,
  authsubscribe,
};