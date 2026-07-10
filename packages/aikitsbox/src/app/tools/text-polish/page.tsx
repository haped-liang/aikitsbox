'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { callAIStream } from '@/lib/ai';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

const MODES = ['润色优化', '扩写内容', '缩写精简', '语法纠错', '风格转换'];
const STYLES = ['专业正式', '轻松口语', '学术严谨', '营销文案', '小红书风'];

export default function TextPolishPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('润色优化');
  const [style, setStyle] = useState('专业正式');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('text-polish');

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult('');
    const systemPrompt = `你是专业文字编辑，对文本进行${mode}，目标风格：${style}。保持原意，优化表达。`;
    let text = '';
    await callAIStream(`请对以下文本进行${mode}（风格：${style}）：\n\n${input}`, (chunk) => { text += chunk; setResult(text); }, { systemPrompt, temperature: 0.5, maxTokens: 1500 });
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"><ArrowLeft className="w-4 h-4"/> 返回工具箱</Link>
      <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900">✨ AI文案润色</h1><p className="text-slate-500 mt-1">改写/扩写/缩写/纠错，一键优化文本表达</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex gap-2">{MODES.map(m=><button key={m} onClick={()=>setMode(m)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode===m?'bg-purple-500 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{m}</button>)}</div>
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">风格</label><div className="flex flex-wrap gap-2">{STYLES.map(s=><button key={s} onClick={()=>setStyle(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${style===s?'bg-purple-500 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{s}</button>)}</div></div>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="粘贴需要处理的文本..." className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 outline-none resize-none text-sm"/>
        <button onClick={handleGenerate} disabled={loading||!input.trim()} className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"><Sparkles className="w-5 h-5"/> {loading?'AI 处理中...': mode}</button>
        {loading&&<div className="text-center py-8"><div className="inline-block w-8 h-8 border-3 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-3"/><p className="text-slate-400 text-sm">AI 正在优化文本...</p></div>}
        {result&&<div className="border border-slate-200 rounded-xl overflow-hidden"><div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200"><span className="text-sm font-semibold text-slate-600">✨ 处理结果</span><div className="flex gap-2"><button onClick={()=>{navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),2000)}} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition"><Copy className="w-3 h-3"/>{copied?'已复制':'复制'}</button><button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition"><RefreshCw className="w-3 h-3"/>重新生成</button></div></div><div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}{!unlocked&&result&&<span className="text-pink-500 text-xs block mt-3 border-t border-pink-100 pt-3">❤️ 工具免费 · 喜欢的话欢迎打赏支持</span>}</div>{!unlocked&&<div className="px-5 pb-4"><button onClick={()=>setShowPayment(true)} className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition">❤️ 打赏支持 (¥{price.amount})</button></div>}</div>}
      </div>
      <p className="text-center text-sm text-slate-400 mt-6">工具免费 · 喜欢的话欢迎打赏支持 · <button onClick={()=>setShowPayment(true)} className="text-pink-500 hover:text-pink-600 underline">打赏支持</button></p>
      <PaymentModal open={showPayment} onClose={()=>setShowPayment(false)} amount={price.amount} productName={price.label} onPaid={()=>setUnlocked(true)}/>
    </div>
  );
}
