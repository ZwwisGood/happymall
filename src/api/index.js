//当前这个模块：API进行统一管理
import requests from './request'
import mockRequests from './mockAjax'
//三级联动接口
//    /api/product/getBaseCategoryList get 无参数
export const reqCategoryList = () => requests.get(`/product/getBaseCategoryList`)
// {
//     //发请求:axios发请求返回结果Promise对象
//     return requests({
//         url:'/product/getBaseCategoryList',
//         method: 'GET',
//     })
// }

//获取banner（Home首页轮播图接口）
export const reqGetBannerList = () => mockRequests.get(`/banner`)

//获取floor数据
export const reqFloorList = () => mockRequests.get(`/floor`)

//获取搜索模块数据  地址:/api/list  请求方式:post  参数:需要
/* {
    "category3Id": "61",
    "categoryName": "手机",
    "keyword": "小米",
    "order": "1:desc",
    "pageNo": 1,
    "pageSize": 10,
    "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
    "trademark": "4:小米"
} */
//当前这个接口,给服务器传递参数params,至少要传递一个空对象,否则失败
export const reqGetSearchInfo = (params) => requests({
    url: '/list',
    method: 'POST',
    data: params
})

//获取产品详情信息的接口
export const reqGoodsInfo = (skuid) => requests({
    url: `/item/${skuid}`,
    method: 'GET',
})

//将产品添加到购物车、更新购物车已有商品个数
//   /api/cart/addToCart/{ skuId }/{ skuNum }   post
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: 'POST',
})

//获取购物车列表数据接口  
//    /api/cart/cartList   get
export const reqCartList = () => requests({
    url: `/cart/cartList`,
    method: 'GET',
})

//删除购物产品的接口
//    /api/cart/deleteCart/{skuId}  method:delete
export const reqDeleteCartById = (skuId) => requests({
    url: `/cart/deleteCart/${skuId}`,
    method: 'DELETE',
})

//切换产品的选中状态
//    /api/cart/checkCart/{skuID}/{isChecked}   method:get
export const reqUpdateCheckedById = (skuId, isChecked) => requests({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: 'GET',
})

//获取验证码
//    /api/user/passport/sendCode/{phone}   method:get
export const reqGetCode = (phone) => requests({
    url: `/user/passport/sendCode/${phone}`,
    method: 'GET',
})

//注册
//    /api/user/passport/register    method:post   参数:phone,code,password
export const reqUserRegister = (data) => requests({
    url: `/user/passport/register`,
    data: data,
    method: 'POST',
})

//登录
//    /api/user/passport/login    method:post    参数:phone,password
export const reqUserLogin = (data) => requests({
    url: `/user/passport/login`,
    data,
    method: 'POST',
})

//获取用户信息[需要带着用户的token向服务器要用户信息]
//    /api/user/passport/auth/getUserInfo    method:get
export const reqUserInfo = () => requests({
    url: `/user/passport/auth/getUserInfo`,
    method: 'GET',
})

//退出登录
//    /api/user/passport/logout    method:get
export const reqLogout = () => requests({
    url: `/user/passport/logout`,
    method: 'GET',
})

//获取用户地址信息
//    /api/user/userAddress/auth/findUserAddressList    method:get
export const reqAddressInfo = () => requests ({
    url: `/user/userAddress/auth/findUserAddressList`,
    method: 'GET',
})

//获取用户商品的清单
//    /api/order/auth/trade    method:get
export const reqOrderInfo = () => requests ({
    url:`/order/auth/trade`,
    method: 'GET',
})

//提交订单
//    /api/order/auth/submitOrder?tradeNo={tradeNo}    method:post
export const reqSubmitOrder = (tradeNo,data) => requests ({
    url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,
    method: 'POST',
    data,
})

//获取支付信息
//    /api/payment/weixin/createNative/{orderId}    method:get
export const reqPayInfo = orderId => requests ({
    url:`/payment/weixin/createNative/${orderId}`,
    method: 'GET',
})

//获取订单支付状态
//    /api/payment/weixin/queryPayStatus/{orderId}    method:get
export const reqPayStatus = orderId => requests ({
    url:`/payment/weixin/queryPayStatus/${orderId}`,
    method: 'GET',
})

//获取个人中心我的订单
//    /api/order/auth/{page}/{limit}    method:get
export const reqMyOrderList = (page,limit) => requests({
    url:`/order/auth/${page}/${limit}`,
    method: 'GET',
})