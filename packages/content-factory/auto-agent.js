/**
 * AI内容自动生产Agent
 *
 * 每日自动运行：
 * 1. 热点发现 → 2. 选题决策 → 3. 多平台适配 → 4. 输出待发布清单
 *
 * 用法: node auto-agent.js
 *       node auto-agent.js --topic "AI工具推荐"  (指定主题)
 *       node auto-agent.js --week                 (生成一周内容)
 */

// ============================================================
// 内容策略配置
// ============================================================

const ACCOUNTS = {
  xiaohongshu: {
    name: 'AI好物挖掘机',
    platform: '小红书',
    tone: '闺蜜分享感，真实种草，emoji丰富',
    format: '图文笔记',
    bestTime: '12:00 或 20:00',
    hashtags: ['AI工具', '效率神器', '好物推荐', '打工人必备', 'AI搞钱'],
    contentTypes: ['工具推荐', '避坑指南', '教程干货', '对比测评', '好物清单'],
  },
  douyin: {
    name: 'AI搞钱实验室',
    platform: '抖音',
    tone: '直接、有冲击力、反常识钩子',
    format: '短视频 45-60秒',
    bestTime: '12:00 或 18:00',
    hashtags: ['AI搞钱', '一个人创业', 'AI工具', '副业', '超级个体'],
    contentTypes: ['案例故事', '实操教程', '工具测评', '思维认知', '数据复盘'],
  },
  bilibili: {
    name: '程序员副业记',
    platform: 'B站',
    tone: '技术向、真诚、深度、有逻辑',
    format: '长视频 10-15分钟',
    bestTime: '18:00 或 20:00',
    hashtags: ['独立开发', 'AI编程', '微信小程序', '副业', '程序员'],
    contentTypes: ['开发记录', '技术教程', '产品复盘', '工具分享', '趋势分析'],
  },
};

// ============================================================
// 选题库 (持续更新的热门话题)
// ============================================================

const TOPIC_POOL = {
  toolRecommendations: [
    { topic: '2026年最值得付费的5个AI工具', angle: '帮你省下冤枉钱', platforms: 'all' },
    { topic: '这些免费AI工具比付费的还好用', angle: '别再花冤枉钱了', platforms: 'all' },
    { topic: '一个人创业必备的AI工具链', angle: '成本不到¥200/月', platforms: 'all' },
    { topic: '用AI替代你团队里的每个人', angle: '设计师/文案/客服全替代', platforms: 'all' },
  ],
  tutorials: [
    { topic: '1分钟学会用AI写小红书爆款', angle: '复制这个提示词', platforms: 'all' },
    { topic: '不会编程也能用AI做小程序', angle: '手把手教程', platforms: 'bilibili' },
    { topic: 'AI一键生成100条短视频脚本', angle: '内容创业者的外挂', platforms: 'all' },
    { topic: '用AI做跨境电商的完整流程', angle: '选品到上架全自动', platforms: 'all' },
  ],
  caseStudies: [
    { topic: '小猫补光灯:1小时AI开发冲上付费榜第一', angle: '可复制的成功路径', platforms: 'all' },
    { topic: '17岁少年用AI做卡路里App年入3000万美元', angle: '最年轻的AI百万富翁', platforms: 'all' },
    { topic: '我一个人用AI做跨境月入10万的复盘', angle: '真实数据全公开', platforms: 'all' },
  ],
  mindset: [
    { topic: '为什么2026年是超级个体的元年', angle: '政策+技术+市场三重红利', platforms: 'all' },
    { topic: 'AI不会抢走你的工作，会用AI的人会', angle: '重新定义竞争力', platforms: 'all' },
    { topic: '从打工人到一人公司，我经历了什么', angle: '真实心路历程', platforms: 'all' },
  ],
};

// ============================================================
// 核心引擎
// ============================================================

class ContentAutoAgent {
  constructor() {
    this.today = new Date().toISOString().slice(0, 10);
    this.contentQueue = [];
  }

  /**
   * 主入口：生成今日内容
   */
  async generateDaily() {
    console.log(`\n🤖 AI内容Agent启动 · ${this.today}\n`);
    console.log('='.repeat(60));

    // 1. 选今日话题
    const topics = this.pickTopics(2);
    console.log(`📌 今日选题: ${topics.map(t => t.topic).join(' | ')}\n`);

    // 2. 为每个平台生成内容
    for (const [key, account] of Object.entries(ACCOUNTS)) {
      const topic = this.pickBestTopic(topics, key);
      const content = this.generatePlatformContent(account, topic, key);
      this.contentQueue.push(content);
      console.log(`✅ ${account.platform}: ${content.title}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📋 今日待发布: ${this.contentQueue.length}条\n`);

    return this.contentQueue;
  }

  /**
   * 生成一周内容
   */
  async generateWeek() {
    console.log('\n📅 生成本周内容日历...\n');
    const weekPlan = {};

    for (const [key, account] of Object.entries(ACCOUNTS)) {
      weekPlan[key] = [];
      const types = account.contentTypes;

      for (let day = 0; day < 7; day++) {
        const contentType = types[day % types.length];
        const allTopics = Object.values(TOPIC_POOL).flat();
        const candidates = allTopics.filter(t => t.platforms === 'all' || t.platforms === key);
        const topic = candidates[Math.floor(Math.random() * candidates.length)];

        const content = this.generatePlatformContent(account, topic, key);
        content.day = day;
        content.contentType = contentType;
        weekPlan[key].push(content);
      }
    }

    this.printWeekCalendar(weekPlan);
    return weekPlan;
  }

  /**
   * 选今日话题
   */
  pickTopics(count = 2) {
    const allTopics = Object.values(TOPIC_POOL).flat();
    // 优先趋势话题（TODO: 接入热点API）
    const shuffled = allTopics.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * 为平台选最佳话题
   */
  pickBestTopic(topics, platformKey) {
    const candidates = topics.filter(t => t.platforms === 'all' || t.platforms === platformKey);
    return candidates.length > 0 ? candidates[0] : topics[0];
  }

  /**
   * 为特定平台生成内容
   */
  generatePlatformContent(account, topic, platformKey) {
    const generators = {
      xiaohongshu: () => this.generateXHS(account, topic),
      douyin: () => this.generateDY(account, topic),
      bilibili: () => this.generateBILI(account, topic),
    };

    const generator = generators[platformKey];
    return generator ? generator() : { title: topic.topic, platform: account.platform };
  }

  /**
   * 小红书内容生成
   */
  generateXHS(account, topic) {
    const titles = [
      `用了这个AI工具，我直接...${topic.topic.slice(0, 15)}`,
      `千万别乱花钱买AI工具！${topic.topic.slice(0, 18)}`,
      `闺蜜问我怎么效率这么高，我说...`,
      `坦白局：我的AI工具清单 ${topic.topic.slice(0, 15)}`,
    ];

    const hooks = [
      '以前这件事要花一整天，现在30秒。',
      '踩了无数坑才总结出来的，收藏好！',
      '看完这条省下你2000块冤枉钱。',
      '打工人必备！建议全文背诵。',
    ];

    const title = topic.topic.length < 30 ? topic.topic : titles[Math.floor(Math.random() * titles.length)];
    const hook = hooks[Math.floor(Math.random() * hooks.length)];

    return {
      platform: account.platform,
      account: account.name,
      title,
      hook,
      tone: account.tone,
      format: account.format,
      bestTime: account.bestTime,
      hashtags: account.hashtags.slice(0, 5).map(t => '#' + t).join(' '),
      angle: topic.angle,
      status: 'ready',
    };
  }

  /**
   * 抖音内容生成
   */
  generateDY(account, topic) {
    const hooks = [
      { text: '一个人用AI一个月能赚多少？', duration: '0-3秒' },
      { text: '90%的人不知道AI还能干这个', duration: '0-3秒' },
      { text: '这个方法让我每天多出3小时', duration: '0-3秒' },
      { text: 'AI让一个普通人拥有了超能力', duration: '0-3秒' },
    ];

    const cta = [
      '评论区说说你在用哪个AI工具？',
      '想试试的扣1，我出一期详细教程',
      '关注我，明天教更猛的',
      '有用的话双击屏幕告诉我',
    ];

    return {
      platform: account.platform,
      account: account.name,
      title: topic.topic,
      hook: hooks[Math.floor(Math.random() * hooks.length)],
      duration: '45-60秒',
      cta: cta[Math.floor(Math.random() * cta.length)],
      tone: account.tone,
      format: account.format,
      bestTime: account.bestTime,
      hashtags: account.hashtags.map(t => '#' + t).join(' '),
      angle: topic.angle,
      status: 'ready',
    };
  }

  /**
   * B站内容生成
   */
  generateBILI(account, topic) {
    return {
      platform: account.platform,
      account: account.name,
      title: topic.topic,
      estimatedDuration: '10-15分钟',
      structure: [
        { section: '开场钩子', time: '00:00-02:00', content: '展示成果/提出悬念/讲为什么这个话题重要' },
        { section: '核心内容 Part 1', time: '02:00-07:00', content: '深入讲解第一个核心观点或实操步骤' },
        { section: '核心内容 Part 2', time: '07:00-12:00', content: '第二个核心观点或案例演示' },
        { section: '总结+互动', time: '12:00-14:00', content: '总结要点+评论互动+下期预告' },
      ],
      tone: account.tone,
      format: account.format,
      bestTime: account.bestTime,
      hashtags: account.hashtags.map(t => '#' + t).join(' '),
      angle: topic.angle,
      status: 'ready',
    };
  }

  /**
   * 打印周历
   */
  printWeekCalendar(weekPlan) {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    console.log('📅 ======== 本周内容日历 ========\n');

    for (const [key, contents] of Object.entries(weekPlan)) {
      const account = ACCOUNTS[key];
      console.log(`🎯 ${account.name} (${account.platform})`);
      console.log('-'.repeat(50));

      contents.forEach((c, i) => {
        console.log(`  ${days[i]} | ${c.contentType || '内容'} | ${c.title.slice(0, 40)}`);
      });
      console.log('');
    }

    console.log('💡 每天早10点自动生成当日内容，你只需要:');
    console.log('   小红书: 配图→发布 (3分钟)');
    console.log('   抖音: 录制→剪辑→发布 (20分钟)');
    console.log('   B站: 录制→剪辑→发布 (60分钟，每周2条)\n');
  }
}

// ============================================================
// CLI
// ============================================================

if (require.main === module) {
  const agent = new ContentAutoAgent();
  const args = process.argv.slice(2);

  (async () => {
    if (args.includes('--week')) {
      await agent.generateWeek();
    } else {
      const queue = await agent.generateDaily();
      console.log('\n📋 今日发布清单:\n');
      queue.forEach((c, i) => {
        console.log(`${i + 1}. [${c.platform}] ${c.account}`);
        console.log(`   标题: ${c.title}`);
        const hook = typeof c.hook === 'object' ? c.hook.text : (c.hook || c.angle || '—');
        console.log(`   钩子: ${hook}`);
        console.log(`   时间: ${c.bestTime}`);
        console.log(`   标签: ${c.hashtags}`);
        console.log('');
      });
    }
  })();
}

module.exports = ContentAutoAgent;
