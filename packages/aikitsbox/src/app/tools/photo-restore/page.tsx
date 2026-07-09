'use client';
import { useState, useRef, useCallback } from 'react';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

type Step = 'upload' | 'processing' | 'done';

export default function PhotoRestorePage() {
  const [step, setStep] = useState<Step>('upload');
  const [original, setOriginal] = useState<string | null>(null);
  const [restored, setRestored] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('photo-restore');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tips = [
    '每一张老照片都是一段被遗忘的时光…',
    'AI正在努力还原那些泛黄的记忆…',
    '当年拍这张照片的人，一定很珍惜这一刻…',
    '照片会褪色，但爱不会…',
    '最好的修复，是让回忆重新发光…',
  ];

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setOriginal(url);
      setStep('processing');
      setProgress(0);
      simulateProcessing(url);
    };
    reader.readAsDataURL(file);
  }, []);

  const simulateProcessing = (url: string) => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRestored(url); // In production: replace with actual AI-processed image
          setStep('done');
          return 100;
        }
        setTipIdx(Math.floor((prev / 100) * tips.length));
        return prev + Math.random() * 10 + 3;
      });
    }, 250);
  };

  const handleDownload = () => {
    setShowPayment(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <a href="/" className="text-sm text-gray-400 hover:text-primary">← 返回工具箱</a>
        <h1 className="text-3xl font-bold mt-2">📸 AI老照片修复</h1>
        <p className="text-gray-500 mt-1">上传老照片，AI自动修复、降噪、上色、增强</p>
      </div>

      {/* Upload Step */}
      {step === 'upload' && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center cursor-pointer hover:border-primary hover:bg-orange-50/50 transition-all duration-300"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <div className="text-7xl mb-6">📷</div>
          <h2 className="text-2xl font-bold mb-3">点击或拖拽上传老照片</h2>
          <p className="text-gray-400">支持 JPG/PNG/HEIC，最大 20MB</p>
          <div className="mt-8 flex justify-center gap-6 text-sm text-gray-400">
            <span>👴 爷爷奶奶的老照片</span>
            <span>📜 褪色的结婚照</span>
            <span>🖼️ 破损的旧照片</span>
          </div>
        </div>
      )}

      {/* Processing Step */}
      {step === 'processing' && (
        <div className="text-center py-12">
          <div className="relative w-72 h-72 mx-auto mb-8 rounded-2xl overflow-hidden border-2 border-gray-200">
            {original && <img src={original} alt="Original" className="w-full h-full object-contain" />}
            <div className="absolute inset-0 bg-black/30">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-scan" />
            </div>
          </div>
          <div className="w-64 mx-auto h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-lg font-semibold">{Math.round(progress)}%</p>
          <p className="text-gray-400 italic mt-4">💭 {tips[tipIdx]}</p>
        </div>
      )}

      {/* Done Step - Before/After Slider */}
      {step === 'done' && original && restored && (
        <>
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-black select-none">
            {/* After (full) */}
            <img src={restored} alt="Restored" className="absolute inset-0 w-full h-full object-contain" />
            <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full z-10">修复后</span>

            {/* Before (clipped) */}
            <div className="absolute top-0 left-0 h-full overflow-hidden z-10" style={{ width: `${sliderPos}%` }}>
              <img src={original} alt="Original" className="absolute top-0 left-0 w-[500px] h-full object-contain" style={{ width: `${100 / (sliderPos / 100)}%` }} />
              <span className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">修复前</span>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 h-full z-20 flex items-center justify-center cursor-ew-resize"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            >
              <div className="w-1 h-full bg-white shadow-lg" />
              <div className="absolute w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-lg font-bold">⟷</div>
            </div>
          </div>

          {/* Slider Control */}
          <input
            type="range" min="5" max="95" value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="w-full mt-4 accent-primary h-2 cursor-pointer"
          />

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setStep('upload'); setOriginal(null); setRestored(null); }}
              className="flex-1 py-3 rounded-full font-semibold border-2 border-gray-200 hover:bg-gray-50 transition">
              🔄 修复另一张
            </button>
            <button onClick={handleDownload}
              className="flex-1 py-3 rounded-full font-semibold bg-primary text-white hover:opacity-90 transition shadow-lg shadow-primary/25">
              💾 下载高清版 (¥{price.amount})
            </button>
          </div>
          <p className="text-center text-sm text-gray-400 mt-3">工具免费 · 喜欢的话欢迎打赏支持 ¥{price.amount}/张 · <button onClick={() => setShowPayment(true)} className="text-amber-500 hover:text-amber-600 underline">打赏支持</button></p>
        </>
      )}

      {/* Payment Modal */}
      <PaymentModal open={showPayment} onClose={() => setShowPayment(false)} amount={price.amount} productName={price.label} onPaid={() => setUnlocked(true)} />

      {/* Global mouse/touch tracker for slider */}
      {isDragging && (
        <div
          className="fixed inset-0 z-40 cursor-ew-resize"
          onMouseMove={(e) => {
            const rect = document.querySelector('.relative.w-full.h-\\[500px\\]')?.getBoundingClientRect();
            if (rect) setSliderPos(Math.min(95, Math.max(5, ((e.clientX - rect.left) / rect.width) * 100)));
          }}
          onMouseUp={() => setIsDragging(false)}
          onTouchMove={(e) => {
            const rect = document.querySelector('.relative.w-full.h-\\[500px\\]')?.getBoundingClientRect();
            if (rect) setSliderPos(Math.min(95, Math.max(5, ((e.touches[0].clientX - rect.left) / rect.width) * 100)));
          }}
          onTouchEnd={() => setIsDragging(false)}
        />
      )}
    </div>
  );
}
