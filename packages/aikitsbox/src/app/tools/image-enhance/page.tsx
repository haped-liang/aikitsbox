'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, ImagePlus, Zap } from 'lucide-react';

const ENHANCE_MODES = ['超分辨率', '智能降噪', '色彩增强', '去雾', '综合增强'];

export default function ImageEnhancePage() {
  const [image, setImage] = useState<string | null>(null);
  const [mode, setMode] = useState('综合增强');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enhanced, setEnhanced] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
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
          setEnhanced(url); // 模拟：实际应调用AI增强API
          setProcessing(false);
          return 100;
        }
        return Math.min(prev + Math.random() * 15 + 5, 100);
      });
    }, 200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回工具箱
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">🖼️ AI图片增强</h1>
        <p className="text-slate-500 mt-1">提升分辨率、智能降噪、一键去背景 — 让图片更清晰</p>
      </div>

      {!image && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">增强模式</label>
            <div className="flex flex-wrap gap-2">
              {ENHANCE_MODES.map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === m ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div
            className="border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <ImagePlus className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">上传图片开始增强</h2>
            <p className="text-slate-400">支持 JPG/PNG/WebP，最大 20MB</p>
          </div>
        </div>
      )}

      {processing && image && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="relative w-64 h-64 mx-auto mb-6 rounded-xl overflow-hidden border border-slate-200">
            <img src={image} alt="Processing" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Zap className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <div className="w-64 mx-auto h-2.5 bg-slate-200 rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-lg font-semibold text-slate-700">{Math.round(progress)}%</p>
          <p className="text-slate-400 text-sm mt-2">AI 正在增强图片...</p>
        </div>
      )}

      {!processing && enhanced && image && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-black select-none">
              <img src={enhanced} alt="Enhanced" className="absolute inset-0 w-full h-full object-contain" />
              <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full z-10">增强后</span>
              <div className="absolute top-0 left-0 h-full overflow-hidden z-10" style={{ width: `${sliderPos}%` }}>
                <img src={image} alt="Original" className="absolute top-0 left-0 h-full object-contain" style={{ width: `${500 / (sliderPos / 100)}px` }} />
                <span className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">原图</span>
              </div>
              <div className="absolute top-0 h-full z-20 flex items-center" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
                <div className="w-1 h-full bg-white shadow-lg" />
                <div className="absolute w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-lg">⟷</div>
              </div>
            </div>
            <input type="range" min="5" max="95" value={sliderPos} onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full mt-4 accent-rose-500 h-2 cursor-pointer" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { setImage(null); setEnhanced(null); }}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition font-semibold text-slate-600">
              增强另一张
            </button>
            <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> 下载高清版
            </button>
          </div>
        </>
      )}

      <p className="text-center text-sm text-slate-400 mt-6">免费预览带水印 · 高清无水印下载 ¥9.9/张 · Pro版无限使用</p>
    </div>
  );
}
