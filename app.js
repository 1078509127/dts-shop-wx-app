var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./utils/user.js');

App({
  onLaunch: function() {
    const updateManager = wx.getUpdateManager();
    wx.getUpdateManager().onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  onShow: function(options) {
    user.checkLogin().then(res => {
      this.globalData.hasLogin = true;
    }).catch(() => {
      this.globalData.hasLogin = false;
    });
  },
  onLaunch:function(options){
    const accountInfo = wx.getAccountInfoSync();
    //accountInfo.miniProgram.envVersion = 'release'; //上线审核的时候就注释掉这段代码，开发时就保留
    if (accountInfo.miniProgram.envVersion === 'release') {
      this.globalData.isExamine = false
    } else {
      this.globalData.isExamine = true;
    }
  },
  globalData: {
    hasLogin: false,
    isExamine: true
  }
})