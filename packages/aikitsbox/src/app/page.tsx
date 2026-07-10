'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Shield, TrendingUp, ArrowRight, Heart, Coffee, Grid3X3, Image, PenLine, Briefcase, Baby } from 'lucide-react';

const TOOLS = [
  { id:'photo-restore', name:'老照片修复', desc:'AI修复模糊、破损、黑白老照片，一键还原高清', icon:'📸', cat:'AI图像', badge:'🔥', href:'/tools/photo-restore/', color:'from-rose-500 to-pink-600', glow:'shadow-rose-500/20' },
  { id:'bg-remove', name:'AI智能抠图', desc:'5秒发丝级抠图，支持批量处理', icon:'✂️', cat:'AI图像', badge:'✨', href:'/tools/bg-remove/', color:'from-violet-500 to-purple-600', glow:'shadow-violet-500/20' },
  { id:'image-enhance', name:'图片增强', desc:'超分辨率、智能降噪、色彩增强', icon:'🎨', cat:'AI图像', badge:'', href:'/tools/image-enhance/', color:'from-cyan-500 to-blue-600', glow:'shadow-cyan-500/20' },
  { id:'ai-write', name:'AI写作助手', desc:'小红书/抖音/公众号/微博/知乎多平台文案生成', icon:'✍️', cat:'AI写作', badge:'', href:'/tools/ai-write/', color:'from-emerald-500 to-teal-600', glow:'shadow-emerald-500/20' },
  { id:'translate', name:'AI智能翻译', desc:'12语种互译，专业术语精准翻译', icon:'🌐', cat:'AI写作', badge:'', href:'/tools/translate/', color:'from-sky-500 to-indigo-600', glow:'shadow-sky-500/20' },
  { id:'resume', name:'AI简历优化', desc:'STAR法则重写·量化成果·提升面试邀约率', icon:'📄', cat:'AI办公', badge:'', href:'/tools/resume/', color:'from-blue-500 to-indigo-600', glow:'shadow-blue-500/20' },
  { id:'contract', name:'AI合同审查', desc:'识别风险条款·法律依据·修改建议', icon:'⚖️', cat:'AI办公', badge:'Pro', href:'/tools/contract/', color:'from-indigo-500 to-purple-600', glow:'shadow-indigo-500/20' },
  { id:'ppt', name:'AI PPT生成', desc:'输入主题→完整PPT大纲+内容框架', icon:'📊', cat:'AI办公', badge:'', href:'/tools/ppt/', color:'from-purple-500 to-pink-600', glow:'shadow-purple-500/20' },
  { id:'voice-notes', name:'语音转文字', desc:'录音/视频→精准文字·中英混合识别', icon:'🎙️', cat:'AI办公', badge:'', href:'/tools/voice-notes/', color:'from-slate-500 to-gray-600', glow:'shadow-slate-500/20' },
  { id:'baby-name', name:'AI起名大师', desc:'宝宝起名·公司起名·品牌命名，融合五行诗词', icon:'👶', cat:'AI生活', badge:'', href:'/tools/baby-name/', color:'from-amber-500 to-orange-600', glow:'shadow-amber-500/20' },
  { id:'pet-health', name:'AI宠物医生', desc:'症状自查·AI分析病因·护理建议', icon:'🐾', cat:'AI生活', badge:'', href:'/tools/pet-health/', color:'from-red-500 to-rose-600', glow:'shadow-red-500/20' },
  { id:'recipe', name:'AI食谱生成', desc:'输入食材→AI推荐菜谱+完整做法', icon:'🍳', cat:'AI生活', badge:'', href:'/tools/recipe/', color:'from-orange-500 to-red-600', glow:'shadow-orange-500/20' },
  { id:'email-writer', name:'AI邮件助手', desc:'自动生成专业商务邮件，支持多种语气场景', icon:'📧', cat:'AI写作', badge:'新', href:'/tools/email-writer/', color:'from-blue-500 to-cyan-600', glow:'shadow-blue-500/20' },
  { id:'text-polish', name:'AI文案润色', desc:'改写/扩写/缩写/纠错，一键优化文本', icon:'✨', cat:'AI写作', badge:'新', href:'/tools/text-polish/', color:'from-purple-500 to-pink-600', glow:'shadow-purple-500/20' },
  { id:'text-summary', name:'AI文本摘要', desc:'长文一键总结，多种格式提取核心信息', icon:'📝', cat:'AI写作', badge:'新', href:'/tools/text-summary/', color:'from-teal-500 to-cyan-600', glow:'shadow-teal-500/20' },
  { id:'code-helper', name:'AI代码助手', desc:'生成/解释/调试/优化代码，多语言支持', icon:'💻', cat:'AI办公', badge:'新', href:'/tools/code-helper/', color:'from-green-500 to-emerald-600', glow:'shadow-green-500/20' },
  { id:'weekly-report', name:'AI周报生成', desc:'输入工作内容→自动生成专业周报', icon:'📋', cat:'AI办公', badge:'新', href:'/tools/weekly-report/', color:'from-indigo-500 to-blue-600', glow:'shadow-indigo-500/20' },
  { id:'greeting-card', name:'AI节日祝福', desc:'生成走心祝福语，多节日多风格', icon:'🎉', cat:'AI生活', badge:'新', href:'/tools/greeting-card/', color:'from-amber-500 to-orange-600', glow:'shadow-amber-500/20' },
];

const CATEGORIES = [
  { key:'全部', label:'全部工具', icon:Grid3X3, count:18 },
  { key:'AI图像', label:'AI图像', icon:Image, count:3 },
  { key:'AI写作', label:'AI写作', icon:PenLine, count:5 },
  { key:'AI办公', label:'AI办公', icon:Briefcase, count:6 },
  { key:'AI生活', label:'AI生活', icon:Baby, count:4 },
];

export default function Home() {
  const [cat, setCat] = useState('全部');
  const [mobileNav, setMobileNav] = useState(false);

  const filtered = cat === '全部' ? TOOLS : TOOLS.filter(t => t.cat === cat);
  const grouped: Record<string, typeof TOOLS> = {};
  if (cat === '全部') {
    for (const c of ['AI图像','AI写作','AI办公','AI生活']) {
      grouped[c] = TOOLS.filter(t => t.cat === c);
    }
  } else {
    grouped[cat] = filtered;
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex">
      {/* ===== SIDEBAR (desktop) ===== */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-white/5 bg-[#060612] min-h-screen sticky top-14 h-[calc(100vh-3.5rem)]">
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">工具分类</div>
          <nav className="space-y-1">
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setCat(c.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  cat === c.key ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}>
                <c.icon className="w-4 h-4 flex-shrink-0" />
                <span>{c.label}</span>
                <span className="ml-auto text-xs text-slate-600">{c.count}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">统计数据</div>
            <div className="space-y-2 px-2">
              {[
                { icon:Zap, v:'18', l:'精品工具', c:'text-indigo-400' },
                { icon:Shield, v:'免费', l:'无需注册', c:'text-green-400' },
                { icon:TrendingUp, v:'每日', l:'持续更新', c:'text-amber-400' },
              ].map((s,i) => (
                <div key={i} className="flex items-center gap-2.5 py-1.5">
                  <s.icon className={`w-3.5 h-3.5 ${s.c}`} />
                  <span className="text-white text-sm font-semibold">{s.v}</span>
                  <span className="text-xs text-slate-500">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <Link href="/pricing/"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm font-semibold hover:bg-pink-500/20 transition">
            <Heart className="w-4 h-4" /> 支持我们
          </Link>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 min-w-0">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f2e] via-[#0a0a1a] to-[#0a0a1a]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.12),transparent)]" />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)', backgroundSize:'50px 50px' }} />
          <div className="relative max-w-4xl mx-auto px-6 py-16 sm:py-20 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              18款精选AI工具 · 全部免费在线使用
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              AI<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">工具箱</span>
            </h1>
            <p className="text-slate-400 text-base mt-3 max-w-lg">覆盖图像、写作、办公、生活四大场景，一键即用，无需下载安装</p>
          </div>
        </section>

        {/* Mobile category bar */}
        <div className="lg:hidden sticky top-14 z-30 bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-white/5 px-3 py-2 flex gap-1.5 overflow-x-auto">
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                cat === c.key ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'
              }`}>
              <c.icon className="w-3 h-3" /> {c.label}
            </button>
          ))}
        </div>

        {/* Tools area */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {Object.entries(grouped).map(([group, tools]) => (
            <div key={group} className="mb-10">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${
                  group==='AI图像'?'from-rose-500 to-pink-500': group==='AI写作'?'from-emerald-500 to-teal-500':
                  group==='AI办公'?'from-blue-500 to-indigo-500':'from-amber-500 to-orange-500'
                }`} />
                <h2 className="text-lg font-bold text-white">{group}</h2>
                <span className="text-xs text-slate-600">{tools.length}个</span>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {tools.map(t => (
                  <Link key={t.id} href={t.href}
                    className={`group relative bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5 ${t.glow} hover:shadow-lg`}>
                    {t.badge && (
                      <span className={`absolute top-3 right-3 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        t.badge==='🔥'?'bg-red-500/10 text-red-400': t.badge==='✨'?'bg-green-500/10 text-green-400':
                        'bg-purple-500/10 text-purple-400'
                      }`}>{t.badge}</span>
                    )}
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {t.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white text-sm">{t.name}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5 line-clamp-2">{t.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ===== AI导航 — 外部精选 ===== */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-yellow-500 to-orange-500" />
            <h2 className="text-lg font-bold text-white">🌐 AI工具导航</h2>
            <span className="text-xs text-slate-600">精选 30+ 优质第三方AI工具</span>
          </div>

          {/* AI对话 */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">💬 AI对话 / 大模型</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-2">
              {[
                { n:'ChatGPT', u:'https://chat.openai.com' }, { n:'Claude', u:'https://claude.ai' },
                { n:'通义千问', u:'https://tongyi.aliyun.com' }, { n:'文心一言', u:'https://yiyan.baidu.com' },
                { n:'讯飞星火', u:'https://xinghuo.xfyun.cn' }, { n:'Kimi', u:'https://kimi.moonshot.cn' },
                { n:'DeepSeek', u:'https://chat.deepseek.com' }, { n:'豆包', u:'https://www.doubao.com' },
                { n:'智谱清言', u:'https://chatglm.cn' }, { n:'腾讯元宝', u:'https://yuanbao.tencent.com' },
              ].map(t => <a key={t.n} href={t.u} target="_blank" rel="noopener" className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 transition text-center truncate">{t.n}</a>)}
            </div>
          </div>

          {/* AI图像 + AI视频 */}
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">🎨 AI绘画 / 设计</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { n:'Midjourney', u:'https://www.midjourney.com' }, { n:'Stable Diffusion', u:'https://stability.ai' },
                  { n:'DALL·E 2', u:'https://openai.com/dall-e-2' }, { n:'文心一格', u:'https://yige.baidu.com' },
                  { n:'Canva', u:'https://www.canva.cn' }, { n:'稿定AI', u:'https://www.gaoding.com' },
                ].map(t => <a key={t.n} href={t.u} target="_blank" rel="noopener" className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 transition text-center truncate">{t.n}</a>)}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">🎬 AI视频 / 音频</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { n:'Runway', u:'https://runwayml.com' }, { n:'即梦AI', u:'https://jimeng.jianying.com' },
                  { n:'可灵', u:'https://kling.kuaishou.com' }, { n:'剪映', u:'https://www.capcut.cn' },
                  { n:'Suno', u:'https://suno.com' }, { n:'剪画', u:'https://www.jianhua.ai' },
                ].map(t => <a key={t.n} href={t.u} target="_blank" rel="noopener" className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 transition text-center truncate">{t.n}</a>)}
              </div>
            </div>
          </div>

          {/* AI编程 + AI办公 */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">💻 AI编程</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { n:'GitHub Copilot', u:'https://github.com/features/copilot' }, { n:'Cursor', u:'https://cursor.sh' },
                  { n:'通义灵码', u:'https://tongyi.aliyun.com/lingma' }, { n:'CodeGeex', u:'https://codegeex.cn' },
                ].map(t => <a key={t.n} href={t.u} target="_blank" rel="noopener" className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 transition text-center truncate">{t.n}</a>)}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">📊 AI办公 / 效率</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { n:'Notion AI', u:'https://www.notion.so/product/ai' }, { n:'Gamma', u:'https://gamma.app' },
                  { n:'AiPPT', u:'https://www.aippt.cn' }, { n:'万知', u:'https://www.wanzi.ink' },
                ].map(t => <a key={t.n} href={t.u} target="_blank" rel="noopener" className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/10 transition text-center truncate">{t.n}</a>)}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">以上为第三方工具链接 · 持续更新中 · 点击直达官网</p>
        </div>

        {/* Footer CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-white/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-bold text-lg">喜欢这些工具？</h3>
              <p className="text-slate-500 text-sm">所有工具永久免费，如果对你有帮助，欢迎支持我们</p>
            </div>
            <div className="flex gap-3">
              <Link href="/pricing/" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-500/15 border border-pink-500/20 text-pink-300 text-sm font-semibold hover:bg-pink-500/25 transition">
                <Coffee className="w-4 h-4" /> 请杯咖啡 ¥3.3
              </Link>
              <Link href="/pricing/" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/10 transition">
                了解更多 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
