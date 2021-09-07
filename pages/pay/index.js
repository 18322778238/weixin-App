/**
 * 1 页面加载的时候
 *    1 缓存中获取购物车数据  渲染到页面中
 * 2 微信支付
 *    1 那些人那些账号是可以实现微信支付的
 *      1 企业账号
 *      2 企业后台账号必须给开发者添加白名单
 *        1 一个AppID可以同时绑定多个开发者
 *        2 这些开发者就可以公用这个APPID和它的开发权限
 * 3 支付按钮
 *    1 先判断缓存中是否有token
 *    2 没有token 跳转到授权页面 获取token
 *    3 有token正常执行剩下的逻辑
 */
import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0,
  },

  onShow(){
    // 获取缓存中的收获地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];
    // 过滤后的购物车数组
    cart= cart.filter(v=>v.checked);
    this.setData({address});

    // 声明总数量和总价值
    let totalPrice =0;
    let totalNum = 0;
    cart.forEach( v => {
        totalPrice += v.data.message.goods_price * v.num;
        totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    }); 
  },

  // 实现点击支付功能
  handleOrederPay(){
    // 判断缓存中有没有token
    const token = wx.getStorageSync("token");
    // 进行判断
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    console.log("已经存在token了");
  }
})