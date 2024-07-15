var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hideModal:true, //模态框的状态  true-隐藏  false-显示
    canIUseGetUserProfile: false, // 2.27之前用于向前兼容
    showPop: false,
      userInfo: {
        nickName: '点击登录',
        avatarUrl: '/static/images/avatar.png'
      },
      order: {
        unpaid: 0,
        unship: 0,
        unrecv: 0,
        uncomment: 0
      },
    MyMenus: [
      // { url: "/pages/ucenter/collect/collect", pic:"icon_collect.png",name:"商品收藏"},
      // { url: "/pages/ucenter/footprint/footprint", pic: "footprint.png", name: "浏览足迹" },
      // { url: "/pages/groupon/myGroupon/myGroupon", pic: "group.png", name: "我的拼团" },
      // { url: "/pages/ucenter/address/address", pic: "address.png", name: "地址管理" },
      { url: "/pages/ucenter/feedback/feedback", pic: "feedback.png", name: "意见反馈" },
      { url: "/pages/about/about", pic: "about_us.png", name: "关于我们" },
      // { url: "/pages/ucenter/feedback/feedback", pic: "cg.png", name: "查看场馆" },

      // *,{ url: "/pages/about/about", pic: "comment.png", name: "使用帮助" }
      ],
       MyMenus2: [
      //   // { url: "/pages/ucenter/collect/collect", pic:"icon_collect.png",name:"商品收藏"},
      //   // { url: "/pages/ucenter/footprint/footprint", pic: "footprint.png", name: "浏览足迹" },
      //   // { url: "/pages/groupon/myGroupon/myGroupon", pic: "group.png", name: "我的拼团" },
      //   // { url: "/pages/ucenter/address/address", pic: "address.png", name: "地址管理" },
         { url: "/pages/ucenter/feedback/feedback", pic: "cg.png", name: "查看场馆" },
        
      //   // *,{ url: "/pages/about/about", pic: "comment.png", name: "使用帮助" }
         ],
      hasLogin: false,
      totalAmount: 0.00
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
      fail: (res) => {
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

  /**
   * 页面跳转
  */
  goPages:function(e){
    console.log();
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    } else {
      let that=this
    that.setData({
        hideModal:false
    })
      // wx.navigateTo({
      //   url: "/pages/auth/login/login"
      // });
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  onShow:function(){
    //获取用户的登录信息
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      });

      let that = this;
      util.request(api.UserIndex).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            order: res.data.order,
            totalAmount: res.data.totalAmount,
            remainAmount: res.data.remainAmount,
            couponCount: res.data.couponCount
          });
        }
      });
    }
  },
  //模态框确定绑定
  confirm:function(e){
    this.getUserProfile(e);
    //this.wxLogin(e)

  },
  cancel:function(e){
  let thst=this;
  thst.setData({
    hideModal:true
  })
  },
  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload: function () {

  },
  goLogin() {
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goBrokerage() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/brokerage/main/main"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  gogymnasiumDetail(e) {
    let eventType = e.currentTarget.dataset.eventtype;
    if (this.data.hasLogin) {
      try {
        wx.setStorageSync('tab', '0');
      } catch (e) {}
      wx.navigateTo({
        url: "/pages/ucenter/gymnasiumDetail/gymnasiumDetail?eventType="+eventType
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goOrder(e) {
      let eventType = e.currentTarget.dataset.eventtype;
      if (this.data.hasLogin) {
        try {
          wx.setStorageSync('tab', '0');
        } catch (e) {
        }
        wx.navigateTo({
          url: "/pages/ucenter/order/order?eventType="+eventType
        });
      } else {
        wx.navigateTo({
          url: "/pages/auth/login/login"
        });
      }
    },
  goOrderIndex(e) {
    if (this.data.hasLogin) {
      let tab = e.currentTarget.dataset.index
      let route = e.currentTarget.dataset.route
      try {
        wx.setStorageSync('tab', tab);
      } catch (e) {

      }
      wx.navigateTo({
        url: route,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goAfterSale: function () {
    wx.showToast({
      title: '目前不支持',
      icon: 'none',
      duration: 2000
    });
  }
})