/**
 * 统一定价配置
 * 修改此文件即可更新全站定价
 */

export interface PricePlan {
  id: string;
  amount: number;
  label: string;
  desc: string;
}

// 三档定价方案
export const PLANS: Record<string, PricePlan> = {
  single: { id: 'single', amount: 3.3, label: '一杯咖啡', desc: '表示感谢，支持我们继续开发' },
  monthly: { id: 'monthly', amount: 6.6, label: '一杯奶茶', desc: '大力支持，解锁全部高级功能' },
};

// 每个工具的单独定价（可覆盖默认）
export const TOOL_PRICING: Record<string, { amount: number; label: string }> = {
  'photo-restore': { amount: 9.9, label: '高清下载 / 张' },
  'ai-write': { amount: 9.9, label: '文案生成 / 篇' },
  'image-enhance': { amount: 9.9, label: '高清下载 / 张' },
  'bg-remove': { amount: 9.9, label: '透明PNG下载 / 张' },
  'baby-name': { amount: 19.9, label: '完整命理分析 / 次' },
  'pet-health': { amount: 9.9, label: '详细诊断报告 / 次' },
  'recipe': { amount: 9.9, label: '完整营养分析 / 次' },
  'resume': { amount: 19.9, label: '深度优化报告 / 次' },
  'contract': { amount: 29.9, label: '完整法律分析 / 次' },
  'ppt': { amount: 19.9, label: '完整PPT源文件 / 次' },
  'translate': { amount: 9.9, label: '专业翻译 / 次' },
  'voice-notes': { amount: 9.9, label: '完整转写 / 次' },
};

/** 获取工具定价（带默认值） */
export function getToolPrice(toolId: string): { amount: number; label: string } {
  return TOOL_PRICING[toolId] || { amount: 9.9, label: '单次使用' };
}
