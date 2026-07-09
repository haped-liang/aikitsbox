/**
 * 全局功能开关
 *
 * 通过环境变量控制功能上线/下线
 * 静态导出时写入构建产物，无法运行时切换
 */

export const FEATURES = {
  /** 会员系统：需公司注册后才能开启 */
  membership: process.env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === 'true',

  /** 真实AI：需配置 API Key */
  realAI: !!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,

  /** 后端 API 地址 */
  apiBase: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001',
} as const;

/** 调试：打印当前功能开关状态 */
if (typeof window !== 'undefined') {
  console.log(
    '%c🔧 AI工具箱 功能开关',
    'font-weight:bold;color:#6366f1',
    '\n  会员系统:', FEATURES.membership ? '✅ 已启用' : '⏳ 公司注册后开启',
    '\n  真实AI:', FEATURES.realAI ? '✅ 已连接' : '📡 演示模式',
    '\n  API:', FEATURES.apiBase
  );
}
