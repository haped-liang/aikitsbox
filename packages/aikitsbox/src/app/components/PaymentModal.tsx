'use client';
import { useState } from 'react';
import { X, Check, Smartphone, Copy } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  productName: string;
  onPaid?: () => void;
}

type PayMethod = 'wechat' | 'alipay';

export default function PaymentModal({ open, onClose, amount, productName, onPaid }: PaymentModalProps) {
  const [method, setMethod] = useState<PayMethod>('wechat');
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(amount));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaid = () => {
    setShowConfirm(true);
    setTimeout(() => {
      setShowConfirm(false);
      onPaid?.();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
          <div className="text-3xl mb-2">❤️</div>
          <h3 className="text-xl font-bold">支持我们</h3>
          <p className="text-white/60 text-sm mt-1">如果觉得好用，请我们喝杯咖啡吧 ☕</p>
        </div>

        {/* Price */}
        <div className="text-center py-5 border-b border-slate-100">
          <p className="text-xs text-slate-400 mb-1">建议打赏金额</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-extrabold text-slate-900">¥{amount}</span>
          </div>
          <div className="flex justify-center gap-2 mt-3">
            {[6.66, 9.99, 19.99].map(a => (
              <button key={a} onClick={() => handleCopyAmount()} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${amount === a ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>¥{a}</button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">随缘打赏，金额不限 ❤️</p>
        </div>

        {/* Donation note */}
        <div className="mx-6 mb-2 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-xl p-3 text-center">
          <p className="text-xs text-pink-600">❤️ 工具永久免费，打赏 purely 自愿，感谢每一份支持</p>
        </div>

        {/* Payment method tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setMethod('wechat')}
            className={`flex-1 py-3.5 text-sm font-semibold transition relative ${
              method === 'wechat' ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="text-lg mr-1.5">💚</span>微信支付
            {method === 'wechat' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-green-500 rounded-full" />}
          </button>
          <button
            onClick={() => setMethod('alipay')}
            className={`flex-1 py-3.5 text-sm font-semibold transition relative ${
              method === 'alipay' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="text-lg mr-1.5">💙</span>支付宝
            {method === 'alipay' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-500 rounded-full" />}
          </button>
        </div>

        {/* QR Code */}
        <div className="p-8 text-center">
          <div className="inline-block p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
            {/* QR Image: 优先加载 PNG（真实收款码），失败则用 SVG 占位 */}
            <img
              src={method === 'wechat' ? '/images/wechat-pay-qr.png' : '/images/alipay-qr.png'}
              alt={method === 'wechat' ? '微信收款码' : '支付宝收款码'}
              className="w-48 h-48 object-contain rounded-xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Try SVG fallback
                target.src = method === 'wechat' ? '/images/wechat-pay-qr.svg' : '/images/alipay-qr.svg';
              }}
            />
          </div>

          <div className="space-y-2 text-sm text-slate-500">
            <p>📱 请使用<strong className="text-slate-700">{method === 'wechat' ? '微信' : '支付宝'}</strong>扫码支付</p>
            <p>💰 支付金额：<strong className="text-slate-900">¥{amount}</strong></p>
          </div>

          {/* Donate button */}
          <button
            onClick={handlePaid}
            className="mt-6 w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-bold hover:opacity-90 transition shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            {showConfirm ? '❤️ 感谢支持！' : '我已扫码打赏'}
          </button>
          <p className="text-xs text-slate-400 mt-3">每一份支持都让我们做得更好 ❤️</p>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 text-center">
          <p className="text-xs text-slate-400">
            如需帮助，请联系 <a href="mailto:aikitsbox@163.com" className="text-blue-500 hover:text-blue-600">aikitsbox@163.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
