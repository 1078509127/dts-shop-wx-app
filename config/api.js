// 以下是业务服务器API地址
 // 本机开发API地址
var WxApiRoot = 'https://9442w887i9.goho.co/wx/';
//var WxApiRoot = ' https://9aj327pr1567.vicp.fun/wx/';
// 测试环境部署api地址
// var WxApiRoot = 'http://192.168.0.101:8070/demo/wx/';
// 线上云平台api地址
//var WxApiRoot = 'https://www.dtsshop.com/demo/wx/';

module.exports = {
  SaveReserve: WxApiRoot + 'reserve/reserve', //预约接口
  TeamReserve: WxApiRoot + 'reserve/teamReserve',//团队预约接口
  DelReserve: WxApiRoot + 'reserve/delReserve', //取消预约接口
  SelReserve: WxApiRoot + 'reserve/selReserve', //查询预约接口
  Echo: WxApiRoot + 'reserve/echo', //预约回显基本数据
  SelCategury: WxApiRoot + 'catalog/categurInfo', //查询场馆信息
  IsFull: WxApiRoot + 'reserve/isFull', //当日是否约满
  GetTableList: WxApiRoot + 'reserve/getTableList', //查询预约乒乓球桌号
  teamisFull:WxApiRoot + 'reserve/teamisFull',//团队是否约满
  ActiveList: WxApiRoot + 'reserve/activeList', //预约活动列表
  Scan: WxApiRoot + 'reserve/scan', //扫一扫接口
  IndexUrl: WxApiRoot + 'home/index', //首页数据接口
  CatalogList: WxApiRoot + 'catalog/index', //分类目录全部分类数据接口
  CatalogCurrent: WxApiRoot + 'catalog/current', //分类目录当前分类数据接口

  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号
  AuthUpUser: WxApiRoot + 'auth/upuser',//修改用户信息

  //管理端接口
  ManReserve: WxApiRoot + 'manage/list', //预约查询
  selMessage:WxApiRoot + 'manage/getMessage', //留言查看
  dowReserve: WxApiRoot + 'manage/download', //预约导出
  activePush: WxApiRoot + 'manage/sendMsg', //活动推送
  creSwiper: WxApiRoot + 'manage/create', //轮播图上传
  selSwiper: WxApiRoot + 'ad/list', //轮播图查看
  updSwiper: WxApiRoot + 'ad/update', //轮播图修改
  delSwiper: WxApiRoot + 'ad/delete', //轮播图删除
  activeList: WxApiRoot + 'manage/activeList', //预约通道查询
  activeUpdate: WxApiRoot + 'manage/activeUpdate', //预约通道关闭
  QRcode: WxApiRoot + 'manage/QRcode', //二维码生成
  AdmArticleDetail: WxApiRoot + 'manage/detail',//公告详情//////后增加////
  AdmArticleDetail: WxApiRoot + 'manage/detail',//公告详情//////后增加////
  AdmUpArticle:WxApiRoot + 'manage/update',//修改公告//////后增加////

  GoodsCount: WxApiRoot + 'goods/count', //统计商品总数
  GoodsList: WxApiRoot + 'goods/list', //获得商品列表
  GoodsCategory: WxApiRoot + 'goods/category', //获得分类数据
  GoodsDetail: WxApiRoot + 'goods/detail', //获得商品的详情
  GoodsRelated: WxApiRoot + 'goods/related', //商品详情页的关联商品（大家都在看）

  CreateShareImg: WxApiRoot + 'agency/createShareImg', //创建分享海报

  BrandList: WxApiRoot + 'brand/list', //品牌列表
  BrandDetail: WxApiRoot + 'brand/detail', //品牌详情

  CartList: WxApiRoot + 'cart/index', //获取购物车的数据
  CartAdd: WxApiRoot + 'cart/add', // 添加商品到购物车
  CartFastAdd: WxApiRoot + 'cart/fastadd', // 立即购买商品
  CartUpdate: WxApiRoot + 'cart/update', // 更新购物车的商品
  CartDelete: WxApiRoot + 'cart/delete', // 删除购物车的商品
  CartChecked: WxApiRoot + 'cart/checked', // 选择或取消选择商品
  CartGoodsCount: WxApiRoot + 'cart/goodscount', // 获取购物车商品件数
  CartCheckout: WxApiRoot + 'cart/checkout', // 下单前信息确认

  CollectList: WxApiRoot + 'collect/list', //收藏列表
  CollectAddOrDelete: WxApiRoot + 'collect/addordelete', //添加或取消收藏

  CommentList: WxApiRoot + 'comment/list', //评论列表
  CommentCount: WxApiRoot + 'comment/count', //评论总数
  CommentPost: WxApiRoot + 'comment/post', //发表评论

  TopicList: WxApiRoot + 'topic/list', //专题列表
  TopicDetail: WxApiRoot + 'topic/detail', //专题详情
  TopicRelated: WxApiRoot + 'topic/related', //相关专题

  SearchIndex: WxApiRoot + 'search/index', //搜索关键字
  SearchResult: WxApiRoot + 'search/result', //搜索结果
  SearchHelper: WxApiRoot + 'search/helper', //搜索帮助
  SearchClearHistory: WxApiRoot + 'search/clearhistory', //搜索历史清楚

  AddressList: WxApiRoot + 'address/list', //收货地址列表
  AddressDetail: WxApiRoot + 'address/detail', //收货地址详情
  AddressSave: WxApiRoot + 'address/save', //保存收货地址
  AddressDelete: WxApiRoot + 'address/delete', //保存收货地址

  ExpressQuery: WxApiRoot + 'express/query', //物流查询

  RegionList: WxApiRoot + 'region/list', //获取区域列表

  OrderSubmit: WxApiRoot + 'order/submit', // 提交订单
  OrderPrepay: WxApiRoot + 'order/prepay', // 订单的预支付会话
  OrderList: WxApiRoot + 'order/list', //订单列表
  OrderDetail: WxApiRoot + 'order/detail', //订单详情
  ExpressTrace: WxApiRoot + 'order/expressTrace', //订单物流
  OrderCancel: WxApiRoot + 'order/cancel', //取消订单
  OrderRefund: WxApiRoot + 'order/refund', //退款取消订单
  OrderDelete: WxApiRoot + 'order/delete', //删除订单
  OrderConfirm: WxApiRoot + 'order/confirm', //确认收货
  OrderGoods: WxApiRoot + 'order/goods', // 代评价商品信息
  OrderComment: WxApiRoot + 'order/comment', // 评价订单商品信息

  FeedbackAdd: WxApiRoot + 'feedback/submit', //添加反馈
  FootprintList: WxApiRoot + 'footprint/list', //足迹列表
  FootprintDelete: WxApiRoot + 'footprint/delete', //删除足迹

  UserFormIdCreate: WxApiRoot + 'formid/create', //用户FromId，用于发送模版消息

  GroupOnList: WxApiRoot + 'groupon/list', //团购列表
  GroupOn: WxApiRoot + 'groupon/query', //团购API-查询
  GroupOnMy: WxApiRoot + 'groupon/my', //团购API-我的团购
  GroupOnDetail: WxApiRoot + 'groupon/detail', //团购API-详情
  GroupOnJoin: WxApiRoot + 'groupon/join', //团购API-详情

  CouponList: WxApiRoot + 'coupon/list', //优惠券列表
  CouponMyList: WxApiRoot + 'coupon/mylist', //我的优惠券列表
  CouponSelectList: WxApiRoot + 'coupon/selectlist', //当前订单可用优惠券列表
  CouponReceive: WxApiRoot + 'coupon/receive', //优惠券领取
  CouponReceiveAll: WxApiRoot + 'coupon/receiveAll', //优惠券领取
  CouponExchange: WxApiRoot + 'coupon/exchange', //优惠券兑换
  GetUserCoupon: WxApiRoot + 'coupon/getUserCoupon',//用户个人可领取优惠券查询

  StorageUpload: WxApiRoot + 'storage/upload', //图片上传,

  UserIndex: WxApiRoot + 'user/index', //个人页面用户相关信息
  BrokerageMain: WxApiRoot + 'brokerage/main',//佣金收益主页面
  SettleOrderList: WxApiRoot + 'brokerage/settleOrderList',//佣金收益主页面
  ApplyWithdrawal: WxApiRoot + 'brokerage/applyWithdrawal',//佣金提现申请
  ExtractList: WxApiRoot + 'brokerage/extractList',//佣金账号提现记录
  ArticleDetail: WxApiRoot + 'article/detail',//公告详情
  ApplyAgency: WxApiRoot + 'user/applyAgency',//代理申请
  GetSharedUrl: WxApiRoot + 'user/getSharedUrl', //获取推广二维码
  selFeedbackUser:WxApiRoot + 'feedback/selFeedbackUser',
};