'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ChefHat, Clock, Users } from 'lucide-react';
import { callAI } from '@/lib/ai';
import { getToolPrice } from '@/lib/pricing';
import PaymentModal from '@/app/components/PaymentModal';

const DIFFICULTIES = ['简单快手的', '家常', '精致'];
const CUISINES = ['中式', '西式', '日式', '韩式', '东南亚', '不限'];

export default function RecipePage() {
  const [ingredients, setIngredients] = useState('');
  const [difficulty, setDifficulty] = useState('家常');
  const [cuisine, setCuisine] = useState('中式');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const price = getToolPrice('recipe');

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setResult('');
    const systemPrompt = '你是专业厨师和美食博主。根据食材推荐菜谱，包括做法步骤、小技巧、营养信息。回复要生动有趣，让人看了就想做。';
    const prompt = `我有以下食材：${ingredients}
偏好：${difficulty}的${cuisine}料理

请推荐2-3道菜谱，每道菜包含：
1. 菜名（有吸引力的）
2. 准备时间和烹饪时间 ⏱️
3. 难度评级
4. 完整食材清单（标注我已有的✅和需要额外准备的🛒）
5. 分步骤做法（每步简洁明了）
6. 小贴士/技巧
7. 营养信息（热量、蛋白质、碳水）`;
    const res = await callAI(prompt, { systemPrompt, temperature: 0.7, maxTokens: 2000 });
    setResult(res.text);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回工具箱
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">🍳 AI食谱生成</h1>
        <p className="text-slate-500 mt-1">输入食材，AI自动推荐搭配菜谱，包含完整做法</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">你有什么食材？</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="输入你手头的食材，如：鸡蛋、西红柿、洋葱、猪肉、青椒..."
            className="w-full h-28 px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-50 outline-none resize-none text-sm"
          />
          <p className="text-xs text-slate-400 mt-1.5">💡 提示：可以输入冰箱里剩余的食材，AI帮你搭配</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2"><Clock className="w-3.5 h-3.5 inline mr-1" />难度</label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${difficulty === d ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">菜系</label>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <button key={c} onClick={() => setCuisine(c)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${cuisine === c ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading || !ingredients.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <ChefHat className="w-5 h-5" /> {loading ? 'AI 推荐中...' : '生成菜谱'}
        </button>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-3" />
            <p className="text-slate-400 text-sm">👨‍🍳 AI大厨正在为你搭配菜谱...</p>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <ChefHat className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-slate-600">推荐菜谱</span>
            </div>
            <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{result}{!unlocked && result && <span className="text-amber-500 text-xs block mt-3 border-t border-amber-100 pt-3">🔒 以上为演示模式预览 · 付费解锁完整无水印内容</span>}</div>
            {!unlocked && (
              <div className="px-5 pb-4">
                <button onClick={() => setShowPayment(true)} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition">
                  🔓 打赏支持 (¥{price.amount})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-slate-400 mt-6">工具免费 · 喜欢的话欢迎打赏支持 ¥{price.amount}/{price.label.split('/')[1]?.trim() || '次'} · <button onClick={() => setShowPayment(true)} className="text-amber-500 hover:text-amber-600 underline">打赏支持</button></p>

      <PaymentModal open={showPayment} onClose={() => setShowPayment(false)} amount={price.amount} productName={price.label} onPaid={() => setUnlocked(true)} />
    </div>
  );
}
