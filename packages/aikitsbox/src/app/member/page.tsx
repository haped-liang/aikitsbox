'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Wallet, TrendingUp, History, LogOut, Zap } from 'lucide-react';
import { FEATURES } from '@/lib/config';
import { login, register, logout, getMemberInfo, isLoggedIn } from '@/lib/api';
import { RECHARGE_PLANS, formatPrice } from '@/lib/token-pricing';

export default function MemberPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [member, setMember] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (FEATURES.membership && isLoggedIn()) loadMember();
  }, []);

  async function loadMember() {
    try {
      const data = await getMemberInfo();
      setMember(data.member);
      setRecords(data.recentRecords || []);
    } catch (e) { /* ignore */ }
  }

  async function handleAuth() {
    setError('');
    setLoading(true);
    try {
      const data = mode === 'login' ? await login(email, password) : await register(email, password, nickname);
      setMember(data.member);
      setEmail(''); setPassword(''); setNickname('');
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  }

  // 会员功能未开放
  if (!FEATURES.membership) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🏗️</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">会员系统筹备中</h1>
        <p className="text-slate-500 mb-6">会员系统将在公司注册完成后正式上线，敬请期待！</p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 max-w-md mx-auto text-left text-sm text-amber-800">
          <p className="font-semibold mb-2">📋 上线后将提供：</p>
          <ul className="space-y-1.5">
            <li>✅ 会员充值，按 Token 消耗付费</li>
            <li>✅ 比单次付费更优惠（1.3x vs 1.6x 成本）</li>
            <li>✅ 余额管理，随时查看消费记录</li>
            <li>✅ 优先处理速度</li>
          </ul>
        </div>
        <Link href="/" className="inline-flex items-center gap-1.5 mt-8 text-sm text-blue-500 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>
      </div>
    );
  }

  // 已登录 — 会员中心
  if (member) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">👤 会员中心</h1>
            <p className="text-slate-500 mt-1">欢迎回来，{member.nickname}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition">
            <LogOut className="w-4 h-4" /> 退出
          </button>
        </div>

        {/* 余额卡片 */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-5 text-white">
            <Wallet className="w-5 h-5 mb-2 opacity-80" />
            <p className="text-white/70 text-xs mb-1">账户余额</p>
            <p className="text-3xl font-bold">¥{member.balance.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <TrendingUp className="w-5 h-5 mb-2 text-indigo-500" />
            <p className="text-slate-400 text-xs mb-1">累计消耗 Tokens</p>
            <p className="text-2xl font-bold text-slate-900">{(member.totalTokensUsed || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <Zap className="w-5 h-5 mb-2 text-amber-500" />
            <p className="text-slate-400 text-xs mb-1">定价倍率</p>
            <p className="text-2xl font-bold text-amber-500">1.3x</p>
            <p className="text-xs text-slate-400">API 成本</p>
          </div>
        </div>

        {/* 充值入口 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="font-bold text-slate-900 mb-4">💰 快速充值</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
            {RECHARGE_PLANS.map(p => (
              <Link key={p.id} href={`/member/recharge?plan=${p.id}&amount=${p.amount}&tokens=${p.tokens}&label=${p.label}`}
                className="text-center p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition">
                <div className="font-bold text-slate-900">¥{p.amount}</div>
                <div className="text-xs text-slate-400">{p.label}</div>
                <div className="text-[10px] text-slate-300 mt-0.5">{(p.tokens / 10000).toFixed(0)}万 tokens</div>
              </Link>
            ))}
          </div>
        </div>

        {/* 消费记录 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">📋 消费记录</h2>
          {records.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">暂无消费记录</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-medium">工具</th>
                    <th className="pb-2 font-medium">Tokens</th>
                    <th className="pb-2 font-medium">费用</th>
                    <th className="pb-2 font-medium">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r: any) => (
                    <tr key={r.id} className="border-b border-slate-50">
                      <td className="py-2 text-slate-700">{r.toolId}</td>
                      <td className="py-2 text-slate-500">{(r.inputTokens + r.outputTokens).toLocaleString()}</td>
                      <td className="py-2 text-slate-700 font-medium">{formatPrice(r.cost)}</td>
                      <td className="py-2 text-slate-400 text-xs">{new Date(r.createdAt).toLocaleDateString('zh-CN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 未登录 — 登录/注册
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-8">
        <ArrowLeft className="w-4 h-4" /> 返回首页
      </Link>
      <div className="bg-white rounded-3xl border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-slate-900">{mode === 'login' ? '会员登录' : '注册会员'}</h1>
          <p className="text-slate-400 text-sm mt-1">登录后享受 1.3x 成本价，比单次付费省 19%</p>
        </div>

        <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
          <button onClick={() => setMode('login')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${mode === 'login' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>登录</button>
          <button onClick={() => setMode('register')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${mode === 'register' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>注册</button>
        </div>

        <div className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="邮箱地址" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-400 text-sm" />
          {mode === 'register' && (
            <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="昵称（选填）" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-400 text-sm" />
          )}
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码（至少6位）" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-400 text-sm" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button onClick={handleAuth} disabled={loading || !email || !password}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50">
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          {mode === 'login' ? '还没有账号？' : '已有账号？'}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-indigo-500 hover:text-indigo-600 ml-1">
            {mode === 'login' ? '立即注册' : '去登录'}
          </button>
        </p>
      </div>
    </div>
  );
}
