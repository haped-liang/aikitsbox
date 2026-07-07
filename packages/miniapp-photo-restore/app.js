/**
 * AI老照片修复 - 入口
 *
 * 产品逻辑：
 * 上传老照片 → AI修复(降噪+增强+上色+提升分辨率) → 前后对比 → 分享裂变
 *
 * 变现：
 * - 免费：低分辨率预览 + 水印
 * - ¥9.9/张：高清无水印下载
 * - ¥29.9/3张包
 *
 * 不申报AI类目：归类为"工具→图像处理"，AI算力放云端
 */
App({
  globalData:{
    freeQuota:1, // 每天1次免费预览
    pricing:{single:9.9, pack3:29.9},
  },
  onLaunch(){this.checkQuota()},
  checkQuota(){
    const d=new Date().toDateString();
    if(wx.getStorageSync('restore_date')!==d){wx.setStorageSync('restore_date',d);wx.setStorageSync('restore_quota',this.globalData.freeQuota)}
  },
  useFreeQuota(){let r=wx.getStorageSync('restore_quota')||0;if(r>0){r--;wx.setStorageSync('restore_quota',r);return true}return false},
  getQuota(){return wx.getStorageSync('restore_quota')||0},
});
