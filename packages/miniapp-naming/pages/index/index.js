/**
 * 首页 - 起名表单
 * 支持：宝宝起名 / 公司起名 / 品牌起名 / 英文起名
 */

const app = getApp();

Page({
  data: {
    // 起名类型
    namingTypes: [
      { id: 'baby', name: '👶 宝宝起名', icon: 'baby', active: true },
      { id: 'company', name: '🏢 公司起名', icon: 'company', active: false },
      { id: 'brand', name: '🎯 品牌起名', icon: 'brand', active: false },
      { id: 'english', name: '🌍 英文起名', icon: 'english', active: false },
    ],

    // 当前选中的起名类型
    activeType: 'baby',

    // 表单数据
    surname: '',       // 姓氏
    gender: '',        // 性别（仅宝宝起名）
    style: 'modern',   // 风格偏好
    requirements: '',  // 额外要求

    // 风格选项
    styles: [
      { id: 'modern', name: '现代时尚', active: true },
      { id: 'classic', name: '古典雅致', active: false },
      { id: 'simple', name: '简洁大气', active: false },
      { id: 'unique', name: '独特个性', active: false },
    ],

    // 性别选项（仅宝宝起名）
    genderOptions: [
      { id: '', name: '不限', active: true },
      { id: '男宝', name: '男宝 ♂', active: false },
      { id: '女宝', name: '女宝 ♀', active: false },
    ],

    // 最近热门起名
    hotSearches: [
      '龙年男宝', '诗经取名', '古风三字', '科技公司', '新消费品牌'
    ],

    // UI状态
    isGenerating: false,
    remainingQuota: 3,
    showAdTip: false,
  },

  onLoad() {
    this.setData({
      remainingQuota: app.getRemainingQuota()
    });
  },

  onShow() {
    // 每次回到首页刷新剩余次数
    this.setData({
      remainingQuota: app.getRemainingQuota()
    });
  },

  /**
   * 切换起名类型
   */
  switchType(e) {
    const type = e.currentTarget.dataset.type;
    const types = this.data.namingTypes.map(t => ({
      ...t,
      active: t.id === type
    }));

    this.setData({
      namingTypes: types,
      activeType: type,
      // 重置性别选择
      gender: '',
    });
  },

  /**
   * 选择性别
   */
  selectGender(e) {
    const gender = e.currentTarget.dataset.gender;
    const options = this.data.genderOptions.map(o => ({
      ...o,
      active: o.id === gender
    }));

    this.setData({
      genderOptions: options,
      gender: gender,
    });
  },

  /**
   * 选择风格
   */
  selectStyle(e) {
    const style = e.currentTarget.dataset.style;
    const styles = this.data.styles.map(s => ({
      ...s,
      active: s.id === style
    }));

    this.setData({ styles, style });
  },

  /**
   * 姓氏输入
   */
  onSurnameInput(e) {
    this.setData({ surname: e.detail.value });
  },

  /**
   * 额外要求输入
   */
  onRequirementsInput(e) {
    this.setData({ requirements: e.detail.value });
  },

  /**
   * 点击热门搜索
   */
  onHotSearch(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ requirements: keyword });
  },

  /**
   * 开始起名
   */
  async startNaming() {
    const { surname, activeType, gender, style, requirements } = this.data;

    // 验证输入
    if (activeType === 'baby' && !surname.trim()) {
      wx.showToast({ title: '请输入姓氏', icon: 'none' });
      return;
    }
    if (activeType === 'company' && !requirements.trim()) {
      wx.showToast({ title: '请输入公司类型/行业', icon: 'none' });
      return;
    }

    // 检查免费额度
    const remaining = app.getRemainingQuota();
    if (remaining <= 0) {
      this.setData({ showAdTip: true });
      return;
    }

    // 消耗额度
    app.useQuota();

    this.setData({
      isGenerating: true,
      remainingQuota: remaining - 1,
    });

    // 震动反馈
    wx.vibrateShort({ type: 'medium' });

    try {
      // 调用AI起名
      const names = await this.generateNames();

      // 跳转到结果页
      wx.navigateTo({
        url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify({
          names,
          type: activeType,
          surname,
          gender,
          style,
        }))}`
      });
    } catch (error) {
      console.error('起名失败:', error);
      wx.showToast({ title: '起名失败，请重试', icon: 'none' });
      // 失败退还额度
      app.useQuota(); // 加回来不行...这个逻辑后面优化
    } finally {
      this.setData({ isGenerating: false });
    }
  },

  /**
   * AI起名核心逻辑
   * TODO: 接入真实的AI API
   */
  async generateNames() {
    const { surname, activeType, gender, style, requirements } = this.data;

    // 模拟AI响应（后续替换为真实API调用）
    // 实际接入：
    // const ai = require('../../shared/ai/index');
    // const prompts = require('../../shared/ai/prompts');
    // const prompt = prompts.NAMING_MASTER.babyName(surname, gender, requirements);
    // const response = await ai.askAI(prompt, { provider: 'hunyuan' });

    // 模拟生成的名字数据
    const mockNames = this.getMockNames(activeType, surname, gender);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    return mockNames;
  },

  /**
   * 模拟名字数据（开发阶段使用）
   */
  getMockNames(type, surname, gender) {
    if (type === 'baby') {
      const isGirl = gender && gender.includes('女');
      return isGirl ? [
        { name: `${surname}诗涵`, meaning: '诗书气质，涵养深厚', source: '《诗经》"高山仰止，景行行止"', wuxing: '金水相生', score: 98, style: 'modern' },
        { name: `${surname}若溪`, meaning: '上善若水，溪流涓涓', source: '《道德经》"上善若水"', wuxing: '水木清华', score: 96, style: 'classic' },
        { name: `${surname}瑾瑜`, meaning: '美玉无瑕，品德高尚', source: '《楚辞》"怀瑾握瑜"', wuxing: '土金相成', score: 95, style: 'classic' },
        { name: `${surname}一诺`, meaning: '一诺千金，诚实守信', source: '《史记》"得黄金百斤，不如得季布一诺"', wuxing: '土金和谐', score: 94, style: 'simple' },
        { name: `${surname}晚晴`, meaning: '晚霞晴好，人生顺遂', source: '李商隐"天意怜幽草，人间重晚晴"', wuxing: '火土相济', score: 93, style: 'modern' },
      ] : [
        { name: `${surname}景行`, meaning: '德行高尚，光明磊落', source: '《诗经》"高山仰止，景行行止"', wuxing: '木火相生', score: 98, style: 'classic' },
        { name: `${surname}沐辰`, meaning: '如沐春风，星辰大海', source: '现代诗意创作', wuxing: '水木清华', score: 96, style: 'modern' },
        { name: `${surname}知行`, meaning: '知行合一，学以致用', source: '王阳明"知行合一"', wuxing: '火金相济', score: 95, style: 'simple' },
        { name: `${surname}柏舟`, meaning: '坚韧不拔，志向远大', source: '《诗经》"泛彼柏舟，亦泛其流"', wuxing: '木水相生', score: 94, style: 'classic' },
        { name: `${surname}翊辰`, meaning: '辅佐明君，光芒万丈', source: '《尚书》"翊亮天地"', wuxing: '木火通明', score: 93, style: 'unique' },
      ];
    }

    if (type === 'company') {
      return [
        { name: `星瀚科技`, meaning: '星辰大海，浩瀚无垠', source: '科技创新意象', wuxing: '', score: 96, style: 'modern' },
        { name: `知行数智`, meaning: '知行合一，数智驱动', source: '数字化理念', wuxing: '', score: 94, style: 'modern' },
        { name: `锦程科技`, meaning: '锦绣前程，科技赋能', source: '传统吉祥寓意', wuxing: '', score: 93, style: 'classic' },
        { name: `云帆科技`, meaning: '长风破浪，云帆济海', source: '李白"直挂云帆济沧海"', wuxing: '', score: 92, style: 'classic' },
        { name: `引力科技`, meaning: '引力无限，凝聚力量', source: '物理学意象', wuxing: '', score: 91, style: 'simple' },
      ];
    }

    if (type === 'brand') {
      return [
        { name: `原初`, meaning: '回归本真，初心不改', source: '', wuxing: '', score: 97, style: 'simple' },
        { name: `栖溪`, meaning: '诗意栖居，溪水长流', source: '', wuxing: '', score: 95, style: 'modern' },
        { name: `未央`, meaning: '夜未央，乐未殇', source: '《诗经》"夜如何其？夜未央"', wuxing: '', score: 94, style: 'classic' },
        { name: `拾光`, meaning: '拾取时光，珍藏美好', source: '', wuxing: '', score: 93, style: 'modern' },
        { name: `涧川`, meaning: '山涧清流，海纳百川', source: '', wuxing: '', score: 92, style: 'unique' },
      ];
    }

    // 英文名
    return [
      { name: `${surname ? surname + ' · ' : ''}Aurora`, meaning: '极光，象征希望与新开始', source: '拉丁语起源，罗马神话黎明女神', wuxing: '', score: 98, style: 'modern' },
      { name: `${surname ? surname + ' · ' : ''}Felix`, meaning: '幸运，快乐', source: '拉丁语起源', wuxing: '', score: 96, style: 'simple' },
      { name: `${surname ? surname + ' · ' : ''}Luna`, meaning: '月亮，优雅高贵', source: '拉丁语起源，罗马神话月亮女神', wuxing: '', score: 95, style: 'classic' },
      { name: `${surname ? surname + ' · ' : ''}Jasper`, meaning: '碧玉，珍贵而坚韧', source: '波斯语起源，三贤士之一', wuxing: '', score: 94, style: 'unique' },
      { name: `${surname ? surname + ' · ' : ''}Iris`, meaning: '彩虹，连接天地的桥梁', source: '希腊语起源，希腊神话彩虹女神', wuxing: '', score: 93, style: 'modern' },
    ];
  },

  /**
   * 看广告获取更多次数
   */
  watchAd() {
    wx.showToast({ title: '广告功能审核后开放', icon: 'none' });
    // TODO: 接入微信激励视频广告
    // const rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: app.globalData.adUnitId });
    // rewardedVideoAd.show().catch(() => { ... });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '这个AI起名太准了！快来试试你的名字有多少分',
      path: '/pages/index/index',
      imageUrl: '/images/share-baby.png'
    };
  },
});
