'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { callAIStream } from '@/lib/ai';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

export default function WeeklyReportPage() {
  const [work, setWork] = useState('');
  const [role, setRole] = useState('产品经理');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('weekly-report');
  const handleGenerate = async () => {
    if (!work.trim()) return;
    setLoading(true); setResult('');
    let text = '';
    await callAIStream(`请根据以下工作内容生成${role}周报：\n${work}\n\n要求：包含本周完成、下周计划、风险与问题、心得思考。`, (chunk) => { text += chunk; setResult(text); }, { systemPrompt: `你是${role}，写周报简洁专业。`, temperature: 0.5, maxTokens: 1000 });
    setLoading(false);
  };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"><ArrowLeft className="w-4 h-4"/> 返回工具箱</Link>
      <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900">📋 AI周报生成</h1><p className="text-slate-500 mt-1">输入本周工作内容，AI自动生成专业周报</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">你的角色</label><input value={role} onChange={e=>setRole(e.target.value)} placeholder="如：产品经理、开发工程师、设计师..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 outline-none text-sm"/></div>
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">本周工作内容</label><textarea value={work} onChange={e=>setWork(e.target.value)} placeholder="简要列出本周完成的工作，如：\n1. 完成了用户登录模块开发\n2. 参与了3次需求评审会议\n3. 修复了2个线上Bug..." className="w-full h-36 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 outline-none resize-none text-sm"/></div>
        <button onClick={handleGenerate} disabled={loading||!work.trim()} className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"><Sparkles className="w-5 h-5"/> {loading?'AI 生成中...':'生成周报'}</button>
        {loading&&<div className="text-center py-8"><div className="inline-block w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-3"/><p className="text-slate-400 text-sm">AI 正在撰写周报...</p></div>}
        {result&&<div className="border border-slate-200 rounded-xl overflow-hidden"><div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200"><span className="text-sm font-semibold text-slate-600">📋 周报</span><div className="flex gap-2"><button onClick={()=>{navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),2000)}} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition"><Copy className="w-3 h-3"/>{copied?'已复制':'复制'}</button><button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"><RefreshCw className="w-3 h-3"/>重新生成</button></div></div><div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}{!unlocked&&result&&<span className="text-pink-500 text-xs block mt-3 border-t border-pink-100 pt-3">❤️ 工具免费 · 喜欢的话欢迎打赏支持</span>}</div>{!unlocked&&<div className="px-5 pb-4"><button onClick={()=>setShowPayment(true)} className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition">❤️ 打赏支持 (¥{price.amount})</button></div>}</div>}
      </div>
      <p className="text-center text-sm text-slate-400 mt-6">工具免费 · 喜欢的话欢迎打赏支持 · <button onClick={()=>setShowPayment(true)} className="text-pink-500 hover:text-pink-600 underline">打赏支持</button></p>
      <PaymentModal open={showPayment} onClose={()=>setShowPayment(false)} amount={price.amount} productName={price.label} onPaid={()=>setUnlocked(true)}/>
    </div>
  );
}
