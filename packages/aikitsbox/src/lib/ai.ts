/**
 * AI API 模块 — 浏览器端统一 AI 调用封装
 *
 * 支持 DeepSeek API（需配置 NEXT_PUBLIC_DEEPSEEK_API_KEY）+ 演示模式
 * 演示模式生成逼真的样例结果，标注「演示模式」水印
 */

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIResult {
  text: string;
  model: string;
  isDemo: boolean;
}

const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '';
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';
const DEMO_WATERMARK = '\n\n---\n🔒 演示模式 · 付费解锁完整内容 · [查看定价](/pricing)';

async function callDeepSeek(prompt: string, options: AIOptions = {}): Promise<AIResult> {
  const { temperature = 0.7, maxTokens = 2000, systemPrompt } = options;
  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const res = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: DEEPSEEK_MODEL, messages, temperature, max_tokens: maxTokens }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DeepSeek API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return { text: data.choices?.[0]?.message?.content || '', model: DEEPSEEK_MODEL, isDemo: false };
}

/* ===== 演示模式 — 各工具逼真样例 ===== */

function simWriting(prompt: string): string {
  const topic = prompt.slice(0, 60).replace('请为以下主题生成', '').replace('平台文案：', '').trim();
  return `✨ ${topic || '精选好物推荐'}

姐妹们！！这个东西我不允许还有人不知道！！🔥🔥

我真的被惊艳到了谁懂啊！！！

作为一个用了3年的老用户，这次的新品真的把体验拉满了好吗😭

📌 先说结论：闭眼入！绝对不踩雷！

▫️ 颜值方面：拿到手的第一感觉就是「高级」，细节处理得特别好
▫️ 功能方面：比上一代提升了不止一个档次！反应速度超快
▫️ 性价比：这个价位能买到这种品质，真的没谁了

💡 使用小tips：
1️⃣ 第一次使用建议先看说明书
2️⃣ 搭配他们家的XX一起用效果翻倍
3️⃣ 记得领券再下单！能省好几十

🏷️ 推荐指数：⭐⭐⭐⭐⭐

你们有用过吗？评论区告诉我你的体验！💬

#好物推荐 #必买清单 #提升幸福感 #分享日常 #种草`;
}

function simBabyName(prompt: string): string {
  const surname = prompt.match(/「(.+?)」姓/)?.[1] || '张';
  return `📜 **「${surname}」姓宝宝起名方案**

═══════════════════════════════

**一、男孩推荐**

| 名字 | 寓意 | 出处/五行 |
|------|------|-----------|
| ${surname}宇轩 | 气宇轩昂，胸怀广阔 | 《楚辞》· 木 |
| ${surname}思源 | 饮水思源，不忘根本 | 庾信《徵调曲》· 水 |
| ${surname}知行 | 知行合一，学以致用 | 王阳明心学 · 火 |
| ${surname}沐辰 | 如沐春风，星辰大海 | 《诗经》· 金 |
| ${surname}逸飞 | 飘逸洒脱，飞黄腾达 | 《滕王阁序》· 土 |

**二、女孩推荐**

| 名字 | 寓意 | 出处/五行 |
|------|------|-----------|
| ${surname}若兰 | 气质如兰，优雅芬芳 | 《离骚》· 木 |
| ${surname}诗涵 | 诗书气质，内涵深厚 | 唐诗意象 · 水 |
| ${surname}悦然 | 喜悦自然，阳光开朗 | 《论语》· 火 |
| ${surname}瑾瑜 | 美玉无瑕，品德高尚 | 《楚辞·九章》· 土 |
| ${surname}清婉 | 清丽婉约，温婉动人 | 《诗经·郑风》· 金 |

**三、中性/品牌推荐**
- ${surname}一诺 — 一诺千金，诚信为本
- ${surname}凌霄 — 壮志凌云，气冲霄汉

💡 起名小贴士：建议结合宝宝出生八字、生肖、声调搭配综合考量。`;
}

function simPetHealth(prompt: string): string {
  return `🏥 **宠物健康分析报告**

═══════════════════════════════

**⚠️ 严重程度评估：中等偏低**

---

**🔍 可能病因分析（按概率排序）**

1️⃣ **饮食不当**（概率 65%）
   最近是否更换过粮食品牌？或误食了人类食物？
   建议：暂停零食，观察24小时

2️⃣ **应激反应**（概率 20%）
   环境变化（搬家、新成员、噪音等）可能导致
   建议：提供安静舒适的环境

3️⃣ **轻微肠胃炎**（概率 15%）
   细菌或病毒感染引起
   建议：如持续超过48小时建议就医

---

**🏠 家庭护理建议**

✅ 暂时禁食6-8小时（但要保证饮水）
✅ 恢复进食后少量多餐，选择易消化的食物
✅ 观察精神状态和排便情况
✅ 保持环境温暖，避免着凉

**🚨 需要立即就医的信号**
❌ 持续呕吐/腹泻超过24小时
❌ 拒绝饮水
❌ 精神萎靡、牙龈苍白
❌ 体温异常（正常38-39°C）

💡 每只宠物情况不同，以上仅供参考。`;
}

function simRecipe(prompt: string): string {
  const ingredients = prompt.match(/以下食材[：:]?\s*(.+)/)?.[1]?.slice(0, 80) || '鸡蛋、番茄';
  return `👨‍🍳 **AI 智能菜谱推荐**

📦 基于你的食材：${ingredients}

═══════════════════════════════

**🥘 推荐一：家常番茄炒蛋**

⏱ 准备5分钟 | 烹饪8分钟 | ⭐ 简单

📋 食材清单
✅ 鸡蛋 3个
✅ 番茄 2个
🛒 葱姜蒜（可选）
🛒 白糖、盐

📝 做法步骤
1. 鸡蛋打散加少许盐，番茄切块
2. 热油炒蛋至凝固盛出
3. 爆香蒜末，下番茄炒出汁
4. 加入炒蛋翻炒，加盐糖调味
5. 撒葱花出锅！

💡 秘诀：番茄炒之前用开水烫一下去皮，口感更好

---

**🥘 推荐二：番茄鸡蛋面**

⏱ 准备3分钟 | 烹饪10分钟 | ⭐ 简单

📝 速成法：将推荐一的炒蛋浇在煮好的面条上，
加入面汤，撒上葱花和香油即可！

🍽 营养信息（推荐一）：热量 ~280kcal |蛋白质 15g |碳水 12g`;
}

function simResume(prompt: string): string {
  return `📋 **AI 简历优化报告**

═══════════════════════════════

**总体评分：B+ → 优化后可达 A-**

---

**🔴 问题 1：缺乏量化成果**

❌ 原内容特征：「负责项目管理」「参与市场推广」
✅ 优化为：「主导3个跨部门项目，按时交付率100%，成本节约15%」

**🔴 问题 2：关键词密度不足**

你的简历缺少行业核心关键词。建议增加：
▸ 数据分析 ▸ 团队协作 ▸ 流程优化
▸ 项目管理 ▸ 跨部门沟通 ▸ ROI提升

**🔴 问题 3：结构可优化**

建议采用「STAR法则」重写工作经历：
▸ **S**ituation — 背景情境
▸ **T**ask — 任务目标
▸ **A**ction — 采取行动
▸ **R**esult — 量化结果

---

**✅ 改进后示例**

> 主导公司CRM系统迁移项目（S），目标在3个月内完成数据迁移和团队培训（T）。制定分阶段迁移方案，协调技术、销售、客服3个部门（A）。提前2周完成，数据准确率99.8%，销售团队效率提升35%（R）。

---

💡 建议针对目标岗位JD调整关键词和经历侧重。`;
}

function simContract(prompt: string): string {
  return `⚖️ **AI 合同审查报告**

═══════════════════════════════

**📊 风险评级：🟡 中等风险**

---

**🔴 高风险条款**

**条款 1 — 单方解约权**
> 原文识别：「甲方有权随时终止本合同」

⚠️ 风险：赋予对方单方面终止权，你方无任何保障
📝 修改建议：改为「双方协商一致可终止，或提前30日书面通知」

**条款 2 — 管辖约定**
> 原文识别：「争议由甲方所在地法院管辖」

⚠️ 风险：异地诉讼成本高
📝 修改建议：争取改为「被告所在地」或「合同履行地」

---

**🟡 需注意条款**

▸ 付款期限：建议明确具体日期和逾期违约金比例
▸ 保密条款：保密期限较短，建议延长至合同终止后3年
▸ 知识产权：成果归属不够明确

---

**✅ 建议增加条款**

▸ 不可抗力条款
▸ 数据保护/隐私条款
▸ 争议解决阶梯（协商→调解→仲裁→诉讼）

---

⚖️ 免责声明：AI审查仅供参考，正式签约请咨询专业律师。`;
}

function simPPT(prompt: string): string {
  const topic = prompt.slice(0, 60).replace('请为以下主题生成', '').replace('一份', '').replace('PPT大纲：', '').trim();
  return `📊 **「${topic || '项目汇报'}」PPT大纲**

═══════════════════════════════

**🟦 SLIDE 1 — 封面**
标题：${topic || '项目汇报'}
副标题：洞察·策略·行动
演讲人 / 日期

**🟦 SLIDE 2 — 目录**
1. 背景与现状分析
2. 核心洞察与机会
3. 策略方案详解
4. 实施路线图
5. 预期成果与风险

**🟦 SLIDE 3 — 背景分析**
• 行业趋势：AI技术加速渗透，市场年增长率35%+
• 竞争格局：头部玩家已布局，差异化机会在细分领域
• 用户需求：调研显示78%用户期待更智能的解决方案
📊 建议配图：行业增长曲线图

**🟦 SLIDE 4-7 — 核心内容**
（每页3-5个要点 + 数据支撑 + 案例佐证）

**🟦 SLIDE 8 — 实施路线图**
Phase 1 (1-3月)：MVP开发与内测
Phase 2 (4-6月)：灰度发布与迭代
Phase 3 (7-12月)：规模化推广

**🟦 SLIDE 9 — 总结与展望**
核心结论 | 下一步行动 | Q&A

💡 每页建议配图/图表，保持简洁有力。`;
}

function simTranslate(prompt: string): string {
  const text = prompt.replace(/请将以下[\s\S]*?翻译[\s\S]*?：/, '').replace(/要求：[\s\S]*$/, '').trim().slice(0, 200);
  return `🌐 **翻译结果**

═══════════════════════════

📝 原文（中文）：
${text || '（待翻译文本）'}

---

🔤 译文（English）：
${text ? text.split('').reverse().join('').slice(0, 200) : 'Translation will appear here. This is a demo mode preview.'}

---

💡 提示：演示模式下的翻译为示意内容。付费解锁可获得专业级 AI 翻译，支持12种语言互译，准确率提升300%。`;
}

function simDefault(prompt: string): string {
  const preview = prompt.slice(0, 120);
  return `🤖 **AI 分析结果**

针对你的输入「${preview}...」：

═══════════════════════════════

本工具正在演示模式中运行。

当前展示的是样例结果，让你预览 AI 工具的功能和效果。

付费解锁后即可获得：
✅ 真实 AI 生成的专业内容
✅ 无水量印的高清输出
✅ 可复制、可下载的完整结果
✅ 优先处理速度`;
}

function simVoice(prompt: string): string {
  return `🎙️ **语音转写结果**

═══════════════════════════════

[00:00:05] 大家好，今天我们来聊一聊人工智能在医疗领域的应用。

[00:00:15] 随着深度学习技术的不断发展，AI辅助诊断已经成为了现实。

[00:00:28] 特别是在医学影像分析方面，AI的准确率已经超过了部分资深医生。

[00:00:40] 但是这并不意味着AI会取代医生，而是会成为医生的得力助手。

[00:00:52] 未来，我们期待看到更多的AI+医疗的创新应用落地。

---

📊 识别信息：中文普通话 | 时长 ~1分钟 | 置信度 95%+

💡 提示：演示模式仅展示样例。付费解锁可上传真实音频/视频文件进行转写。`;
}

/** 根据系统提示词智能选择演示模板 */
function simulateAI(prompt: string, options: AIOptions = {}): Promise<AIResult> {
  const delay = 600 + Math.random() * 1200;
  const { systemPrompt = '' } = options;
  const ctx = systemPrompt + prompt.slice(0, 200);

  let text: string;
  if (ctx.includes('写作') || ctx.includes('文案') || ctx.includes('小红书') || ctx.includes('抖音')) {
    text = simWriting(prompt);
  } else if (ctx.includes('起名') || ctx.includes('名字') || ctx.includes('命名')) {
    text = simBabyName(prompt);
  } else if (ctx.includes('宠物') || ctx.includes('兽医') || ctx.includes('症状')) {
    text = simPetHealth(prompt);
  } else if (ctx.includes('菜谱') || ctx.includes('食谱') || ctx.includes('食材') || ctx.includes('厨师')) {
    text = simRecipe(prompt);
  } else if (ctx.includes('简历') || ctx.includes('HR') || ctx.includes('STAR')) {
    text = simResume(prompt);
  } else if (ctx.includes('合同') || ctx.includes('法务') || ctx.includes('审查') || ctx.includes('风险')) {
    text = simContract(prompt);
  } else if (ctx.includes('PPT') || ctx.includes('幻灯片') || ctx.includes('大纲') || ctx.includes('演讲')) {
    text = simPPT(prompt);
  } else if (ctx.includes('翻译') || ctx.includes('语言')) {
    text = simTranslate(prompt);
  } else if (ctx.includes('语音') || ctx.includes('转写') || ctx.includes('音频') || ctx.includes('录音')) {
    text = simVoice(prompt);
  } else {
    text = simDefault(prompt);
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve({ text: text + DEMO_WATERMARK, model: 'demo', isDemo: true }), delay);
  });
}

/* ===== 公开 API ===== */

export async function callAI(prompt: string, options: AIOptions = {}): Promise<AIResult> {
  try {
    if (DEEPSEEK_API_KEY) return await callDeepSeek(prompt, options);
    console.log('[AI] Demo mode — no API key configured');
    return await simulateAI(prompt, options);
  } catch (error: any) {
    console.error('[AI] Fallback to demo:', error.message);
    return await simulateAI(prompt, options);
  }
}

export async function callAIStream(
  prompt: string,
  onChunk: (chunk: string) => void,
  options: AIOptions = {}
): Promise<void> {
  const result = await callAI(prompt, options);
  const text = result.text;
  for (let i = 0; i < text.length; i += 5) {
    onChunk(text.slice(i, i + 5));
    await new Promise((r) => setTimeout(r, 15));
  }
}
