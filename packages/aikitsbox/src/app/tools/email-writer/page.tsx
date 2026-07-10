'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { callAIStream } from '@/lib/ai';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

const TONES = ['正式商务', '友好亲切', '简洁直接', '诚恳道歉', '感谢信'];
const TYPES = ['工作邮件', '商务合作', '客户沟通', '求职邮件', '日常沟通'];

export default function EmailWriterPage() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('正式商务');
  const [type, setType] = useState('工作邮件');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('email-writer');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setResult('');
    const systemPrompt = `你是专业商务邮件写作助手。写${tone}风格的${type}。包含主题行、称呼、正文、结尾敬语。`;
    let text = '';
    await callAIStream(`请写一封${type}，主题：${topic}。风格：${tone}。要求：主题行醒目、正文清晰简洁、语气得体。`, (chunk) => { text += chunk; setResult(text); }, { systemPrompt, temperature: 0.6, maxTokens: 1000 });
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"><ArrowLeft className="w-4 h-4"/> 返回工具箱</Link>
      <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900">📧 AI邮件助手</h1><p className="text-slate-500 mt-1">自动生成专业商务邮件，支持多种语气和场景</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">邮件主题</label><textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="例如：申请延长项目交付时间、邀请参加产品发布会..." className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none resize-none text-sm"/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-slate-700 mb-2">邮件类型</label><div className="flex flex-wrap gap-2">{TYPES.map(t=><button key={t} onClick={()=>setType(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${type===t?'bg-blue-500 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t}</button>)}</div></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-2">语气风格</label><div className="flex flex-wrap gap-2">{TONES.map(t=><button key={t} onClick={()=>setTone(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${tone===t?'bg-blue-500 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t}</button>)}</div></div>
        </div>
        <button onClick={handleGenerate} disabled={loading||!topic.trim()} className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"><Sparkles className="w-5 h-5"/> {loading?'AI 撰写中...':'生成邮件'}</button>
        {loading&&<div className="text-center py-8"><div className="inline-block w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3"/><p className="text-slate-400 text-sm">AI 正在撰写邮件...</p></div>}
        {result&&<div className="border border-slate-200 rounded-xl overflow-hidden"><div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200"><span className="text-sm font-semibold text-slate-600">📧 生成结果</span><div className="flex gap-2"><button onClick={()=>{navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),2000)}} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition"><Copy className="w-3 h-3"/>{copied?'已复制':'复制'}</button><button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition"><RefreshCw className="w-3 h-3"/>重新生成</button></div></div><div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}{!unlocked&&result&&<span className="text-pink-500 text-xs block mt-3 border-t border-pink-100 pt-3">❤️ 工具免费 · 喜欢的话欢迎打赏支持</span>}</div>{!unlocked&&<div className="px-5 pb-4"><button onClick={()=>setShowPayment(true)} className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition">❤️ 打赏支持 (¥{price.amount})</button></div>}</div>}
      </div>
      <p className="text-center text-sm text-slate-400 mt-6">工具免费 · 喜欢的话欢迎打赏支持 · <button onClick={()=>setShowPayment(true)} className="text-pink-500 hover:text-pink-600 underline">打赏支持</button></p>
      <PaymentModal open={showPayment} onClose={()=>setShowPayment(false)} amount={price.amount} productName={price.label} onPaid={()=>setUnlocked(true)}/>
    </div>
  );
}
