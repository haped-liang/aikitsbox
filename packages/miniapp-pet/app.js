/**
 * AI宠物医生 - 入口
 * 狗狗/猫猫/兔兔/其他小宠的症状自查 + 护理建议
 *
 * 变现: 免费3次/天 + VIP¥19.9/月 (无限咨询 + 疫苗提醒 + 健康档案)
 */
App({
  globalData:{
    petTypes:['🐶 狗狗','🐱 猫猫','🐰 兔兔','🐹 仓鼠','🐦 鸟类','🐟 鱼类','其他'],
    freeQuota:3,
  },
  onLaunch(){this.checkQuota()},
  checkQuota(){
    const d=new Date().toDateString();
    if(wx.getStorageSync('pet_quota_date')!==d){wx.setStorageSync('pet_quota_date',d);wx.setStorageSync('pet_quota_num',this.globalData.freeQuota)}
  },
  useQuota(){let r=wx.getStorageSync('pet_quota_num')||0;if(r>0){r--;wx.setStorageSync('pet_quota_num',r);return true}return false},
  getQuota(){return wx.getStorageSync('pet_quota_num')||0},
});
