'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Zap, Shield, ArrowRight, TrendingUp, Wand2, ChevronRight } from 'lucide-react';

const TOOLS = [
  { id:'photo-restore', name:'老照片修复', desc:'AI修复模糊、破损、黑白老照片，一键还原高清', icon:'📸', cat:'AI图像', badge:'🔥热门', href:'/tools/photo-restore/', color:'from-rose-500 to-pink-600', bg:'bg-rose-50', text:'text-rose-600', glow:'shadow-rose-500/25' },
  { id:'ai-write', name:'AI写作助手', desc:'小红书/抖音/公众号/微博/知乎多平台文案', icon:'✍️', cat:'AI写作', badge:'', href:'/tools/ai-write/', color:'from-emerald-500 to-teal-600', bg:'bg-emerald-50', text:'text-emerald-600', glow:'shadow-emerald-500/25' },
  { id:'bg-remove', name:'AI智能抠图', desc:'5秒发丝级抠图，支持批量处理', icon:'✂️', cat:'AI图像', badge:'✨新上', href:'/tools/bg-remove/', color:'from-violet-500 to-purple-600', bg:'bg-violet-50', text:'text-violet-600', glow:'shadow-violet-500/25' },
  { id:'image-enhance', name:'图片增强', desc:'超分辨率、智能降噪、色彩增强', icon:'🎨', cat:'AI图像', badge:'', href:'/tools/image-enhance/', color:'from-cyan-500 to-blue-600', bg:'bg-cyan-50', text:'text-cyan-600', glow:'shadow-cyan-500/25' },
  { id:'baby-name', name:'AI起名大师', desc:'宝宝起名·公司起名·品牌命名，融合五行诗词', icon:'👶', cat:'AI生活', badge:'', href:'/tools/baby-name/', color:'from-amber-500 to-orange-600', bg:'bg-amber-50', text:'text-amber-600', glow:'shadow-amber-500/25' },
  { id:'translate', name:'AI智能翻译', desc:'12语种互译，专业术语精准翻译', icon:'🌐', cat:'AI写作', badge:'', href:'/tools/translate/', color:'from-sky-500 to-indigo-600', bg:'bg-sky-50', text:'text-sky-600', glow:'shadow-sky-500/25' },
  { id:'pet-health', name:'AI宠物医生', desc:'症状自查·AI分析病因·护理建议', icon:'🐾', cat:'AI生活', badge:'', href:'/tools/pet-health/', color:'from-red-500 to-rose-600', bg:'bg-red-50', text:'text-red-600', glow:'shadow-red-500/25' },
  { id:'resume', name:'AI简历优化', desc:'STAR法则重写·量化成果·提升邀约率', icon:'📄', cat:'AI办公', badge:'', href:'/tools/resume/', color:'from-blue-500 to-indigo-600', bg:'bg-blue-50', text:'text-blue-600', glow:'shadow-blue-500/25' },
  { id:'recipe', name:'AI食谱生成', desc:'输入食材→AI推荐菜谱+完整做法', icon:'🍳', cat:'AI生活', badge:'', href:'/tools/recipe/', color:'from-orange-500 to-red-600', bg:'bg-orange-50', text:'text-orange-600', glow:'shadow-orange-500/25' },
  { id:'contract', name:'AI合同审查', desc:'识别风险条款·法律依据·修改建议', icon:'⚖️', cat:'AI办公', badge:'💎Pro', href:'/tools/contract/', color:'from-indigo-500 to-purple-600', bg:'bg-indigo-50', text:'text-indigo-600', glow:'shadow-indigo-500/25' },
  { id:'ppt', name:'AI PPT生成', desc:'输入主题→完整PPT大纲+内容框架', icon:'📊', cat:'AI办公', badge:'', href:'/tools/ppt/', color:'from-purple-500 to-pink-600', bg:'bg-purple-50', text:'text-purple-600', glow:'shadow-purple-500/25' },
  { id:'voice-notes', name:'语音转文字', desc:'录音/视频→精准文字·中英混合识别', icon:'🎙️', cat:'AI办公', badge:'', href:'/tools/voice-notes/', color:'from-slate-500 to-gray-600', bg:'bg-slate-50', text:'text-slate-600', glow:'shadow-slate-500/25' },
];

const CATS = ['全部', 'AI图像', 'AI写作', 'AI办公', 'AI生活'];
const HOT_TAGS = ['老照片修复', 'AI写作', '抠图', '简历', 'PPT', '宠物', '起名', '翻译'];

export default function Home() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('全部');

  const filtered = TOOLS.filter(t => {
    const m = !search || t.name.includes(search) || t.desc.includes(search) || t.cat.includes(search);
    const c = cat === '全部' || t.cat === cat;
    return m && c;
  });

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* BG effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f2e] via-[#0a0a1a] to-[#0a0a1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(236,72,153,0.08),transparent)]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-5xl mx-auto px-4 pt-28 pb-20 text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-8 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5" />
            AI驱动 · 12款精选工具 · 全部免费在线
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            发现最强
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> AI工具</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
            覆盖图像、写作、办公、生活四大场景，一键即用，无需下载
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/30 transition-all backdrop-blur">
              <Search className="w-5 h-5 text-slate-400 ml-4 flex-shrink-0" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="搜索AI工具：老照片修复、AI写作、抠图..."
                className="w-full px-3 py-4 text-sm outline-none bg-transparent text-white placeholder-slate-500"
              />
              {search && <button onClick={() => setSearch('')} className="px-4 text-slate-400 hover:text-white">✕</button>}
            </div>
            {/* Hot tags */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-3">
              {HOT_TAGS.map(t => (
                <button key={t} onClick={() => setSearch(t)}
                  className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/10 text-xs transition">
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            {[{ icon:Zap, v:'12+', l:'精品工具' }, { icon:Shield, v:'免费', l:'无需注册' }, { icon:TrendingUp, v:'每日', l:'持续更新' }].map((s,i) => (
              <div key={i} className="flex items-center gap-2">
                <s.icon className="w-4 h-4 text-indigo-400" />
                <span className="text-white font-bold">{s.v}</span>
                <span className="text-slate-500">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY BAR ===== */}
      <section className="sticky top-0 z-40 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto">
          {CATS.map(c => (
            <button key={c} onClick={() => { setCat(c); setSearch(''); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                c === cat ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}>
              {c}
            </button>
          ))}
          <span className="text-xs text-slate-600 ml-auto whitespace-nowrap">{filtered.length} 个工具</span>
        </div>
      </section>

      {/* ===== TOOLS GRID ===== */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="text-lg">没有匹配的工具</p>
            <button onClick={() => { setSearch(''); setCat('全部'); }} className="mt-4 text-indigo-400 hover:text-indigo-300">查看全部 →</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((t) => (
              <Link key={t.id} href={t.href}
                className="group relative bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 backdrop-blur">
                {/* Top glow stripe */}
                <div className={`absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${t.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                {/* Badge */}
                {t.badge && (
                  <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.badge.includes('热门') ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    t.badge.includes('新上') ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>{t.badge}</span>
                )}
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform shadow-lg ${t.glow}`}>
                  {t.icon}
                </div>
                {/* Info */}
                <h3 className="font-semibold text-white text-sm mb-1.5">{t.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{t.desc}</p>
                {/* Category tag + arrow */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${t.bg} ${t.text} bg-opacity-20`}>{t.cat}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-5xl mx-auto px-4 py-16 border-t border-white/5">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">How It Works</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">三步开始使用</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step:'01', title:'搜索工具', desc:'输入需求关键词或按分类浏览，快速找到需要的AI工具' },
            { step:'02', title:'一键使用', desc:'点击工具卡片直接进入使用页面，无需下载安装注册' },
            { step:'03', title:'高效完成', desc:'AI帮你快速完成任务，下载高清成果或复制文案' },
          ].map((s, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="text-3xl font-extrabold text-white/10 mb-3">{s.step}</div>
              <h3 className="font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 支持我们 ===== */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">Support Us</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">❤️ 支持我们</h2>
          <p className="text-slate-400 text-sm mt-2">所有工具永久免费，如果对你有帮助，欢迎打赏支持</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon:'☕', amount:'6.66', label:'喝杯咖啡', desc:'感谢支持，感动不已' },
            { icon:'🍕', amount:'9.99', label:'请顿午饭', desc:'动力满满，持续更新' },
            { icon:'🎉', amount:'19.99', label:'大力支持', desc:'你的名字将出现在致谢页' },
          ].map((p, i) => (
            <Link key={i} href="/pricing/"
              className={`text-center p-6 rounded-2xl border transition-all hover:-translate-y-1 bg-white/[0.02] border-white/5 hover:border-pink-500/20 hover:bg-white/[0.05]`}>
              <div className="text-3xl mb-3">{p.icon}</div>
              <div className="text-2xl font-extrabold text-white mb-1">¥{p.amount}</div>
              <div className="text-sm text-slate-400 mb-1">{p.label}</div>
              <div className="text-xs text-slate-600">{p.desc}</div>
            </Link>
          ))}
        </div>
        <p className="text-center text-xs text-slate-600">
          工具永久免费 · 打赏 purely 自愿 ·
          <Link href="/pricing/" className="text-indigo-400 hover:text-indigo-300 ml-1">了解更多 →</Link>
        </p>
      </section>
    </div>
  );
}
