/*
  1 发送请求获取数据
  2 点击轮播图  预览大图功能
    1 给轮播图绑定点击事件
    2 调用小程序的api prevewImage
  3 点击 加入购物车
    1 先绑定点击事件
    2 获取缓存中的购物车数据  数组格式
    3 先判断  当前商品是否存在于购物车内
    4 已经存在  修改购物车数据  让购物车数量++ 重新把购物车数组填充回缓存中
    5 不存在与购物车数组中  直接给购物车数组添加一个新元素 带上购买属性 num 重新把购物车数组填充回缓存中
    6 弹出提示
*/
import {request} from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },

  // 全局商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options;
    this.getGoodsdetail(goods_id);
  },

  // 获取商品的详情数据
  async getGoodsdetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo = goodsObj,
    this.setData({
      goodsObj
    })
  },

  // 点击轮播图放大预览
  handPreviewImage(e){
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.data.message.pics.map(v=>v.pics_mid);
    // 2 接收传递过来的url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    });
  },

  // 点击增加购物车数量
  handleCartAdd(){
    // 1 获取缓存中的购物车数组
    let cart =wx.getStorageSync("cart")||[]; 
    // 2 判断商品数组是否存在于购物车数组中
    let index = cart.findIndex(v=>v.data.message.goods_id===this.GoodsInfo.goods_id);
    if(index === -1) {
      // 不存在于数组中   第一次添加该商品
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true ;
      cart.push(this.GoodsInfo);
    }else{
      // 已经存在于购物车中  执行数量++
      cart[index].num++;
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户手抖  疯狂点击按钮
      mask: true,
    });
  } })