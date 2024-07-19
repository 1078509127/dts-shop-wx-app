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
    animationData: {}, //
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
    colseCoupon: false
  },
  onPullDownRefresh:function() {
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
    if (!userInfo) {
      let that = this
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
    if (!userInfo) {
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
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          brands: res.data.brandList,
          floorGoods: res.data.floorGoodsList,
          banner: res.data.banner,
          articles: res.data.articles,
          groupons: res.data.grouponList,
          channel: res.data.channel,
          coupon: res.data.couponList
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