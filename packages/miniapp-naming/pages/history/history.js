/**
 * 历史记录页 - 收藏夹
 * 会员功能：¥19.9/月无限收藏 + 跨设备同步
 */
Page({
  data: {
    favorites: [],
    isEmpty: true,
  },

  onShow() {
    this.loadFavorites();
  },

  loadFavorites() {
    const favs = wx.getStorageSync('favorites') || {};
    const list = Object.values(favs).sort((a, b) =>
      new Date(b.favoritedAt) - new Date(a.favoritedAt)
    );
    this.setData({
      favorites: list,
      isEmpty: list.length === 0,
    });
  },

  clearAll() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有收藏吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('favorites');
          this.loadFavorites();
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '我用AI起了这么多好名字，快来一起试试！',
      path: '/pages/index/index',
    };
  },
});
