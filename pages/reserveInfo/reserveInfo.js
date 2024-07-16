// pages/reserveInfo/reserveInfo.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showData: [],
    field: ""
  },
  inputCom: function (e) {
    this.setData({
      field: e.detail.value
    })
  },
  //查询
  selectBtn: function () {
    var that = this;
    util.request(api.ManReserve, { name: this.data.field }, "GET").then(res => {
      if (res.code == 200) {
        console.log(res.data)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].startTime = this.test(res.data[i].startTime)
          res.data[i].endTime = this.test(res.data[i].endTime)
        }
        that.setData({
          showData: res.data
        })
      } else {
        wx.showModal({
          title: res.message,
          icon: 'error',
          duration: 2000
        });
      }
    })
  },

  test: function (time) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  },

  //查看详细信息
  cancel_click: function (e) {
    console.log(123,e)
    wx.navigateTo({
      url: '/pages/eventTypeReBack/index?form=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  download: function () {
    wx.downloadFile({
      url: api.dowReserve, // 文件的本身url
      filePath: wx.env.USER_DATA_PATH + '//预约报表.xlsx', // 本地自定义的文件名
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
    //   url: api.dowReserve, //这个地方是你获取二进制流的接口地址
    //   method: 'GET',
    //   responseType: "arraybuffer", //arraybuffer特别注意的是此处是请求文件流必须加上的属性，不然你导出到手机上的时候打不开，即使是打开了也是空白
    //   success: res => {
    //     console.log(res)
    //     console.log(wx.env.USER_DATA_PATH)
    //     const fs = wx.getFileSystemManager(); //获取全局唯一的文件管理器 
    //     fs.writeFile({ //写文件
    //       filePath: wx.env.USER_DATA_PATH + "/预约报表.xlsx",  //wx.env.USER_DATA_PATH 指定临时文件存入的路径，后面字符串自定义
    //       data: res.data, // res.data就是获取到的二进制文件流
    //       encoding: "binary", //二进制流文件必须是 binary
    //       success(e) {
    //         wx.openDocument({ // 打开文档
    //           filePath: wx.env.USER_DATA_PATH + "/统计报表.xlsx", //拿上面存入的文件路径
    //           fileType: 'xlsx',
    //           showMenu: true, // 显示右上角菜单
    //           success: function (x) {
    //             console.log("success", x);
    //           },
    //           fail:function(x){
    //             console.log("fail",x)
    //           }
    //         })
    //       },
    //       fail:function(e){
    //         console.log("fail",e)
    //       }
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.selectBtn();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})