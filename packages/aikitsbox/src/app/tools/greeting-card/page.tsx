'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { callAIStream } from '@/lib/ai';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

const OCCASIONS = ['春节祝福', '生日祝福', '中秋节', '元旦新年', '情人节', '母亲节', '父亲节', '教师节', '毕业祝福', '婚礼祝福'];
const STYLES = ['温馨感人', '幽默风趣', '文艺诗意', '正式大气', '简短有力'];

export default function GreetingCardPage() {
  const [recipient, setRecipient] = useState('');
  const [occasion, setOccasion] = useState('春节祝福');
  const [style, setStyle] = useState('温馨感人');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('greeting-card');
  const handleGenerate = async () => {
    setLoading(true); setResult('');
    let text = '';
    await callAIStream(`请为${recipient||'朋友'}写一段${occasion}，风格：${style}。要有创意、走心、适合直接发送。`, (chunk) => { text += chunk; setResult(text); }, { systemPrompt: `你是祝福语写作专家。写${style}的${occasion}。根据收信人定制。`, temperature: 0.9, maxTokens: 600 });
    setLoading(false);
  };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"><ArrowLeft className="w-4 h-4"/> 返回工具箱</Link>
      <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900">🎉 AI节日祝福</h1><p className="text-slate-500 mt-1">生成走心祝福语，支持多种节日和风格，一键复制发送</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-2">收信人</label><input value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="如：妈妈、李总、小美..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 outline-none text-sm"/></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-2">节日/场合</label><select value={occasion} onChange={e=>setOccasion(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 outline-none text-sm bg-white">{OCCASIONS.map(o=><option key={o}>{o}</option>)}</select></div>
        </div>
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">风格</label><div className="flex flex-wrap gap-2">{STYLES.map(s=><button key={s} onClick={()=>setStyle(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${style===s?'bg-amber-500 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{s}</button>)}</div></div>
        <button onClick={handleGenerate} disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"><Sparkles className="w-5 h-5"/> {loading?'AI 创作中...':'生成祝福语'}</button>
        {loading&&<div className="text-center py-8"><div className="inline-block w-8 h-8 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-3"/><p className="text-slate-400 text-sm">AI 正在撰写祝福...</p></div>}
        {result&&<div className="border border-slate-200 rounded-xl overflow-hidden"><div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200"><span className="text-sm font-semibold text-slate-600">🎉 祝福语</span><div className="flex gap-2"><button onClick={()=>{navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),2000)}} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition"><Copy className="w-3 h-3"/>{copied?'已复制':'复制'}</button><button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition"><RefreshCw className="w-3 h-3"/>再来一条</button></div></div><div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}{!unlocked&&result&&<span className="text-pink-500 text-xs block mt-3 border-t border-pink-100 pt-3">❤️ 工具免费 · 喜欢的话欢迎打赏支持</span>}</div>{!unlocked&&<div className="px-5 pb-4"><button onClick={()=>setShowPayment(true)} className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition">❤️ 打赏支持 (¥{price.amount})</button></div>}</div>}
      </div>
      <p className="text-center text-sm text-slate-400 mt-6">工具免费 · 喜欢的话欢迎打赏支持 · <button onClick={()=>setShowPayment(true)} className="text-pink-500 hover:text-pink-600 underline">打赏支持</button></p>
      <PaymentModal open={showPayment} onClose={()=>setShowPayment(false)} amount={price.amount} productName={price.label} onPaid={()=>setUnlocked(true)}/>
    </div>
  );
}
