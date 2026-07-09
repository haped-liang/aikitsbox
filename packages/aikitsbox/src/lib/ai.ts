/**
 * AI API 模块 — 浏览器端统一 AI 调用封装
 *
 * 支持 DeepSeek API（主要）+ 模拟模式（开发/演示）
 * API Key 通过 NEXT_PUBLIC_DEEPSEEK_API_KEY 环境变量注入
 */

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIResult {
  text: string;
  model: string;
}

const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '';
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';

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
  return { text: data.choices?.[0]?.message?.content || '', model: DEEPSEEK_MODEL };
}

async function simulateAI(prompt: string, options: AIOptions = {}): Promise<AIResult> {
  const delay = 800 + Math.random() * 1500;
  await new Promise((r) => setTimeout(r, delay));

  const { systemPrompt } = options;
  const context = systemPrompt || '';
  const userPrompt = prompt.slice(0, 100);

  let text = '';
  if (context.includes('写作') || context.includes('文案')) {
    text = '【AI生成文案 - 演示模式】\n\n在这个快节奏的时代，真正的成长来自于那些静下心来思考的时刻。\n\n人生就像一场马拉松，不是谁跑得快就能赢，而是谁能坚持到最后。\n\n---\n💡 配置 NEXT_PUBLIC_DEEPSEEK_API_KEY 环境变量即可获得真实 AI 生成内容';
  } else if (context.includes('起名') || context.includes('名字')) {
    text = '【AI 起名建议 - 演示模式】\n\n1. 宇轩 — 气宇轩昂，寓意胸怀广阔\n2. 思源 — 饮水思源，寓意不忘根本\n3. 知行 — 知行合一，寓意学以致用\n4. 沐辰 — 如沐春风，星辰大海\n5. 致远 — 宁静致远，任重道远\n\n---\n💡 配置 NEXT_PUBLIC_DEEPSEEK_API_KEY 环境变量即可获得真实 AI 生成内容';
  } else if (context.includes('翻译')) {
    text = '【AI 翻译 - 演示模式】\n\n原文：' + userPrompt + '\n\n翻译：This is a demo translation. Configure NEXT_PUBLIC_DEEPSEEK_API_KEY for real AI translation.';
  } else if (context.includes('简历')) {
    text = '【AI 简历优化 - 演示模式】\n\n1. 量化成果：将"负责项目"改为"主导3个项目，提升效率30%"\n2. 关键词优化：增加行业技能关键词\n3. 结构优化：工作经历按倒序排列\n4. 简洁表达：删除冗余描述，控制篇幅\n\n---\n💡 配置 NEXT_PUBLIC_DEEPSEEK_API_KEY 环境变量即可获得真实 AI 优化';
  } else {
    text = '【AI 回复 - 演示模式】\n\n针对「' + (userPrompt || '您的输入') + '」的分析结果：\n\n这是一个演示响应。配置 NEXT_PUBLIC_DEEPSEEK_API_KEY 环境变量即可获得真实 AI 生成内容。\n\n支持的 AI 提供商：DeepSeek（推荐，性价比高）';
  }

  return { text, model: 'simulated' };
}

export async function callAI(prompt: string, options: AIOptions = {}): Promise<AIResult> {
  try {
    if (DEEPSEEK_API_KEY) return await callDeepSeek(prompt, options);
    console.log('[AI] No API Key, using demo mode');
    return await simulateAI(prompt, options);
  } catch (error: any) {
    console.error('[AI] Call failed, fallback to demo:', error.message);
    return await simulateAI(prompt, options);
  }
}

export async function callAIStream(
  prompt: string,
  onChunk: (chunk: string) => void,
  options: AIOptions = {}
): Promise<void> {
  const result = await callAI(prompt, options);
  for (let i = 0; i < result.text.length; i += 3) {
    onChunk(result.text.slice(i, i + 3));
    await new Promise((r) => setTimeout(r, 20));
  }
}
