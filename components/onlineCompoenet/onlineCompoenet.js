const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      const that = this;
      const accountInfo = wx.getAccountInfoSync(); // develop  	开发版 
      //accountInfo.miniProgram.envVersion = 'release'; //上线审核的时候就注释掉这段代码，开发时就保留
      if (accountInfo.miniProgram.envVersion === 'release') {
        that.setData({
          showComponenet: false,
        });
      } else {
        app.globalData.isOnline = true;
        that.setData({
          showComponenet: true
        });
    
        wx.setNavigationBarTitle({
          title: ' ',
        });
        try {
          wx.hideTabBar({
            fail: function () {
              setTimeout(function () { // 做了个延时重试一次，作为保底。
                wx.hideTabBar()
              }, 500)
            }
          });
        } catch (error) {

        }

      }
    },
    moved: function () {},
    detached: function () {},
  },
  /**
   * 组件的初始数据
   */
  data: {
    showComponenet:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    

  }
})



