/**
 * 修复结果页 - 前后对比
 * 核心功能：滑块对比(视觉冲击→分享裂变)
 */
Page({
  data:{
    photoPath:'',       // 原图
    restoredPath:'',    // 修复后（模拟用原图+滤镜）
    sliderPos:50,       // 滑块位置(%)
    isHD:false,         // 是否已解锁高清
    showPayModal:false,
  },

  onLoad(options){
    const photoPath=decodeURIComponent(options.photo);
    this.setData({photoPath,restoredPath:photoPath}); // 实际应替换为修复后的图片URL
  },

  // 滑块拖动
  onSliderChange(e){
    this.setData({sliderPos:e.detail.value});
  },

  // 下载高清版 → 触发付费
  downloadHD(){
    wx.showModal({
      title:'解锁高清修复',
      content:'高清无水印版本仅需 ¥9.9\n\n包含：\n· 4倍分辨率提升\n· 无水印\n· 永久保存',
      confirmText:'¥9.9 解锁高清',
      success:r=>{
        if(r.confirm){
          // TODO: 微信支付
          wx.showToast({title:'支付功能接入中',icon:'none'});
        }
      }
    });
  },

  // 保存到相册
  saveToAlbum(){
    if(!this.data.isHD){
      this.downloadHD();
      return;
    }
    wx.saveImageToPhotosAlbum({filePath:this.data.restoredPath,success:()=>{wx.showToast({title:'已保存到相册 ❤️',icon:'success'})}});
  },

  onShareAppMessage(){
    return{title:'用AI修复了这张老照片，效果太惊人了！你也来试试？',path:'/pages/index/index'};
  },
});
