/**
 * AI起名大师 - 入口文件
 * 功能：宝宝起名 / 公司起名 / 品牌起名 / 英文起名
 *
 * 变现路径：
 * 1. 免费查看3个名字 → 看激励视频解锁全部5个
 * 2. 高级分析（八字详解）→ ¥9.9/次
 * 3. 名字收藏夹 → 会员¥19.9/月无限收藏
 */

App({
  globalData: {
    // AI配置 - 接入微信AI生态后从后台获取
    aiConfig: {
      enabled: false,  // 提交审核前改为true
      provider: 'hunyuan',  // 优先使用微信混元（免费额度）
    },
    // 用户信息
    userInfo: null,
    // 免费额度
    freeQuota: 3,  // 每天3次免费起名
    // 广告配置
    adUnitId: '',  // 激励视频广告ID
  },

  onLaunch() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;

    // 检查每日免费额度
    this.checkDailyQuota();

    // 初始化AI能力（接入微信AI生态后启用）
    // this.initAI();
  },

  /**
   * 检查每日免费起名次数
   */
  checkDailyQuota() {
    const today = new Date().toDateString();
    const stored = wx.getStorageSync('quota_date');

    if (stored !== today) {
      // 新的一天，重置额度
      wx.setStorageSync('quota_date', today);
      wx.setStorageSync('quota_remaining', this.globalData.freeQuota);
    }
  },

  /**
   * 消耗一次免费额度
   * @returns {boolean} 是否还有剩余额度
   */
  useQuota() {
    let remaining = wx.getStorageSync('quota_remaining') || 0;
    if (remaining > 0) {
      remaining--;
      wx.setStorageSync('quota_remaining', remaining);
      return true;
    }
    return false;
  },

  /**
   * 获取剩余免费次数
   */
  getRemainingQuota() {
    return wx.getStorageSync('quota_remaining') || 0;
  },
});
