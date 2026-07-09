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
          <div className="text-3xl mb-2">🔓</div>
          <h3 className="text-xl font-bold">解锁完整功能</h3>
          <p className="text-white/60 text-sm mt-1">{productName}</p>
        </div>

        {/* Price */}
        <div className="text-center py-5 border-b border-slate-100">
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-extrabold text-slate-900">¥{amount}</span>
            <span className="text-slate-400 text-sm">/{productName.includes('/') ? productName.split('/')[1]?.trim() : '次'}</span>
          </div>
          <button onClick={handleCopyAmount} className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition">
            <Copy className="w-3 h-3" /> {copied ? '已复制' : '复制金额'}
          </button>
        </div>

        {/* Member promotion */}
        <div className="mx-6 mb-2 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
          <div className="text-xs">
            <span className="font-semibold text-indigo-700">💎 会员更省</span>
            <span className="text-indigo-500 ml-1">按 Token 计费，仅 1.3x 成本</span>
          </div>
          <a href="/member" className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 whitespace-nowrap">开通会员 →</a>
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

          {/* Pay button */}
          <button
            onClick={handlePaid}
            className="mt-6 w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:opacity-90 transition shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            {showConfirm ? '✓ 确认成功！' : '我已扫码支付完成'}
          </button>
          <p className="text-xs text-slate-400 mt-3">支付成功后点击上方按钮即可解锁</p>
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
