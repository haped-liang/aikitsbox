'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, Copy } from 'lucide-react';
import { callAI } from '@/lib/ai';

const GENDERS = ['不限', '男孩', '女孩'];
const STYLES = ['诗经楚辞', '唐诗宋词', '五行八字', '现代简约', '古风雅韵', '寓意深远'];

export default function BabyNamePage() {
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('不限');
  const [style, setStyle] = useState('诗经楚辞');
  const [count, setCount] = useState(10);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!surname.trim()) return;
    setLoading(true);
    setResult('');
    const systemPrompt = '你是专业的起名顾问，精通诗经楚辞、唐诗宋词、五行八字、姓名学。为每个名字提供出处、寓意和五行分析。';
    const prompt = `请为「${surname}」姓${gender !== '不限' ? gender : ''}宝宝生成${count}个名字。

要求：
- 风格：${style}
- 每个名字附上寓意解释（含典籍出处如有）
- 标注五行属性
- 避免生僻字
- 音韵优美，朗朗上口
- 如果是公司起名/品牌命名也一并给出建议`;
    const res = await callAI(prompt, { systemPrompt, temperature: 0.8, maxTokens: 2000 });
    setResult(res.text);
    setLoading(false);
  };

  const handleCopy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回工具箱
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">👶 AI起名大师</h1>
        <p className="text-slate-500 mt-1">宝宝起名 / 公司起名 / 品牌命名，融合五行八字与诗词典故</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">姓氏</label>
            <input
              type="text" value={surname} onChange={(e) => setSurname(e.target.value)}
              placeholder="输入姓氏，如：张"
              maxLength={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-50 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">名字个数</label>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-50 outline-none text-sm bg-white">
              {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n} 个</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">性别</label>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <button key={g} onClick={() => setGender(g)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${gender === g ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">起名风格</label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button key={s} onClick={() => setStyle(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${style === s ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading || !surname.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" /> {loading ? 'AI 起名中...' : '开始起名'}
        </button>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-3" />
            <p className="text-slate-400 text-sm">AI 正在翻阅典籍为你精选好名...</p>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-600">📜 起名结果</span>
              <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition">
                <Copy className="w-3 h-3" /> {copied ? '已复制' : '复制'}
              </button>
            </div>
            <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}</div>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 text-center">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl mb-1">📖</div>
          <p className="text-xs text-slate-500">诗经楚辞</p>
          <p className="text-xs text-slate-400">典籍出处</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl mb-1">☯️</div>
          <p className="text-xs text-slate-500">五行八字</p>
          <p className="text-xs text-slate-400">命理分析</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl mb-1">🏢</div>
          <p className="text-xs text-slate-500">公司品牌</p>
          <p className="text-xs text-slate-400">工商可注册</p>
        </div>
      </div>

      <p className="text-center text-sm text-slate-400 mt-6">免费生成预览 · 完整命理分析 ¥19.9/次 · Pro版无限使用</p>
    </div>
  );
}
