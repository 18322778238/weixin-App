/*
1 获取用户的收获地址
  1 绑定点击事件
2 页面加载完毕
  1 获取本地存储中的地址
  2 把数据设置给data中的一个变量
3 onShow
  1 获取缓存中的购物车数组
  2 把购物车数据填充到data中
4 全选的实现  数据展示
  1 onShow中获取缓存中的购物车数组
  2 根据购物车中的数组进行商品计算
5 总价格和总数量
  1 都需要商品被选中才进行计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 计算总价格  和总数量 最后返回到data中
6 商品的选中功能  
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态  取反
  4 重新填充回data中和缓存中
  5 重新计算全选 总价格 总数量
7 全选和反选
  1 全选复选框绑定change事件
  2 获取data中的全选变量 allChecked
  3 直接取反 allChecked =！allChecked
  4 遍历购物车数组 让里面的商品状态改变
  5 把购物车数组和allChecked 重新给回data 并重新存回 缓存中
8 商品数量的编辑
  1 + - 按钮绑定同一个点击事件 区分的关键就在于一个自定义事件
  2 传递被点击的商品id  goods_id
  3 获取data中的购物车数组  来获取需要被修改的商品对象
  4 直接修改商品对象的num属性
    当购物车的数量为1时 点击- 弹窗提示是否要删除 
  5 把cart数组重新设置回缓存中
9 点击结算
  1 判断有没有收货地址
  2 判断有没有商品
  3 经过以上验证  跳转到支付页面
*/ 

import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0,
  },

  onShow(){
    // 获取缓存中的收获地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart")||[];
    this.setData({address});
    this.setCart(cart);
  },
  //点击收货地址触发的事件
  async handleChooseAddress(){
    try {
    // 获取权限状态
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    // 判断权限状态
    if(scopeAddress===false){
      // 诱导打开用户授权页面
      await openSetting();
    }else{
      // 调用获取收货地址的api
      let address = await chooseAddress();
      address.all = address.provinceName+address.cityName+address.detailInfo;
      // 把获取到的收货地址存入到本地存储中
      wx.setStorageSync("address", address);
    }
    } catch (error) {
      console.log(error);
    }
  },

  // 商品的选中
  handleItemChange(e){
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v=>v.data.message.goods_id===goods_id);
    // checked状态取反
    cart[index].checked =!cart[index].checked;
    this.setCart(cart);
  },

  // 封装 设置购物车状态改变时  引发的一系类数据的变化
  setCart(cart){
    let allChecked = true;
    // 声明总数量和总价值
    let totalPrice =0;
    let totalNum = 0;
    cart.forEach( v => {
      if(v.checked){
        totalPrice += v.data.message.goods_price * v.num;
        totalNum += v.num;
      }else{
        allChecked =false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length !=0 ? allChecked:false;
    // 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart); 
  },

  // 商品的全选功能
  handleItemAllCheck(){
    let {cart,allChecked} = this.data;
    allChecked = !allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart);
  },

  // 购物车数量增减
  async handleItemNumEdit(e){
    // 传递被点击的商品id
    const {operation,id} = e.currentTarget.dataset;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.data.message.goods_id === id);
    // 进行数量修改
    if(cart[index].num===1 && operation===-1){
      const res = await showModal({content: '您是否要删除这个商品'});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else {
      cart[index].num += operation;
      // 设置回缓存中
      this.setCart(cart);
    }
  },

  // 点击结算
  async handlePay() {
    // 判断收货地址
    const {address,totalNum} = this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 判断没有有购买商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})