/**
 * 双向敏感词过滤
 *
 * 微信审核要求：
 * 1. 用户输入 → 过滤敏感词（防止恶意输入）
 * 2. AI输出 → 过滤敏感词（防止AI生成违规内容）
 *
 * 缺失过滤 = 审核直接驳回 | 上线后被封
 */

// 基础敏感词库（后续接入专业词库API）
const SENSITIVE_WORDS = [
  // 政治类
  '政治敏感词占位1', '政治敏感词占位2',
  // 色情类
  '色情词占位1', '色情词占位2',
  // 暴力类
  '暴力词占位1', '暴力词占位2',
  // 赌博类
  '赌博词占位1', '赌博词占位2',
];

// 占位词 ⚠️ 发布前必须替换为真实敏感词库
// 建议接入：微信云开发 · 内容安全API
// https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/sec-check/

/**
 * 过滤用户输入
 * @param {string} text - 用户输入文本
 * @returns {{ passed: boolean, filtered: string, reason: string }}
 */
function filterInput(text) {
  if (!text || typeof text !== 'string') {
    return { passed: true, filtered: text || '', reason: '' };
  }

  // 长度检查
  if (text.length > 500) {
    return { passed: false, filtered: text.slice(0, 500), reason: '输入内容过长' };
  }

  // 敏感词匹配
  const lower = text.toLowerCase();
  for (const word of SENSITIVE_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      const filtered = text.replace(new RegExp(word, 'gi'), '***');
      return { passed: false, filtered, reason: `包含敏感内容："${word}"已被过滤` };
    }
  }

  return { passed: true, filtered: text, reason: '' };
}

/**
 * 过滤AI输出
 * @param {string} text - AI生成的内容
 * @returns {{ passed: boolean, filtered: string, warning: string }}
 */
function filterOutput(text) {
  if (!text || typeof text !== 'string') {
    return { passed: true, filtered: text || '', warning: '' };
  }

  let filtered = text;
  let warning = '';

  // 敏感词替换
  for (const word of SENSITIVE_WORDS) {
    if (filtered.toLowerCase().includes(word.toLowerCase())) {
      filtered = filtered.replace(new RegExp(word, 'gi'), '***');
      warning = '部分内容已被系统过滤';
    }
  }

  // 医疗健康类风险控制（起名不涉及诊断治疗，但要排除）
  const medicalPatterns = /(治疗|治愈|疗效|处方|药品|诊断)/g;
  if (medicalPatterns.test(filtered)) {
    filtered = filtered.replace(medicalPatterns, '（请咨询专业医生）');
    warning = warning || '健康相关内容仅供参考';
  }

  return { passed: warning === '', filtered, warning };
}

/**
 * 调用微信官方内容安全API（推荐！）
 */
async function wxSecCheck(text) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'contentSecCheck',
      data: { content: text },
    });
    return { passed: res.result.suggest === 'pass', detail: res.result };
  } catch (err) {
    console.error('内容安全检测失败:', err);
    // 安全侧：API挂了保守处理
    return { passed: false, detail: { suggest: 'block', label: 'sec_check_failed' } };
  }
}

module.exports = {
  filterInput,
  filterOutput,
  wxSecCheck,
};
