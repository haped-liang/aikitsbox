/**
 * 月度报表页
 * AI自动生成消费分析和预算建议
 */
Page({
  data: {
    month: '',
    totalExpense: 0,
    totalIncome: 0,
    categoryBreakdown: [],
    dailyAvg: 0,
    trend: '', // up/down/stable
    aiAdvice: '',
  },

  onShow() {
    this.loadReport();
  },

  loadReport() {
    const all = wx.getStorageSync('bk_records') || [];
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const monthRecords = all.filter(r => r.date.startsWith(month));

    const total = monthRecords.reduce((s, r) => s + Number(r.amount), 0);
    const days = now.getDate();
    const dailyAvg = total / days;

    // 分类汇总
    const catMap = {};
    monthRecords.forEach(r => {
      catMap[r.category] = (catMap[r.category] || 0) + Number(r.amount);
    });
    const breakdown = Object.entries(catMap)
      .map(([name, amount]) => ({ name, amount: amount.toFixed(2), percent: Math.round(amount/total*100) }))
      .sort((a, b) => b.amount - a.amount);

    // AI建议
    const aiAdvice = this.generateAdvice(breakdown, total);

    this.setData({
      month: now.getMonth() + 1,
      totalExpense: total.toFixed(2),
      dailyAvg: dailyAvg.toFixed(2),
      categoryBreakdown: breakdown,
      aiAdvice,
    });
  },

  generateAdvice(breakdown, total) {
    const top = breakdown[0];
    if (!top) return '开始记账吧！AI会在月底给你消费分析。';
    let advice = `📊 本月最大支出是${top.name}，占${top.percent}%。`;
    if (top.percent > 50) advice += ` 建议关注此项支出是否合理。`;
    if (total > 5000) advice += ' 总支出偏高，可以设置预算提醒。';
    return advice;
  },
});
