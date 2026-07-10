'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, RefreshCw, Code } from 'lucide-react';
import { callAIStream } from '@/lib/ai';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

const MODES = ['生成代码', '解释代码', '调试Bug', '代码优化', '语言转换'];
const LANGS = ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust', 'SQL', 'HTML/CSS'];

export default function CodeHelperPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('生成代码');
  const [lang, setLang] = useState('Python');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('code-helper');

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult('');
    const systemPrompt = `你是资深${lang}程序员。${mode==='生成代码'?'根据需求写代码，带注释':mode==='解释代码'?'逐行解释代码逻辑':mode==='调试Bug'?'找出bug并修复':mode==='代码优化'?'优化代码性能':`将代码转换为${lang}`}。`;
    let text = '';
    await callAIStream(`请${mode}（语言：${lang}）：\n\n${input}`, (chunk) => { text += chunk; setResult(text); }, { systemPrompt, temperature: 0.3, maxTokens: 2000 });
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"><ArrowLeft className="w-4 h-4"/> 返回工具箱</Link>
      <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900">💻 AI代码助手</h1><p className="text-slate-500 mt-1">生成代码、解释逻辑、调试Bug、优化性能，多语言支持</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex flex-wrap gap-2">{MODES.map(m=><button key={m} onClick={()=>setMode(m)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode===m?'bg-green-500 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{m}</button>)}</div>
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">编程语言</label><div className="flex flex-wrap gap-2">{LANGS.map(l=><button key={l} onClick={()=>setLang(l)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${lang===l?'bg-green-500 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{l}</button>)}</div></div>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={mode==='生成代码'?'描述你需要的功能，如：写一个Python函数读取CSV文件并计算平均值':'粘贴代码...'} className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:border-green-400 outline-none resize-none text-sm font-mono"/>
        <button onClick={handleGenerate} disabled={loading||!input.trim()} className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"><Code className="w-5 h-5"/> {loading?'AI 处理中...': mode}</button>
        {loading&&<div className="text-center py-8"><div className="inline-block w-8 h-8 border-3 border-green-200 border-t-green-500 rounded-full animate-spin mb-3"/><p className="text-slate-400 text-sm">AI 正在处理代码...</p></div>}
        {result&&<div className="border border-slate-200 rounded-xl overflow-hidden"><div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200"><span className="text-sm font-semibold text-slate-600">💻 处理结果</span><div className="flex gap-2"><button onClick={()=>{navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),2000)}} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition"><Copy className="w-3 h-3"/>{copied?'已复制':'复制'}</button><button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition"><RefreshCw className="w-3 h-3"/>重新生成</button></div></div><div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 font-mono">{result}{!unlocked&&result&&<span className="text-pink-500 text-xs block mt-3 border-t border-pink-100 pt-3 font-sans">❤️ 工具免费 · 喜欢的话欢迎打赏支持</span>}</div>{!unlocked&&<div className="px-5 pb-4"><button onClick={()=>setShowPayment(true)} className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition">❤️ 打赏支持 (¥{price.amount})</button></div>}</div>}
      </div>
      <p className="text-center text-sm text-slate-400 mt-6">工具免费 · 喜欢的话欢迎打赏支持 · <button onClick={()=>setShowPayment(true)} className="text-pink-500 hover:text-pink-600 underline">打赏支持</button></p>
      <PaymentModal open={showPayment} onClose={()=>setShowPayment(false)} amount={price.amount} productName={price.label} onPaid={()=>setUnlocked(true)}/>
    </div>
  );
}
