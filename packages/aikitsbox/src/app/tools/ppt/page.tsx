'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Presentation, Copy, Layers } from 'lucide-react';
import { callAI } from '@/lib/ai';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

const SLIDE_COUNTS = [5, 10, 15, 20];
const STYLES = ['商务专业', '创意设计', '学术严谨', '简洁大气', '科技感'];

export default function PPTPage() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(10);
  const [style, setStyle] = useState('商务专业');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('ppt');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult('');
    const systemPrompt = `你是专业PPT策划师。为客户生成${style}风格的PPT大纲，每页包含标题、核心内容要点、配图建议。内容结构清晰、逻辑连贯。`;
    const prompt = `请为以下主题生成一份${slideCount}页的PPT大纲：

主题：${topic}
风格：${style}

要求：
1. 封面页 — 吸引眼球的标题
2. 目录页 — 清晰的框架
3. 内容页（${slideCount - 3}页）— 每页含：
   - 页面标题
   - 3-5个核心要点
   - 配图/图表建议
   - 演讲备注
4. 总结页
5. 致谢页

让内容有数据支撑、有案例、有洞察。`;
    const res = await callAI(prompt, { systemPrompt, temperature: 0.7, maxTokens: 3000 });
    setResult(res.text);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回工具箱
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">📊 AI PPT生成</h1>
        <p className="text-slate-500 mt-1">输入主题，AI自动生成完整PPT大纲和内容框架</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">PPT主题</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：2026年AI行业发展趋势分析、Q3季度工作汇报、新能源汽车市场研究报告..."
            className="w-full h-28 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none resize-none text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2"><Layers className="w-3.5 h-3.5 inline mr-1" />页数</label>
            <div className="flex flex-wrap gap-2">
              {SLIDE_COUNTS.map((n) => (
                <button key={n} onClick={() => setSlideCount(n)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${slideCount === n ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {n}页
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">风格</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button key={s} onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${style === s ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading || !topic.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Presentation className="w-5 h-5" /> {loading ? 'AI 生成中...' : '生成PPT大纲'}
        </button>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3" />
            <p className="text-slate-400 text-sm">AI 正在策划PPT结构...</p>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-600">📊 PPT大纲</span>
              <button onClick={() => { navigator.clipboard.writeText(result); }}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition">
                <Copy className="w-3 h-3" /> 复制
              </button>
            </div>
            <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}{!unlocked && result && <span className="text-amber-500 text-xs block mt-3 border-t border-amber-100 pt-3">🔒 以上为演示模式预览 · 付费解锁完整无水印内容</span>}</div>
            {!unlocked && (
              <div className="px-5 pb-4">
                <button onClick={() => setShowPayment(true)} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition">
                  🔓 打赏支持 (¥{price.amount})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-slate-400 mt-6">工具免费 · 喜欢的话欢迎打赏支持 ¥{price.amount}/{price.label.split('/')[1]?.trim() || '次'} · <button onClick={() => setShowPayment(true)} className="text-amber-500 hover:text-amber-600 underline">打赏支持</button></p>

      <PaymentModal open={showPayment} onClose={() => setShowPayment(false)} amount={price.amount} productName={price.label} onPaid={() => setUnlocked(true)} />
    </div>
  );
}
