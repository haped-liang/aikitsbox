Page({data:{records:[]},onShow(){const r=wx.getStorageSync('restore_records')||[];this.setData({records:r})}});
