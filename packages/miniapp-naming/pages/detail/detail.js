/**
 * 详情页 - 单个名字的完整分析
 * 变现点：基础信息免费，八字深度分析 ¥9.9
 */

Page({
  data: {
    nameData: {},
    showFullAnalysis: false,
  },

  onLoad(options) {
    try {
      const nameData = JSON.parse(decodeURIComponent(options.data));
      this.setData({ nameData });
    } catch (e) {
      console.error('名字数据解析失败:', e);
    }
  },

  /**
   * 解锁深度分析（付费功能）
   */
  unlockFullAnalysis() {
    wx.showModal({
      title: '🔮 深度八字分析',
      content: '包含完整八字排盘、五行分析、三才五格、生肖宜忌等专业内容。仅需 ¥9.9',
      confirmText: '¥9.9 立即解锁',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // TODO: 接入微信支付
          wx.showToast({ title: '支付功能开发中', icon: 'none' });
        }
      }
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    const { nameData } = this.data;
    return {
      title: `AI说「${nameData.name}」是最好的名字！💯${nameData.score}分`,
      path: '/pages/index/index',
    };
  },
});
