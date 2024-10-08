const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
// const login = require('../auth/login/login.js');
// var userinfo=null;
//获取应用实例
const app = getApp();

Page({
  data: {
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    canIUseGetUserProfile: false, // 2.27之前用于向前兼容
    showPop: false,
    singleList: [],
    multiList: [],
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    groupons: [],
    floorGoods: [],
    banner: [],
    channel: [],
    coupon: [],
    articles: [],
    goodsCount: 0,
    indicatorDots: false,
    window: false,
    colseCoupon: false,

    eventType:"",
    scene:"",
    //isOpen:"",
    optionList: ['所有', '选项1', '选项2'],
    value: '所有',
    hideFlag: true, //true-隐藏  false-显示
    animationData: {}, //
  },
  // 点击选项
  getOption: function (e) {
    var that = this;
    that.setData({
      value: e.currentTarget.dataset.value,
      hideFlag: true
    })
  },
  //拒绝
  refuse: function () {
    var that = this;
    that.hideModal();
  },
  //同意
  allow: function () {
   let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      let that = this
      wx.navigateTo({
        url: '/pages/auth/login/login',
      })
    } else if (!this.data.isOpen) {
      wx.showModal({
        title: '目前' + this.data.scene + '已关闭预约',
        icon: 'error',
        duration: 2000
      });
    } else {
      this.hideModal();
      wx.navigateTo({
        url: '/subPackages/pages/eventType/eventType?eventType='+this.data.eventType+'&scene=' + this.data.scene,
      })
    }
  },
  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideFlag: false
    })
    // 创建动画实例
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间
      timingFunction: 'ease', //动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
    })
    this.animation = animation; //将animation变量赋值给当前动画
    var time1 = setTimeout(function () {
      that.slideIn(); //调用动画--滑入
      clearTimeout(time1);
      time1 = null;
    }, 100)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.slideDown(); //调用动画--滑出
    var time1 = setTimeout(function () {
      that.setData({
        hideFlag: true
      })
      clearTimeout(time1);
      time1 = null;
    }, 220) //先执行下滑动画，再隐藏模块

  },
  //动画 -- 滑入
  slideIn: function () {
    this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },
  //动画 -- 滑出
  slideDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
// ----------------------------------------------------------------------modal

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getIndexData();
    this.getArticle();
    this.activeList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  //模态框确定绑定
  confirm: function (e) {
    this.getUserProfile(e);
    //this.wxLogin(e)
  },
  cancel: function (e) {
    let thst = this;
    thst.setData({
      hideModal: true
    })
  },
  //跳转个人
  selectSingle: function (e) {
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || Object.keys(userInfo).length == 0 || userInfo.userId == undefined) {
      wx.navigateTo({
        url: '/pages/auth/login/login',
      })
    } else if (!this.data.singleList[e.detail.value].isOpen) {
      wx.showModal({
        title: '目前' + this.data.singleList[e.detail.value].name + '已关闭预约',
        icon: 'error',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: '/subPackages/pages/eventType/eventType?eventType=个人预约&scene=' + this.data.singleList[e.detail.value].name,
      })
    }
  },
  //跳转团队
  selectMulti: function (e) {
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || Object.keys(userInfo).length == 0 || userInfo.userId == undefined) {
      wx.navigateTo({
        url: '/pages/auth/login/login',
      })
    } else if (!this.data.multiList[e.detail.value].isOpen) {
      wx.showModal({
        title: '目前' + this.data.multiList[e.detail.value].name + '已关闭预约',
        icon: 'error',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: '/subPackages/pages/eventType/eventType?eventType=团队预约&scene=' + this.data.multiList[e.detail.value].name,
      })
    }
  },
  //获取活动列表
  activeList: function () {
    this.data.singleList = []
    this.data.multiList = []
    util.request(api.ActiveList, null, 'GET').then(res => {
      let that = this
      for (var i = 0; i < res.length; i++) {
        if (res[i].name === '乒乓球馆') { //|| res[i].name ==='健身房' || res[i].name ==='图书馆'
          that.setData({
            singleList: this.data.singleList.concat(res[i])
          })
        } else {
          if (res[i].name === "健身房" || res[i].name === "图书馆") {
            //"健身房" "图书馆 不放入数据
          } else {
            that.setData({
              multiList: this.data.multiList.concat(res[i])
            })
          }
        }
      }
    })
  },

  //查询公告
  getArticle: function () {
    util.request(api.ArticleDetail, {
      id: 1
    }, "GET").then(res => {
      if (res.data.content != undefined) {
        this.setData({
          ArticleDetail: res.data.content

        });
      } else {
        this.setData({
          ArticleDetail: res.data.content
        });
      }
    })
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          // newGoods: res.data.newGoodsList,
          // hotGoods: res.data.hotGoodsList,
          // topics: res.data.topicList,
          // brands: res.data.brandList,
          // floorGoods: res.data.floorGoodsList,
          banner: res.data.banner,
          // articles: res.data.articles,
          // groupons: res.data.grouponList,
          // channel: res.data.channel,
          // coupon: res.data.couponList
        });
      }
    });
  },
  onLoad: function (options) {
    ///end
    this.setData({
      colseCoupon: false
    });
    //如果有分享用户，则设置
    if (options.shareUserId) {
      wx.setStorageSync('shareUserId', options.shareUserId);
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (options.scene) {
      //这个scene的值存在则证明首页的开启来源于朋友圈分享的图,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      var scene = decodeURIComponent(options.scene);

      let info_arr = [];
      info_arr = scene.split(',');
      let _type = info_arr[0];
      let id = info_arr[1];

      let shareUserId = null; //默认用户
      if (info_arr.length == 4 && info_arr[2] == 'user') {
        shareUserId = info_arr[3];
      } else if (_type == 'user') {
        shareUserId = id;
      }

      if (shareUserId != null) {
        wx.setStorageSync('shareUserId', id);
      }

      if (_type == 'goods') {
        wx.navigateTo({
          url: '../goods/goods?id=' + id
        });
      } else if (_type == 'groupon') {
        wx.navigateTo({
          url: '../goods/goods?grouponId=' + id
        });
      } else if (_type == 'brand') {
        wx.navigateTo({
          url: '../brandDetail/brandDetail?id=' + id
        });
      } else if (_type == 'topic') {
        wx.navigateTo({
          url: '../topicDetail/topicDetail?id=' + id
        });
      } else {
        wx.navigateTo({
          url: '../index/index'
        });
      }
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (options.grouponId) {
      //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '../goods/goods?grouponId=' + options.grouponId
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (options.goodId) {
      //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '../goods/goods?id=' + options.goodId
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (options.orderId) {
      //这个orderId的值存在则证明首页的开启来源于订单模版通知,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '../ucenter/orderDetail/orderDetail?id=' + options.orderId
      });
    }

    this.getIndexData();
  },
  onReady: function () {
    // 页面渲染完成
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    // if (!that.data.colseCoupon && userInfo && that.data.coupon.length > 0) {
    //   that.setData({
    //     window: true
    //   });
    // }
  },
  onShow: function () {
    this.activeList();
    this.getArticle()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onColse: function () {
    this.setData({
      window: false,
      colseCoupon: true
    });
  },
  getCoupon(e) {
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }

    let couponId = e.currentTarget.dataset.index
    util.request(api.CouponReceive, {
      couponId: couponId
    }, 'POST').then(res => {
      if (res.errno === 0) {
        wx.showToast({
          title: "领取成功"
        })
      } else {
        util.showErrorToast(res.errmsg);
      }
    })
  },
})