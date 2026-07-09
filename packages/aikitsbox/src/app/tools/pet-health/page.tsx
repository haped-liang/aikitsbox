'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Cat, AlertTriangle, Heart, Stethoscope } from 'lucide-react';
import { callAI } from '@/lib/ai';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

const PET_TYPES = ['🐶 狗狗', '🐱 猫咪', '🐰 兔子', '🐹 仓鼠', '🐦 鸟类', '🐢 龟类', '🐠 鱼类'];

export default function PetHealthPage() {
  const [petType, setPetType] = useState('🐱 猫咪');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('1-3天');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('pet-health');

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setResult('');
    const systemPrompt = '你是资深宠物医生，有10年临床经验。根据宠物症状分析可能病因，提供护理建议和就医判断。必须声明：AI分析仅供参考，紧急情况请立即就医。';
    const prompt = `宠物类型：${petType}
症状描述：${symptoms}
持续时间：${duration}

请分析：
1. 可能病因（列出2-3种可能性，按概率排序）
2. 紧急程度评估（⚠️ 是否需要立即就医）
3. 家庭护理建议
4. 如果就医，建议做哪些检查
5. 预防建议

请用温和、专业、让主人安心的语气。最后必须附上免责声明。`;
    const res = await callAI(prompt, { systemPrompt, temperature: 0.4, maxTokens: 1500 });
    setResult(res.text);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回工具箱
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">🐾 AI宠物医生</h1>
        <p className="text-slate-500 mt-1">宠物症状自查，AI分析病因，提供护理建议与就医判断</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">宠物类型</label>
          <div className="flex flex-wrap gap-2">
            {PET_TYPES.map((p) => (
              <button key={p} onClick={() => setPetType(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${petType === p ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">症状描述</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="请详细描述宠物症状，如：不吃东西、呕吐、拉稀、精神不好、皮肤红肿..."
            className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-50 outline-none resize-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">持续时间</label>
          <div className="flex gap-2">
            {['半天以内', '1-3天', '3-7天', '一周以上'].map((d) => (
              <button key={d} onClick={() => setDuration(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${duration === d ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">AI分析仅供参考，不能替代专业兽医诊断。如宠物出现严重症状（呼吸困难、持续抽搐、大出血等），请立即送往最近的宠物医院。</p>
        </div>

        <button onClick={handleAnalyze} disabled={loading || !symptoms.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <Stethoscope className="w-5 h-5" /> {loading ? 'AI 分析中...' : '开始分析'}
        </button>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-3" />
            <p className="text-slate-400 text-sm">AI 正在分析症状...</p>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-slate-600">诊断分析结果</span>
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
