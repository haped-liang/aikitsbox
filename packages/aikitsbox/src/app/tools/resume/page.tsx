'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, FileText, Copy, Download } from 'lucide-react';
import { callAI } from '@/lib/ai';

export default function ResumePage() {
  const [resumeText, setResumeText] = useState('');
  const [target, setTarget] = useState('互联网/科技');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'optimize' | 'rewrite'>('optimize');

  const industries = ['互联网/科技', '金融', '快消/零售', '制造业', '医疗', '教育', '咨询', '不限'];

  const handleOptimize = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setResult('');
    const systemPrompt = `你是资深HR和简历优化专家，熟悉${target}行业招聘标准。用STAR法则优化简历，量化成果，突出核心竞争力。`;
    const action = mode === 'optimize' ? '优化改进' : '完全重写';
    const prompt = `请${action}以下简历（目标行业：${target}）：

原始简历：
${resumeText}

${mode === 'optimize' ? '请逐条分析并给出具体优化建议和改进后的版本。' : '请基于原始信息完全重写一份专业简历。'}

要求：
- 使用STAR法则（情境-任务-行动-结果）
- 量化成果（百分比、数字）
- 突出与目标行业匹配的技能
- 控制篇幅，精简有力
- 使用专业动词`;
    const res = await callAI(prompt, { systemPrompt, temperature: 0.5, maxTokens: 2000 });
    setResult(res.text);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回工具箱
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">📄 AI简历优化</h1>
        <p className="text-slate-500 mt-1">AI智能分析简历问题，STAR法则优化，提升面试邀约率</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex gap-2 mb-1">
          <button onClick={() => setMode('optimize')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'optimize' ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            优化建议
          </button>
          <button onClick={() => setMode('rewrite')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'rewrite' ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            重写简历
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">目标行业</label>
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => (
              <button key={ind} onClick={() => setTarget(ind)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${target === ind ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">粘贴简历内容</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="请粘贴您的简历内容（或描述工作经历、教育背景、技能等）..."
            className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none resize-none text-sm"
          />
        </div>

        <button onClick={handleOptimize} disabled={loading || !resumeText.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" /> {loading ? 'AI 优化中...' : mode === 'optimize' ? '开始优化' : '开始重写'}
        </button>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3" />
            <p className="text-slate-400 text-sm">AI 正在分析简历，给出专业建议...</p>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-600">📋 {mode === 'optimize' ? '优化建议' : '重写结果'}</span>
              <button onClick={() => { navigator.clipboard.writeText(result); }}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition">
                <Copy className="w-3 h-3" /> 复制
              </button>
            </div>
            <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}</div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-slate-400 mt-6">免费分析预览 · 深度优化报告 ¥19.9/次 · Pro版无限使用</p>
    </div>
  );
}
