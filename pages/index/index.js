// 0 引入用来发送的请求的方法
import {request} from "../../request/index"
Page({
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航  数组
    catesList:[],
    // 楼层 数组
    floorList:[]
  },
  //options(Object)
  //页面开始加载的时候就触发的事件
  onLoad: function(options){
    // 1 发送异步请求来获取轮播图数据 优化手段可以用es6的promise来解决
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({url:"/home/swiperdata"})
    .then(result => {
      this.setData({
        swiperList:result.data.message
      })
    })
  },
  // 获取分类导航数据
  getCatesList() {
    request({url:"/home/catitems"})
    .then(result => {
      this.setData({
        catesList:result.data.message
      })
    })
  },
  // 获得楼层数据
  getFloorList() {
    request({url:"/home/floordata"})
    .then(result => {
      this.setData({
        floorList:result.data.message
      })
    })
  },
});