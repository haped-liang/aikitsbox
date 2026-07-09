'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ClipboardCheck, AlertTriangle, Shield, Copy } from 'lucide-react';
import { callAI } from '@/lib/ai';

const CONTRACT_TYPES = ['劳动合同', '租房合同', '买卖合同', '服务协议', 'NDA保密协议', '其他'];

export default function ContractPage() {
  const [contractText, setContractText] = useState('');
  const [contractType, setContractType] = useState('劳动合同');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!contractText.trim()) return;
    setLoading(true);
    setResult('');
    const systemPrompt = `你是资深法务专家和合同审查律师。审查${contractType}，识别风险条款、不公平条款、法律漏洞，给出具体修改建议。必须声明：AI分析仅供参考，重要合同请咨询专业律师。`;
    const prompt = `请审查以下${contractType}：

${contractText}

请从以下维度分析：
1. ⚠️ 风险等级（高/中/低）
2. 🔴 高风险条款（如有）- 逐条列出原文 + 风险说明 + 修改建议
3. 🟡 需要注意的条款 - 可能对你不利的条款
4. ✅ 建议增加的条款 - 保护你权益的条款
5. 📋 总体评价和改进建议
6. ⚖️ 法律依据（适用法规）`;
    const res = await callAI(prompt, { systemPrompt, temperature: 0.2, maxTokens: 2500 });
    setResult(res.text);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回工具箱
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">⚖️ AI合同审查</h1>
        <p className="text-slate-500 mt-1">上传合同，AI自动识别风险条款并给出修改建议</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">合同类型</label>
          <div className="flex flex-wrap gap-2">
            {CONTRACT_TYPES.map((ct) => (
              <button key={ct} onClick={() => setContractType(ct)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${contractType === ct ? 'bg-purple-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {ct}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">粘贴合同内容</label>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="请粘贴需要审查的合同条款内容..."
            className="w-full h-44 px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-50 outline-none resize-none text-sm"
          />
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-purple-700">AI审查仅供参考，不构成法律建议。重要合同请务必咨询专业律师。</p>
        </div>

        <button onClick={handleReview} disabled={loading || !contractText.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Shield className="w-5 h-5" /> {loading ? 'AI 审查中...' : '开始审查'}
        </button>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-3 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-3" />
            <p className="text-slate-400 text-sm">AI 正在逐条审查合同条款...</p>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-600">📋 合同审查报告</span>
              <button onClick={() => { navigator.clipboard.writeText(result); }}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition">
                <Copy className="w-3 h-3" /> 复制
              </button>
            </div>
            <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}</div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-slate-400 mt-6">免费审查预览 · 完整法律分析报告 ¥29.9/次 · Pro版无限使用</p>
    </div>
  );
}
