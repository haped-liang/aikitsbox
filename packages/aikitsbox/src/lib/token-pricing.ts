/**
 * Token 计价系统
 *
 * 基于各大模型实际 API 成本，按 1.3x（会员）~ 1.6x（非会员）计价
 * 价格单位：人民币元
 */

// ===== 各模型实际 API 成本（每 1K tokens，单位：元） =====
// 来源：DeepSeek 官方定价 2024

interface ModelCost {
  input: number;   // 输入价格 ¥/1K tokens
  output: number;  // 输出价格 ¥/1K tokens
}

const API_COST: Record<string, ModelCost> = {
  'deepseek-chat': { input: 0.001, output: 0.002 },
  'deepseek-reasoner': { input: 0.004, output: 0.016 },
};

// 默认模型
const DEFAULT_MODEL = 'deepseek-chat';

// 利润率倍数
const MEMBER_MULTIPLIER = 1.3;
const GUEST_MULTIPLIER = 1.6;

// ===== 各工具预估 Token 消耗 =====
interface TokenEstimate {
  input: number;
  output: number;
  desc: string;
}

export const TOOL_TOKENS: Record<string, TokenEstimate> = {
  'photo-restore': { input: 50, output: 100, desc: '图像处理指令' },
  'ai-write': { input: 300, output: 800, desc: '多平台文案生成' },
  'image-enhance': { input: 50, output: 100, desc: '图像增强指令' },
  'bg-remove': { input: 50, output: 100, desc: '抠图处理指令' },
  'baby-name': { input: 200, output: 600, desc: '起名+命理分析' },
  'pet-health': { input: 250, output: 500, desc: '宠物症状分析' },
  'recipe': { input: 200, output: 600, desc: '菜谱生成' },
  'resume': { input: 500, output: 800, desc: '简历深度优化' },
  'contract': { input: 800, output: 1200, desc: '合同条款审查' },
  'ppt': { input: 400, output: 1000, desc: 'PPT大纲生成' },
  'translate': { input: 200, output: 400, desc: '文本翻译' },
  'voice-notes': { input: 100, output: 300, desc: '语音转文字' },
};

// ===== 计算函数 =====

/** 计算 API 实际成本 */
export function calcApiCost(model: string, inputTokens: number, outputTokens: number): number {
  const cost = API_COST[model] || API_COST[DEFAULT_MODEL];
  return (inputTokens * cost.input + outputTokens * cost.output) / 1000;
}

/** 计算会员价（1.3x 成本） */
export function calcMemberPrice(apiCost: number): number {
  return Math.round(apiCost * MEMBER_MULTIPLIER * 100) / 100;
}

/** 计算非会员价（1.6x 成本） */
export function calcGuestPrice(apiCost: number): number {
  return Math.round(apiCost * GUEST_MULTIPLIER * 100) / 100;
}

/** 获取工具预估价格 */
export function getToolEstimate(toolId: string): {
  apiCost: number;
  memberPrice: number;
  guestPrice: number;
  tokens: TokenEstimate;
} {
  const tokens = TOOL_TOKENS[toolId] || { input: 200, output: 500, desc: '通用AI处理' };
  const apiCost = calcApiCost(DEFAULT_MODEL, tokens.input, tokens.output);
  return {
    apiCost: Math.round(apiCost * 10000) / 10000,
    memberPrice: calcMemberPrice(apiCost),
    guestPrice: calcGuestPrice(apiCost),
    tokens,
  };
}

/** 格式化价格显示 */
export function formatPrice(price: number): string {
  if (price < 0.01) return '≈¥0.01';
  return `¥${price.toFixed(2)}`;
}

/** 充值套餐 */
export const RECHARGE_PLANS = [
  { id: 'r10', amount: 10, tokens: 500000, label: '体验包', desc: '适合轻度体验' },
  { id: 'r50', amount: 50, tokens: 2800000, label: '标准包', desc: '约 100 次文案生成' },
  { id: 'r100', amount: 100, tokens: 6000000, label: '进阶包', desc: '约 200 次AI处理' },
  { id: 'r200', amount: 200, tokens: 13000000, label: '专业包', desc: '约 500 次AI处理' },
  { id: 'r500', amount: 500, tokens: 35000000, label: '企业包', desc: '约 1500 次AI处理' },
];
