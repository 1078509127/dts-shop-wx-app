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
    MyMenus: [ { url: "/pages/ucenter/feedback/feedback", pic: "feedback.png", name: "意见反馈" },],
       MyMenus2: [
         { url: "/pages/ucenter/gymnasiumDetail/gymnasiumDetail", pic: "健身房.png", name: "健身房"},
         { url: "/pages/ucenter/pingpong/pingpong", pic: "ppq.png", name: "乒乓球馆"},
         { url: "/pages/ucenter/libraryroom/libraryroom", pic: "图书馆-copy-copy (1).png", name: "图书馆"},
         { url: "/pages/ucenter/microcomPuter/microcomPuter", pic: "2.png", name: "微机室"},
         { url: "/pages/ucenter/yoga/yoga", pic: "运动6.png", name: "瑜伽室"},
         { url: "/pages/ucenter/calligraphy/calligraphy", pic: "钢笔 修改 (1).png", name: "书法室"},
         { url: "/pages/ucenter/recording/recording", pic: "17.png", name: "录音室"},
         { url: "/pages/ucenter/Bakingroom/Bakingroom", pic: "26-Blueberry Muffins.png", name: "烘培室"},

         ],
      hasLogin: false,
      totalAmount: 0.00,
      managerList:[
        {id: 1,name: "预约查询",iconUrl: "../../../static/images/hetongguanli.png"},
        {id: 2,name: "留言查看",iconUrl: "../../../static/images/a-2shouhouzerenweihu.png"},
        {id: 3,name: "公告管理",iconUrl: "../../../static/images/huiqianguanli.png"},
        {id: 4,name: "活动推送",iconUrl: "../../../static/images/a-2pandiandaochu.png"},
        { id: 5,name: "轮播图配置",iconUrl: "../../../static/images/xiaoguotuguanli.png" },
        {id: 6,name: "关闭预约通道",iconUrl: "../../../static/images/a-2kuanshigongxu.png"},
        {id: 7,name: "二维码生成", iconUrl: "../../../static/images/二维码.png" },
      ],
      name: "",
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
    console.log(1);
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    } else {
      let that=this
    that.setData({
        hideModal:false
    })
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  upUser:function(){
    const userInfo =  wx.getStorageSync('userInfo');
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }else{
    wx.navigateTo({
      url:  "/pages/ucenter/updateuser/updateuser",
    });
   
    }

  },
  scanBtn:function(){
    const userInfo =  wx.getStorageSync('userInfo');
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }else{
      wx.scanCode({
        success (res) {
          wx.request({
            url: api.Scan,
            data:{userId:userInfo.userId,scene:res.result},
            method: 'GET',
            success(res){
              wx.showModal({
                title: res.data.message,
                icon: 'success',
                duration: 2000
              });
            },
            fail(res){
              wx.showModal({
                title: res.data.message,
                icon: 'error',
                duration: 2000
              });
            }
          })
        },fail: (err) => {
          console.error('扫描失败', err);
        }
      })
    }
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

    //   let that = this;
    //   util.request(api.UserIndex).then(function (res) {
    //     if (res.errno === 0) {
    //       that.setData({
    //         order: res.data.order,
    //         totalAmount: res.data.totalAmount,
    //         remainAmount: res.data.remainAmount,
    //         couponCount: res.data.couponCount
    //       });
    //     }
    //   });
    }
  },
  //模态框确定绑定
  confirm:function(e){
    //this.getUserProfile(e);
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
  //点击场馆介绍按钮
  gogymnasiumDetail(e) {
    if (this.data.hasLogin) {
      try {
        wx.setStorageSync('tab', '0');
      } catch (e) {}
      // 传过来的内容url跳转
      wx.navigateTo({
        url: e.currentTarget.dataset.url
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
        } catch (e) {}
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
  },

  // =================================后台管理=================================//

  managerBtn: function (e) {
    // if (!app.globalData.hasLogin) {
    //   wx.navigateTo({
    //     url: "/pages/auth/accountLogin/accountLogin"
    //   });
    // }
    var that = this;
    that.setData({ name: e.currentTarget.dataset.name })
    if (this.data.name === '预约查询') {
      wx.navigateTo({
        url: '/subPackages/pages/reserveInfo/reserveInfo'
      })
    }
    //跳转到留言查看页面
    if (this.data.name === '留言查看') {
      wx.navigateTo({
        url: '/subPackages/pages/messageView/messageView'
      })
    }
    //活动描述
    if (this.data.name === '公告管理') {
      wx.navigateTo({
        url: '/subPackages/pages/activeDesc/activeDesc'
      })
    }
    if (this.data.name === '活动推送') {
      wx.navigateTo({
        url: '/subPackages/pages/activePush/activePush'
      })
    }
    if (this.data.name === '轮播图配置') {
      wx.navigateTo({
        url: '/subPackages/pages/swiperSet/swiperSet'
      })
    }
    if (this.data.name === '关闭预约通道') {
      wx.navigateTo({
        url: '/subPackages/pages/closeReserve/closeReserve'
      })
    }
    if (this.data.name === '二维码生成') {
        this.bindSetTap();
    }
  },

  bindSetTap: function (e, skin) {
		let itemList = ['图书馆','健身房'];
		wx.showActionSheet({
			itemList,
			success: async res => {
        let idx = res.tapIndex;
				if (idx == 0) {
          this.QRcode('图书馆')
        }
        if (idx == 1) {
          this.QRcode('健身房')
				}
			},
			fail: function (res) { }
		})
  },
  
  QRcode: function (e) {
    wx.downloadFile({
      url: api.QRcode +'?scene='+e, // 文件的本身url
      filePath: wx.env.USER_DATA_PATH +'//'+e+ '.jpg', // 本地自定义的文件名
      success: function (res) {
        let filePath = res.filePath; // 微信临时文件路径(这里要使用自定义的名字文件名,否则打开的文件名是乱码)
        wx.openDocument({
          filePath: filePath,
          showMenu: true, // 是否显示右上角菜单按钮 默认为false(看自身需求，可要可不要。后期涉及到右上角分享功能)
          success: function (x) {
            console.log("success", x);
          },
          fail: function (x) {
            console.log("err", x);
          }
        });
      },
      fail: function (x) {
        console.log("err", x);
      }
    });
    // wx.request({
    //   url: api.QRcode,
    //   data: {scene: e},
    //   method: "GET",
    //   header: { 'Content-type': 'application/x-www-form-urlencoded', },
    //   responseType: 'arraybuffer', 
    //   success: res => {
    //     const fs = wx.getFileSystemManager();
    //     fs.writeFile({
    //       filePath: wx.env.USER_DATA_PATH + "/" + e + ".jpg", 
    //       data: res.data,
    //       encoding: "binary", 
    //       success:function(res) {
    //         wx.openDocument({ 
    //           filePath: wx.env.USER_DATA_PATH + "/" + e + ".jpg", 
    //           showMenu: true, 
    //           success: function (res) {
    //             setTimeout(() => {
    //               wx.hideLoading()
    //             }, 500)
    //           },fail:function(err){console.log()}
    //         })
    //       },
    //       fail:function(err){console.log()}
    //     })
    //   },fail:err =>{console.log(err)}
    // })
  },
})