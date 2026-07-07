/**
 * AI记账管家 - 入口
 *
 * 产品逻辑：
 * 用户说/拍一句话 → AI自动识别金额/分类/时间 → 记录 → 月度报表
 *
 * 变现路径：
 * 1. 免费：每天5条记账 + 基础分类
 * 2. VIP ¥19.9/月：无限记账 + AI智能预算 + 消费预警 + 多账本 + 导出
 * 3. 广告：记账成功后展示（低干扰）
 */
App({
  globalData: {
    freeQuota: 5,
    categories: ['🍜 餐饮', '🚗 交通', '🛒 购物', '🏠 住房', '🎮 娱乐', '💊 医疗', '📚 教育', '💼 其他'],
    paymentMethods: ['微信', '支付宝', '现金', '银行卡', '信用卡'],
  },
  onLaunch() {
    this.checkQuota();
  },
  checkQuota() {
    const today = new Date().toDateString();
    const stored = wx.getStorageSync('bk_quota_date');
    if (stored !== today) {
      wx.setStorageSync('bk_quota_date', today);
      wx.setStorageSync('bk_quota_remaining', this.globalData.freeQuota);
    }
  },
  useQuota() {
    let r = wx.getStorageSync('bk_quota_remaining') || 0;
    if (r > 0) { r--; wx.setStorageSync('bk_quota_remaining', r); return true; }
    return false;
  },
  getQuota() { return wx.getStorageSync('bk_quota_remaining') || 0; },
});
