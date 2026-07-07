/**
 * 提示词工程库 - 经过验证的高质量Prompt模板
 *
 * 原则：
 * 1. 明确角色和任务
 * 2. 给出输出格式
 * 3. 提供示例（Few-shot）
 * 4. 设定约束和边界
 */

// ============================================================
// 方向B: 小程序相关 Prompts
// ============================================================

const NAMING_MASTER = {
  system: `你是一个专业的中文起名大师，精通五行八字、诗词典故、现代审美。
你可以为宝宝、公司、品牌、产品等提供起名服务。
你需要考虑：音韵优美、寓意吉祥、笔画搭配、时代感。`,

  babyName: (surname, gender, requirements = '') => `
请为姓"${surname}"的${gender || '宝宝'}起5个名字。

${requirements ? `额外要求：${requirements}` : ''}

要求：
1. 每个名字包含：全名、寓意解释、出处（如有典故）、五行八字分析
2. 名字要朗朗上口，避免生僻字
3. 考虑与姓氏的音韵搭配
4. 提供现代感和传统感的平衡

请以JSON格式返回：
[{"name": "", "meaning": "", "source": "", "wuxing": "", "score": 0}]
`,

  companyName: (industry, style = '现代简约', requirements = '') => `
请为一家${industry}行业的公司起5个品牌名称。

风格偏好：${style}
${requirements ? `额外要求：${requirements}` : ''}

要求：
1. 2-4个字，易读易记
2. 体现行业属性和品牌调性
3. 可注册商标（避免通用词）
4. 附带英文名建议

请以JSON格式返回。
`,
};

// ============================================================
// 方向A: 跨境电商相关 Prompts
// ============================================================

const CROSS_BORDER = {
  productResearch: (category, market = 'US') => `
分析${market}市场上"${category}"品类的选品机会。

请输出：
1. 当前TOP5热销产品及特点
2. 3个未被充分服务的细分需求
3. 建议切入的价格区间
4. 竞争程度评估（低/中/高）
5. 季节性因素

格式：Markdown报告
`,

  listingGenerator: (product, features, targetAudience) => `
为以下产品生成Amazon Listing：

产品：${product}
核心卖点：${features}
目标用户：${targetAudience}

请生成：
1. 标题（200字符以内，包含核心关键词）
2. 5个Bullet Points（每个150字符以内）
3. 产品描述（HTML格式，500字以内）
4. 搜索词建议（后端Search Terms）
5. A+ 内容框架建议

语言：英语（地道美式表达）
`,

  competitorAnalysis: (asin, market = 'US') => `
分析ASIN ${asin}在${market}市场的竞品策略：

1. 定价策略分析
2. 关键词布局（从标题和Search Terms推断）
3. 评论分析：用户最满意的3点和最不满意的3点
4. 改进机会：我们可以做得更好的地方
`,
};

// ============================================================
// 方向C: 内容工厂相关 Prompts
// ============================================================

const CONTENT_FACTORY = {
  shortVideo: (topic, platform = '抖音') => `
为"${topic}"创作一个${platform}短视频脚本。

要求：
1. 前3秒必须有钩子（吸引停留）
2. 总时长60-90秒
3. 有情绪起伏，不能平铺直叙
4. 结尾有互动引导（点赞/评论/关注）
5. 适合AI配音+画面配合

输出格式：
[时间码] 画面描述 | 旁白/台词 | 字幕重点
`,

  xiaohongshu: (topic, painPoint, solution) => `
创作一篇小红书种草笔记。

话题：${topic}
痛点：${painPoint}
解决方案：${solution}

要求：
1. 标题要有吸引力和搜索关键词
2. 开头用emoji和短句建立亲近感
3. 正文分3-5个小段落，每段配emoji
4. 标签5-8个，包含长尾搜索词
5. 语气：真实分享感，不能像广告

格式：小红书图文风格
`,
};

// ============================================================
// 方向D: SaaS工具相关 Prompts
// ============================================================

const SAAS_TOOLS = {
  contractReview: (contractText) => `
你是合同审查专家。请审查以下合同，找出风险点：

${contractText}

请输出：
1. ⚠️ 高风险条款（可能导致重大损失）
2. ⚡ 中等风险条款（需要注意）
3. 💡 修改建议（逐条给出改写建议）
4. 📋 缺失条款（应该加但没加的）
5. 📊 综合评分（1-10分，10分最有利我方）

立场：保护签约方（我方）利益
`,

  accountingAssistant: (description) => `
将以下消费描述解析为记账条目：

用户输入：${description}

请识别并返回JSON：
{
  "amount": 金额数字,
  "category": "分类（餐饮/交通/购物/住房/娱乐/医疗/教育/其他）",
  "date": "日期（如未指定则为今天）",
  "note": "备注",
  "paymentMethod": "支付方式（如可推断）",
  "tags": ["标签数组"]
}
`,
};

module.exports = {
  NAMING_MASTER,
  CROSS_BORDER,
  CONTENT_FACTORY,
  SAAS_TOOLS,
};
