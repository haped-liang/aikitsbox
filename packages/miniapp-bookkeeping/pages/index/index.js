/**
 * 记账首页 - 三种输入方式
 * 1. 🎤 语音：说"午饭花了35块"→AI自动解析
 * 2. 📷 拍照：拍小票/收据→AI OCR识别
 * 3. ⌨️ 手动：传统输入
 *
 * 设计理念：3秒完成一笔记账
 */
const app = getApp();

Page({
  data: {
    quota: 5,
    inputMode: 'voice', // voice | photo | manual

    // 手动输入
    amount: '',
    category: '',
    note: '',
    date: '',
    paymentMethod: '微信',

    // 语音状态
    isRecording: false,
    voiceText: '',

    // AI解析结果
    aiResult: null,
    showAiConfirm: false,

    // 今日记录
    todayRecords: [],
    todayTotal: 0,

    // 快捷金额
    quickAmounts: ['10', '20', '35', '50', '100', '200'],

    categories: app.globalData.categories,
    paymentMethods: app.globalData.paymentMethods,
  },

  onShow() {
    this.setData({ quota: app.getQuota() });
    this.loadTodayRecords();
  },

  // ========== 🎤 语音记账 ==========

  startRecord() {
    this.setData({ isRecording: true, voiceText: '正在聆听...' });

    const recorder = wx.getRecorderManager();
    recorder.start({ duration: 10000, sampleRate: 16000, format: 'mp3' });

    recorder.onStop((res) => {
      this.setData({ isRecording: false, voiceText: 'AI识别中...' });
      this.parseVoice(res.tempFilePath);
    });

    // 3秒自动停止
    setTimeout(() => { recorder.stop(); }, 3000);
  },

  async parseVoice(filePath) {
    // TODO: 调用微信语音识别API → AI分类
    // wx.cloud.callFunction({ name: 'voiceToRecord', data: { fileID } })

    // 模拟AI解析
    const mock = { amount: 35, category: '🍜 餐饮', note: '午饭', paymentMethod: '微信' };
    this.setData({ aiResult: mock, showAiConfirm: true, voiceText: '' });
  },

  confirmAiResult() {
    this.saveRecord(this.data.aiResult);
    this.setData({ showAiConfirm: false, aiResult: null });
  },

  // ========== 📷 拍照记账 ==========

  takePhoto() {
    wx.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: (res) => {
        wx.showLoading({ title: 'AI识别中...' });
        // TODO: OCR识别 → AI解析
        setTimeout(() => {
          wx.hideLoading();
          const mock = { amount: 128.5, category: '🛒 购物', note: '超市购物', paymentMethod: '支付宝' };
          this.setData({ aiResult: mock, showAiConfirm: true });
        }, 1500);
      }
    });
  },

  // ========== ✏️ 手动记账 ==========

  onAmountInput(e) { this.setData({ amount: e.detail.value }); },
  onNoteInput(e) { this.setData({ note: e.detail.value }); },

  selectCategory(e) {
    this.setData({ category: e.currentTarget.dataset.cat });
  },

  quickAmount(e) {
    const amt = e.currentTarget.dataset.amt;
    this.setData({ amount: amt });
    // 快速记账：点了金额直接AI猜分类
    this.autoCategorize(parseFloat(amt));
  },

  autoCategorize(amount) {
    // AI根据金额猜分类
    const guess = amount <= 20 ? '🍜 餐饮' : amount <= 200 ? '🛒 购物' : amount <= 1000 ? '🏠 住房' : '💼 其他';
    this.setData({ category: guess });
  },

  manualSave() {
    const { amount, category, note, paymentMethod } = this.data;
    if (!amount || !category) {
      wx.showToast({ title: '请填写金额和分类', icon: 'none' });
      return;
    }
    this.saveRecord({ amount: parseFloat(amount), category, note, paymentMethod });
  },

  // ========== 保存 & 存储 ==========

  saveRecord(record) {
    if (!app.useQuota()) {
      wx.showToast({ title: '今日免费次数用完，明天再来', icon: 'none' });
      return;
    }

    const finalRecord = {
      ...record,
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
    };

    const records = wx.getStorageSync('bk_records') || [];
    records.unshift(finalRecord);
    wx.setStorageSync('bk_records', records);

    this.setData({
      quota: app.getQuota(),
      amount: '', note: '', category: '', aiResult: null, showAiConfirm: false,
    });

    wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: `已记账 ¥${record.amount}`, icon: 'success' });

    this.loadTodayRecords();
  },

  loadTodayRecords() {
    const all = wx.getStorageSync('bk_records') || [];
    const today = new Date().toISOString().slice(0, 10);
    const todayRecords = all.filter(r => r.date === today);
    const todayTotal = todayRecords.reduce((s, r) => s + Number(r.amount), 0);
    this.setData({ todayRecords, todayTotal });
  },
});
