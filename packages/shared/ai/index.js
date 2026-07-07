/**
 * Gagne Geld AI Engine - 共享AI调用层
 *
 * 统一封装：混元大模型（微信生态）+ DeepSeek（性价比）+ Claude（高质量）
 * 所有小程序和工具共用这一层
 */

const CONFIG = {
  // 微信AI小程序成长计划 - 免费1亿Token
  hunyuan: {
    apiKey: '',  // 从微信后台获取
    endpoint: 'https://hunyuan.weixin.qq.com/v1',
    model: 'hunyuan-lite',  // 免费额度用lite，付费用pro
  },
  // DeepSeek - 极致性价比，适合大批量调用
  deepseek: {
    apiKey: '',
    endpoint: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
  },
  // Claude - 高质量任务
  claude: {
    apiKey: '',
    endpoint: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-4-20250514',
  }
};

/**
 * 通用AI调用 - 自动选择最佳模型
 * @param {string} prompt - 提示词
 * @param {object} options - { provider, temperature, maxTokens }
 * @returns {Promise<string>}
 */
async function askAI(prompt, options = {}) {
  const { provider = 'deepseek', temperature = 0.7, maxTokens = 2000 } = options;

  // 根据任务复杂度自动选模型
  const model = selectModel(prompt, provider);

  try {
    return await callProvider(provider, model, prompt, temperature, maxTokens);
  } catch (error) {
    console.error(`AI调用失败 [${provider}]:`, error.message);
    // 自动降级到备用模型
    return await fallbackCall(prompt, temperature, maxTokens);
  }
}

/**
 * 智能模型选择
 */
function selectModel(prompt, preferredProvider) {
  const len = prompt.length;

  // 简单任务用便宜模型
  if (len < 500) return CONFIG[preferredProvider].model;
  // 复杂任务用高级模型
  if (len > 3000 && preferredProvider === 'hunyuan') return 'hunyuan-pro';

  return CONFIG[preferredProvider].model;
}

/**
 * 调用指定提供商
 */
async function callProvider(provider, model, prompt, temp, maxTokens) {
  // TODO: 实现实际API调用
  // 微信小程序中需要用 wx.request
  // Node.js环境用 fetch/axios
  console.log(`[AI] Calling ${provider}/${model}...`);

  // 占位实现 - 后续替换为真实API调用
  return `[AI Response from ${provider}/${model}]`;
}

/**
 * 降级调用 - 主模型挂了用备用的
 */
async function fallbackCall(prompt, temp, maxTokens) {
  try {
    return await callProvider('deepseek', 'deepseek-chat', prompt, temp, maxTokens);
  } catch (e) {
    throw new Error('所有AI提供商调用失败');
  }
}

module.exports = {
  askAI,
  CONFIG,
};
