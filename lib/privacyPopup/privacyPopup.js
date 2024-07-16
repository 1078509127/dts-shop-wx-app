// components/privacyPopup/privacyPopup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 显示/隐藏弹窗
    showPop: {
      type: Boolean,
      value: false,
    },
    // 拒绝是否退出小程序
    exitApp: {
      type: Boolean,
      value: false,
    },
    // 是否在tabbar页面 用于隐藏tabbar
    inTabPage: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: "用户隐私保护提示",
    desc1: "感谢您使用本小程序，您使用本程序前应当阅读并同意",
    privacyContractName: "《用户隐私保护指引》",
    desc2:
      "当您点击同意并开始使用产品服务时，即表示您已理解并同意该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法使用并退出小程序。",
    isTap: false,
    isAgree: false,
  },

  // 数据变化监听
  observers: {
    "showPop, inTabPage, exitApp, isTap, isAgree": (
      showPop,
      inTabPage,
      exitApp,
      isTap,
      isAgree
    ) => {
      if (showPop && inTabPage) wx.hideTabBar();
      if (!showPop && inTabPage) wx.showTabBar();
      if (!showPop && exitApp && isTap && !isAgree) {
        wx.exitMiniProgram({
          complete(res) {
            if (res.errMsg === "exitMiniProgram:ok") {
              console.warn(
                "用户拒绝授权后退出小程序成功，模拟器中不生效，请使用真机进行测试"
              );
            } else {
              console.error("用户拒绝授权后退出小程序失败");
            }
          },
        });
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hidePop() {
      this.setData({
        showPop: false,
      });
    },

    /**
     * 按钮点击监听
     */
    handleTap(res) {
      const result = res.currentTarget.dataset.result;
      const obj = {
        errMsg: "用户拒绝隐私授权",
        result: false,
      };

      // 组件授权结果会同时在全局参数中存储，开发者可以自己决定需不需要
      // 存储授权状态到全局
      getApp().globalData.agreePrivacy = false;
      if (result === "agree") {
        obj.errMsg = "用户同意隐私授权";
        obj.result = true;
        getApp().globalData.agreePrivacy = true;
      }
      this.triggerEvent("handle", obj);
      this.setData({ isTap: true, isAgree: obj.result });
      this.hidePop();
    },

    /**
     * 打开隐私协议指引
     */
    openPrivacyContract() {
      wx.openPrivacyContract();
    },

    // 阻止页面滑动
    catchTouchmove() {},
  },
});
