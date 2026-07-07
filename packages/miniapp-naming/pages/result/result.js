/**
 * 结果页 - 展示AI生成的名字列表
 * 变现点：前3个免费看 → 后2个需要看广告解锁
 */

Page({
  data: {
    names: [],
    type: '',
    surname: '',
    gender: '',
    style: '',

    // 解锁状态
    unlockedAll: false,
    showAdsLock: true,  // 是否显示广告解锁提示

    // 收藏状态
    favorites: {},
  },

  onLoad(options) {
    try {
      const data = JSON.parse(decodeURIComponent(options.data));
      const favorites = wx.getStorageSync('favorites') || {};

      this.setData({
        names: data.names || [],
        type: data.type || 'baby',
        surname: data.surname || '',
        gender: data.gender || '',
        style: data.style || 'modern',
        favorites,
      });
    } catch (e) {
      console.error('数据解析失败:', e);
      wx.showToast({ title: '数据加载失败', icon: 'none' });
    }
  },

  /**
   * 查看名字详情
   */
  viewDetail(e) {
    const index = e.currentTarget.dataset.index;
    const nameData = this.data.names[index];

    // 前3个免费，后2个需要看广告
    if (index >= 3 && !this.data.unlockedAll) {
      this.showAdToUnlock();
      return;
    }

    wx.navigateTo({
      url: `/pages/detail/detail?data=${encodeURIComponent(JSON.stringify(nameData))}`
    });
  },

  /**
   * 看广告解锁全部名字
   */
  showAdToUnlock() {
    wx.showModal({
      title: '🔒 解锁更多好名字',
      content: '前3个名字免费查看，观看15秒小视频即可解锁全部5个名字和深度分析',
      confirmText: '📺 观看视频解锁',
      cancelText: '暂时不了',
      success: (res) => {
        if (res.confirm) {
          // TODO: 接入微信激励视频广告
          // 目前直接解锁（开发阶段）
          this.setData({
            unlockedAll: true,
            showAdsLock: false,
          });
          wx.showToast({ title: '已解锁全部名字！', icon: 'success' });
        }
      }
    });
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite(e) {
    const index = e.currentTarget.dataset.index;
    const nameData = this.data.names[index];
    const key = nameData.name;
    const favorites = { ...this.data.favorites };

    if (favorites[key]) {
      delete favorites[key];
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      favorites[key] = {
        ...nameData,
        favoritedAt: new Date().toISOString(),
      };
      wx.showToast({ title: '已加入收藏 ❤️', icon: 'success' });
      wx.vibrateShort({ type: 'light' });
    }

    this.setData({ favorites });
    wx.setStorageSync('favorites', favorites);
  },

  /**
   * 换一批（消耗一次额度）
   */
  regenerate() {
    wx.navigateBack();
  },

  /**
   * 分享名字到微信群/朋友圈
   */
  onShareAppMessage() {
    const topName = this.data.names[0];
    return {
      title: `AI给我${this.data.surname ? this.data.surname + '姓' : ''}宝宝起了个名字：${topName.name}，💯${topName.score}分！大家觉得怎么样？`,
      path: `/pages/index/index`,
      imageUrl: '/images/share-result.png',
    };
  },
});
