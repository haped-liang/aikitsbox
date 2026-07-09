'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Scissors, ImagePlus } from 'lucide-react';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

export default function BGRemovePage() {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('bg-remove');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setImage(url);
      startProcessing(url);
    };
    reader.readAsDataURL(file);
  };

  const startProcessing = (url: string) => {
    setProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setResult(url); // 模拟：实际应调用AI抠图API（如 remove.bg）
          setProcessing(false);
          return 100;
        }
        return Math.min(prev + Math.random() * 20 + 5, 100);
      });
    }, 180);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回工具箱
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">✂️ AI抠图</h1>
        <p className="text-slate-500 mt-1">5秒智能抠图，发丝级精度，支持批量处理</p>
      </div>

      {!image && (
        <div
          className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-16 text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <Scissors className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">上传图片开始抠图</h2>
          <p className="text-slate-400">支持 JPG/PNG/WebP，最大 20MB</p>
          <div className="mt-6 flex justify-center gap-4 text-sm text-slate-400">
            <span>👤 人物照片</span>
            <span>🛍️ 商品图片</span>
            <span>🐱 宠物照片</span>
          </div>
        </div>
      )}

      {processing && image && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="relative w-64 h-64 mx-auto mb-6 rounded-xl overflow-hidden border border-slate-200">
            <img src={image} alt="Processing" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-rose-100/30">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-400/60 to-transparent animate-scan" />
            </div>
          </div>
          <div className="w-64 mx-auto h-2.5 bg-slate-200 rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-lg font-semibold text-slate-700">{Math.round(progress)}%</p>
          <p className="text-slate-400 text-sm mt-2">AI 正在识别主体，精确分离背景...</p>
        </div>
      )}

      {!processing && result && image && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex gap-2 mb-4">
              <button onClick={() => setShowOriginal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!showOriginal ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                去背景
              </button>
              <button onClick={() => setShowOriginal(true)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${showOriginal ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                原图对比
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIwIiB5PSIwIiBmaWxsPSIjZjBmMGYwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTAiIHk9IjEwIiBmaWxsPSIjZjBmMGYwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTAiIHk9IjAiIGZpbGw9IiNlOGU4ZTgiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIwIiB5PSIxMCIgZmlsbD0iI2U4ZThlOCIgLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+PC9zdmc+')]">
              <img src={showOriginal ? image : result} alt={showOriginal ? 'Original' : 'No BG'}
                className="w-full max-h-[400px] object-contain mx-auto" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { setImage(null); setResult(null); }}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition font-semibold text-slate-600">
              抠另一张
            </button>
            <button onClick={() => setShowPayment(true)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> 下载透明PNG (¥{price.amount})
            </button>
          </div>
        </>
      )}

      <p className="text-center text-sm text-slate-400 mt-6">工具免费 · 喜欢的话欢迎打赏支持 ¥{price.amount}/张 · <button onClick={() => setShowPayment(true)} className="text-amber-500 hover:text-amber-600 underline">打赏支持</button></p>

      <PaymentModal open={showPayment} onClose={() => setShowPayment(false)} amount={price.amount} productName={price.label} onPaid={() => setUnlocked(true)} />
    </div>
  );
}
