'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, Upload, Copy, FileAudio } from 'lucide-react';
import { callAI } from '@/lib/ai';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

export default function VoiceNotesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('voice-notes');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleTranscribe = async () => {
    if (!file) return;
    setLoading(true);
    setResult('');
    // 模拟转写（真实实现需要调用语音识别API如 Whisper）
    const systemPrompt = '你是专业语音转文字助手。将音频内容准确转写为文字，标出说话人，添加标点。';
    const prompt = `请模拟转写音频文件「${file.name}」(大小: ${(file.size / 1024 / 1024).toFixed(1)}MB)。

由于浏览器端语音转文字需要专门的AI服务（如 OpenAI Whisper API），当前为演示模式。

如需真实语音转文字功能，可以：
1. 接入阿里云语音识别API
2. 使用 OpenAI Whisper API
3. 使用 Web Speech API（浏览器内置，免费）`;
    const res = await callAI(prompt, { systemPrompt, temperature: 0.3, maxTokens: 1000 });
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
        <h1 className="text-3xl font-bold text-slate-900">🎙️ AI语音转文字</h1>
        <p className="text-slate-500 mt-1">录音/视频自动转文字，支持中英文混合识别</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        {/* Upload area */}
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${file ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
        >
          <input ref={fileInputRef} type="file" accept="audio/*,video/*" className="hidden" onChange={handleFileChange} />
          {file ? (
            <div>
              <FileAudio className="w-12 h-12 mx-auto mb-3 text-blue-500" />
              <p className="font-semibold text-slate-700">{file.name}</p>
              <p className="text-sm text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-3 text-sm text-blue-500 hover:text-blue-700">重新选择</button>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-600">点击或拖拽上传音频/视频</p>
              <p className="text-sm text-slate-400 mt-1">支持 MP3/WAV/M4A/MP4，最大 100MB</p>
            </div>
          )}
        </div>

        <button onClick={handleTranscribe} disabled={loading || !file}
          className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Mic className="w-5 h-5" /> {loading ? '转写中...' : '开始转写'}
        </button>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3" />
            <p className="text-slate-400 text-sm">AI 正在识别语音...</p>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-600">📝 转写结果</span>
              <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 transition">
                <Copy className="w-3 h-3" /> {copied ? '已复制' : '复制'}
              </button>
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
