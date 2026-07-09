'use client';
import { useState } from 'react';
import Link from 'next/link';

const TOOLS = [
  { id:'photo-restore', icon:'📸', name:'老照片修复', desc:'AI修复模糊/破损/黑白老照片', badge:'最热', href:'/tools/photo-restore', color:'from-amber-500 to-orange-600' },
  { id:'ai-write', icon:'✍️', name:'AI写作助手', desc:'小红书/抖音/公众号多平台文案生成', badge:'', href:'/tools/ai-write', color:'from-blue-500 to-cyan-600' },
  { id:'image-enhance', icon:'🎨', name:'图片增强', desc:'提升分辨率/去噪/去背景', badge:'', href:'/tools/image-enhance', color:'from-purple-500 to-pink-600' },
  { id:'bg-remove', icon:'✂️', name:'AI抠图', desc:'5秒智能抠图/发丝级精度', badge:'新上', href:'/tools/bg-remove', color:'from-rose-500 to-pink-600' },
  { id:'resume', icon:'💼', name:'简历优化', desc:'AI分析+STAR法则改写+评分', badge:'', href:'/tools/resume', color:'from-green-500 to-emerald-600' },
  { id:'pet-health', icon:'🐾', name:'宠物医生', desc:'症状自查+病因分析+护理建议', badge:'', href:'/tools/pet-health', color:'from-red-500 to-rose-600' },
  { id:'baby-name', icon:'🏷️', name:'AI起名', desc:'宝宝/公司/品牌智能起名', badge:'', href:'/tools/baby-name', color:'from-yellow-500 to-amber-600' },
  { id:'recipe', icon:'🍳', name:'食谱生成', desc:'输入食材→AI推荐菜谱+做法', badge:'', href:'/tools/recipe', color:'from-teal-500 to-green-600' },
  { id:'contract', icon:'🔍', name:'合同审查', desc:'AI审合同+标风险条款+改建议', badge:'Pro', href:'/tools/contract', color:'from-indigo-500 to-blue-600' },
  { id:'ppt', icon:'📊', name:'PPT生成', desc:'输入主题→AI生成完整大纲', badge:'', href:'/tools/ppt', color:'from-violet-500 to-purple-600' },
  { id:'translate', icon:'🌐', name:'AI翻译', desc:'多语种互译/专业术语/上下文理解', badge:'', href:'/tools/translate', color:'from-sky-500 to-blue-600' },
  { id:'voice-notes', icon:'🎙️', name:'语音转文字', desc:'录音/视频→文字/中英文混合识别', badge:'', href:'/tools/voice-notes', color:'from-slate-500 to-gray-600' },
];

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-8 backdrop-blur">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            12个AI工具 · 全部在线 · 免费使用
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            AI<span className="text-primary">工具箱</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto">
            一个网站，搞定所有AI需求
          </p>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            老照片修复 · AI写作 · 图片增强 · AI抠图 · 简历优化 · 宠物医生 · AI起名 · 食谱生成 · 合同审查 · PPT生成 · AI翻译 · 语音转文字
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#tools" className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold text-lg transition shadow-lg shadow-primary/25">
              开始使用 →
            </a>
            <a href="/pricing" className="bg-white/10 hover:bg-white/20 px-8 py-3.5 rounded-full font-semibold text-lg transition backdrop-blur">
              查看价格
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">每天免费3次 · 无需注册 · 无需下载</p>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-2">🛠️ 全部AI工具</h2>
        <p className="text-gray-500 text-center mb-12">点击任意工具，立即开始使用</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {TOOLS.map(tool => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative bg-white rounded-2xl p-5 border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              {tool.badge && (
                <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${
                  tool.badge === '最热' ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-500'
                }`}>{tool.badge}</span>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                {tool.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-2">💎 简单定价</h2>
        <p className="text-gray-500 text-center mb-12">免费开始，随时升级</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name:'免费版', price:'¥0', features:['每天3次免费使用','基础质量输出','带水印','所有工具可用'], cta:'开始使用', primary:false },
            { name:'Pro版', price:'¥29/月', features:['无限使用','高清无水印','优先处理速度','新功能抢先体验','邮件支持'], cta:'升级Pro', primary:true },
            { name:'企业版', price:'¥199/月', features:['API接入','批量处理','专属客服','自定义品牌','SLA保障'], cta:'联系客服', primary:false },
          ].map((p, i) => (
            <div key={i} className={`rounded-2xl p-8 border-2 ${p.primary ? 'border-primary bg-primary/5 relative' : 'border-gray-100 bg-white'}`}>
              {p.primary && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">最受欢迎</span>}
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <div className="mb-6"><span className="text-4xl font-bold">{p.price}</span>{p.price !== '¥0' && <span className="text-gray-400">/月</span>}</div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> {f}</li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-full font-semibold text-sm transition ${p.primary ? 'bg-primary text-white hover:opacity-90' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">准备好了吗？</h2>
        <p className="text-gray-500 mb-8">不需要下载，不需要注册，打开浏览器就开始</p>
        <a href="#tools" className="inline-block bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition shadow-lg shadow-primary/25">
          🚀 免费开始使用
        </a>
      </section>
    </>
  );
}
