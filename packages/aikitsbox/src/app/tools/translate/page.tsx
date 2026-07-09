'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, ArrowRightLeft, RefreshCw } from 'lucide-react';
import { callAI } from '@/lib/ai';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

const LANGUAGES: Record<string, string> = {
  '英文': 'English', '日文': '日本語', '韩文': '한국어',
  '法文': 'Français', '德文': 'Deutsch', '西班牙文': 'Español',
  '俄文': 'Русский', '阿拉伯文': 'العربية', '葡萄牙文': 'Português',
  '意大利文': 'Italiano', '泰文': 'ไทย', '越南文': 'Tiếng Việt',
};

export default function TranslatePage() {
  const [source, setSource] = useState('中文');
  const [target, setTarget] = useState('英文');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('translate');

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('');
    const systemPrompt = `你是专业翻译专家，精通${source}和${target}。翻译要准确、流畅、符合目标语言表达习惯，保留原文语气和风格。专业术语要准确。`;
    const prompt = `请将以下${source}文本翻译成${target}：\n\n${input}\n\n要求：\n- 翻译准确，保持原意\n- 符合${target}表达习惯\n- 保留原文语气\n- 如有专业术语请准确翻译`;
    const res = await callAI(prompt, { systemPrompt, temperature: 0.3, maxTokens: 2000 });
    setResult(res.text);
    setLoading(false);
  };

  const handleSwap = () => { setSource(target); setTarget(source); setInput(result); setResult(''); };
  const handleCopy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const allLangs = ['中文', ...Object.keys(LANGUAGES)];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回工具箱
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">🌐 AI翻译</h1>
        <p className="text-slate-500 mt-1">多语种互译，支持专业术语，比传统翻译更懂上下文</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        {/* Language selector */}
        <div className="flex items-center gap-3">
          <select value={source} onChange={(e) => setSource(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-sm bg-white font-semibold">
            {allLangs.map((l) => <option key={l} value={l}>{l}{l !== '中文' ? ` (${LANGUAGES[l]})` : ''}</option>)}
          </select>
          <button onClick={handleSwap} className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition flex-shrink-0">
            <ArrowRightLeft className="w-5 h-5 text-slate-600" />
          </button>
          <select value={target} onChange={(e) => setTarget(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-sm bg-white font-semibold">
            {allLangs.filter((l) => l !== '中文').map((l) => <option key={l} value={l}>{l} ({LANGUAGES[l]})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">输入文本</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`输入要翻译的${source}文本...`}
            className="w-full h-36 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none resize-none text-sm"
          />
        </div>

        <button onClick={handleTranslate} disabled={loading || !input.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" /> {loading ? '翻译中...' : `翻译成${target}`}
        </button>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3" />
            <p className="text-slate-400 text-sm">AI 正在翻译...</p>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-600">📝 {target}翻译</span>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition">
                  <Copy className="w-3 h-3" /> {copied ? '已复制' : '复制'}
                </button>
                <button onClick={handleTranslate} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
                  <RefreshCw className="w-3 h-3" /> 优化翻译
                </button>
              </div>
            </div>
            <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}{!unlocked && result && <span className="text-amber-500 text-xs block mt-3 border-t border-amber-100 pt-3">🔒 以上为演示模式预览 · 付费解锁完整无水印内容</span>}</div>
            {!unlocked && (
              <div className="px-5 pb-4">
                <button onClick={() => setShowPayment(true)} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition">
                  🔓 解锁完整版 (¥{price.amount})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-slate-400 mt-6">免费演示预览 · 无水印完整版 ¥{price.amount}/{price.label.split('/')[1]?.trim() || '次'} · <button onClick={() => setShowPayment(true)} className="text-amber-500 hover:text-amber-600 underline">立即解锁</button></p>

      <PaymentModal open={showPayment} onClose={() => setShowPayment(false)} amount={price.amount} productName={price.label} onPaid={() => setUnlocked(true)} />
    </div>
  );
}
