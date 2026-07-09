'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Copy } from 'lucide-react';
import { FEATURES } from '@/lib/config';
import { recharge, isLoggedIn } from '@/lib/api';
import { RECHARGE_PLANS } from '@/lib/token-pricing';
import { Suspense } from 'react';

function RechargeContent() {
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [amount, setAmount] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [label, setLabel] = useState('');
  const [payMethod, setPayMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const plan = searchParams.get('plan');
    const amt = searchParams.get('amount');
    const tkn = searchParams.get('tokens');
    const lbl = searchParams.get('label');
    if (plan && amt) {
      setSelectedPlan(plan);
      setAmount(Number(amt));
      setTokens(Number(tkn));
      setLabel(lbl || '');
    }
  }, [searchParams]);

  const handleRecharge = async () => {
    if (!isLoggedIn()) return;
    try {
      const result = await recharge(selectedPlan, amount, tokens);
      setOrderId(result.orderId);
      setSubmitted(true);
    } catch (e: any) {
      alert('提交失败：' + e.message);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!FEATURES.membership) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🏗️</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">充值功能即将上线</h1>
        <Link href="/member" className="text-blue-500 hover:text-blue-600 text-sm"><ArrowLeft className="w-4 h-4 inline mr-1" />返回会员中心</Link>
      </div>
    );
  }

  if (!isLoggedIn()) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 mb-4">请先登录</p>
        <Link href="/member" className="text-blue-500 hover:text-blue-600">去登录 →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/member" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回会员中心
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">💰 充值中心</h1>

      {!submitted ? (
        <>
          {/* 套餐选择 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h2 className="font-bold text-slate-900 mb-4">选择充值套餐</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {RECHARGE_PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPlan(p.id); setAmount(p.amount); setTokens(p.tokens); setLabel(p.label); }}
                  className={`text-left p-4 rounded-xl border-2 transition ${selectedPlan === p.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="font-bold text-xl text-slate-900">¥{p.amount}</div>
                  <div className="text-sm text-slate-600 mt-0.5">{p.label}</div>
                  <div className="text-xs text-slate-400 mt-1">≈{(p.tokens / 10000).toFixed(0)}万 tokens</div>
                  <div className="text-xs text-slate-400">≈{(p.tokens / 2000).toFixed(0)}次AI处理</div>
                </button>
              ))}
            </div>
          </div>

          {/* 支付方式 */}
          {selectedPlan && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
              <h2 className="font-bold text-slate-900 mb-4">支付方式</h2>
              <div className="flex gap-3 mb-4">
                <button onClick={() => setPayMethod('wechat')} className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition ${payMethod === 'wechat' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-500'}`}>💚 微信支付</button>
                <button onClick={() => setPayMethod('alipay')} className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition ${payMethod === 'alipay' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'}`}>💙 支付宝</button>
              </div>

              <div className="text-center p-6 bg-slate-50 rounded-xl mb-4">
                <img src={payMethod === 'wechat' ? '/images/wechat-pay-qr-v2.png' : '/images/alipay-qr-v2.png'}
                  alt="收款码" className="w-48 h-48 mx-auto object-contain rounded-xl"
                  onError={(e) => { (e.target as HTMLImageElement).src = payMethod === 'wechat' ? '/images/wechat-pay-qr.svg' : '/images/alipay-qr.svg'; }} />
                <p className="text-sm text-slate-500 mt-3">请使用<strong>{payMethod === 'wechat' ? '微信' : '支付宝'}</strong>扫码支付</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">¥{amount}</p>
              </div>

              <button onClick={handleRecharge}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition">
                我已支付，确认充值
              </button>
              <p className="text-xs text-slate-400 text-center mt-3">支付后请联系客服确认，余额将在1-5分钟内到账</p>
            </div>
          )}
        </>
      ) : (
        /* 提交成功 */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">充值申请已提交</h2>
          <p className="text-slate-500 mb-6">订单号：<code className="bg-slate-100 px-2 py-0.5 rounded text-indigo-600 font-mono">#{orderId}</code></p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left text-sm text-amber-800 mb-6">
            <p className="font-semibold mb-1">📌 注意事项</p>
            <p>1. 请确认已完成扫码支付 ¥{amount}</p>
            <p>2. 将支付截图发送至客服邮箱</p>
            <p>3. 客服确认后余额自动到账</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => handleCopy(`aikitsbox@163.com`)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm transition">
              <Copy className="w-3.5 h-3.5 inline mr-1" /> {copied ? '已复制' : '复制客服邮箱'}
            </button>
            <Link href="/member" className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition">
              返回会员中心
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RechargePage() {
  return <Suspense fallback={<div className="text-center py-20">加载中...</div>}><RechargeContent /></Suspense>;
}
