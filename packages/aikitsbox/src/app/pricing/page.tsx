'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Zap, Crown, Building2 } from 'lucide-react';
import { PLANS } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

const ALL_TOOLS = [
  '老照片修复', 'AI写作助手', 'AI图片增强', 'AI抠图',
  'AI起名大师', 'AI宠物医生', 'AI食谱生成', 'AI简历优化',
  'AI合同审查', 'AI PPT生成', 'AI翻译', 'AI语音转文字',
];

export default function PricingPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PLANS.monthly);

  const handleBuy = (plan: typeof PLANS.monthly) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> 返回首页
      </Link>

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">简单定价，按需选择</h1>
        <p className="text-slate-500 text-lg">免费开始使用，随时升级解锁更多功能</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Free */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">免费使用</h3>
              <p className="text-sm text-slate-400">所有工具免费可用</p>
            </div>
          </div>
          <div className="mb-6">
            <span className="text-5xl font-extrabold text-slate-900">¥0</span>
            <span className="text-slate-400 ml-1">/ 永久</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {['每天2次免费使用', '演示模式预览', '带水印输出', '12个工具可用'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-slate-400 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Link href="/#tools"
            className="w-full py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold text-center hover:bg-slate-50 transition">
            免费开始
          </Link>
        </div>

        {/* 一杯咖啡 */}
        <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl border-2 border-amber-400 p-8 flex flex-col relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-sm font-bold px-4 py-1 rounded-full">
            ☕ 最受欢迎
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">☕</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">一杯咖啡</h3>
              <p className="text-sm text-slate-400">感谢支持，感动不已</p>
            </div>
          </div>
          <div className="mb-6">
            <span className="text-5xl font-extrabold text-slate-900">¥{PLANS.single.amount}</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {['5次AI工具使用', '高清无水印输出', '去除演示水印', '12个工具全可用'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-4 h-4 text-amber-500 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <button onClick={() => handleBuy(PLANS.single)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:opacity-90 transition shadow-lg shadow-amber-500/25">
            ☕ 请杯咖啡 (¥{PLANS.single.amount})
          </button>
        </div>

        {/* 一杯奶茶 */}
        <div className="bg-white rounded-3xl border-2 border-pink-200 p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-2xl">🧋</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">一杯奶茶</h3>
              <p className="text-sm text-slate-400">大力支持，持续更新</p>
            </div>
          </div>
          <div className="mb-6">
            <span className="text-5xl font-extrabold text-slate-900">¥{PLANS.monthly.amount}</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {['10次AI工具使用', '咖啡版全部功能', '专属致谢名单', '优先技术支持'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-pink-500 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <button onClick={() => handleBuy(PLANS.monthly)}
            className="w-full py-3.5 rounded-2xl border-2 border-pink-200 text-pink-600 font-bold text-center hover:bg-pink-50 transition">
            🧋 请杯奶茶 (¥{PLANS.monthly.amount})
          </button>
        </div>
      </div>

      {/* Tools list */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-4">📦 全部工具一览</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALL_TOOLS.map((t) => (
            <div key={t} className="flex items-center gap-2 text-sm text-slate-600 py-1.5">
              <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> {t}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">❓ 常见问题</h2>
        <div className="space-y-4">
          {[
            { q: '付费后多久生效？', a: '扫码支付完成后，点击「我已支付」按钮立即解锁。如遇延迟请联系客服。' },
            { q: '可以退款吗？', a: '购买后7天内如有任何不满意可申请退款。单次工具使用不予退款。' },
            { q: '支持开发票吗？', a: '支持。购买后将开票信息发送至邮箱，5个工作日内开具电子发票。' },
            { q: 'Pro和企业的区别？', a: 'Pro适合个人用户，企业版提供API接入、批量处理和专属客服等团队功能。' },
          ].map((faq, i) => (
            <details key={i} className="bg-white rounded-xl border border-slate-200 p-5 group">
              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">还有疑问？</h2>
        <p className="text-slate-500 mb-4">欢迎联系我们，我们会尽快回复</p>
        <a href="mailto:aikitsbox@163.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition">
          📧 aikitsbox@163.com
        </a>
      </div>

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={selectedPlan.amount}
        productName={selectedPlan.label}
        onPaid={() => setShowPayment(false)}
      />
    </div>
  );
}
