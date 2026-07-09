'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { callAIStream } from '@/lib/ai';

const PLATFORMS = ['小红书', '抖音', '公众号', '微博', '知乎'];
const STYLES = ['专业正式', '轻松活泼', '情感共鸣', '干货分享', '故事叙述'];

export default function AIWritePage() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('小红书');
  const [style, setStyle] = useState('轻松活泼');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult('');
    const systemPrompt = `你是专业的${platform}文案写作助手，风格：${style}。生成吸引人的文案，包含emoji、话题标签、互动引导。`;
    const prompt = `请为以下主题生成${platform}平台文案：${topic}

要求：
- 风格：${style}
- 包含吸引眼球的标题
- 正文带emoji分段
- 结尾加3-5个相关话题标签
- 鼓励读者互动`;
    let text = '';
    await callAIStream(prompt, (chunk) => { text += chunk; setResult(text); }, { systemPrompt, temperature: 0.9, maxTokens: 1500 });
    setLoading(false);
  };

  const handleCopy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回工具箱
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">✍️ AI写作助手</h1>
        <p className="text-slate-500 mt-1">AI自动生成小红书/抖音/公众号/微博/知乎多平台文案</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">写作主题 / 关键词</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：夏日防晒霜推荐、读书打卡第30天、办公室好物分享..."
            className="w-full h-28 px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none resize-none text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">目标平台</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${platform === p ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">文案风格</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button key={s} onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${style === s ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading || !topic.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" /> {loading ? 'AI 创作中...' : '开始生成'}
        </button>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-3" />
            <p className="text-slate-400 text-sm">AI 正在为你创作优质文案...</p>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-600">📄 生成结果</span>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition">
                  <Copy className="w-3 h-3" /> {copied ? '已复制' : '复制'}
                </button>
                <button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition">
                  <RefreshCw className="w-3 h-3" /> 重新生成
                </button>
              </div>
            </div>
            <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}</div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-slate-400 mt-6">免费生成预览 · 高清无水印下载 ¥9.9/篇 · Pro版无限使用</p>
    </div>
  );
}
