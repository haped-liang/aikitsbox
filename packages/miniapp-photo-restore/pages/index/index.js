const app=getApp();
Page({
  data:{
    quota:1,
    // 展示案例（静态对比图，模拟效果）
    showcase:[
      {before:'/images/demo-before-1.png',after:'/images/demo-after-1.png',desc:'模糊照片→高清修复'},
      {before:'/images/demo-before-2.png',after:'/images/demo-after-2.png',desc:'黑白→智能上色'},
      {before:'/images/demo-before-3.png',after:'/images/demo-after-3.png',desc:'破损→完整修复'},
    ],
    currentShowcase:0,
  },
  onShow(){this.setData({quota:app.getQuota()})},

  // 选择照片
  async choosePhoto(){
    if(!app.useFreeQuota()){
      wx.showModal({
        title:'今日免费次数用完',
        content:'每天可免费预览1次修复效果。是否查看高清方案？',
        confirmText:'¥9.9 高清修复',
        success:r=>{if(r.confirm)this.payForHD()}
      });
      return;
    }
    const res=await wx.chooseImage({count:1,sizeType:['original','compressed'],sourceType:['album','camera']});
    const photoPath=res.tempFilePaths[0];
    this.setData({quota:app.getQuota()});
    wx.navigateTo({url:`/pages/processing/processing?photo=${encodeURIComponent(photoPath)}`});
  },

  // 付费入口
  payForHD(){wx.showToast({title:'付费功能开发中',icon:'none'})},

  // 轮播展示案例
  onSwiperChange(e){this.setData({currentShowcase:e.detail.current})},

  onShareAppMessage(){return{title:'我用AI修复了家里的老照片，看哭了...你也试试？',path:'/pages/index/index'}},
});
