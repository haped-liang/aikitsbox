/**
 * 隐私政策页
 * 微信审核强制要求：小程序必须有独立的隐私政策页面
 * AI小程序额外要求：说明AI数据处理方式
 */
Page({
  data: {
    lastUpdated: '2026年7月6日',
    version: '1.0.0',
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '隐私政策' });
  },
});
