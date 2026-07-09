import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Zap, Shield, Target, Heart, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: '关于我们 - AI工具箱 | aikitsbox.cn',
  description: 'AI工具箱 — 精选实用AI工具导航平台，覆盖图像、写作、办公、生活四大场景，全部免费在线使用。由深圳市格涅科技有限公司运营。',
};

const values = [
  { icon: Zap, title: '高效', desc: '精选优质工具，一键即用，无需下载' },
  { icon: Shield, title: '免费', desc: '核心功能免费，让每个人都能用上AI' },
  { icon: Target, title: '实用', desc: '只收录真正好用的工具，宁缺毋滥' },
  { icon: Heart, title: '用心', desc: '每款工具都经过人工评测和筛选' },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> 返回首页
      </Link>

      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">关于 AI工具箱</h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          AI工具箱（aikitsbox.cn）是一个精选AI工具导航平台，致力于收录和推荐实用的人工智能工具，
          覆盖图像处理、文案写作、办公效率、日常生活四大核心场景，帮助更多人发现和使用AI提升效率。
        </p>
      </section>

      {/* Mission */}
      <section className="mb-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 sm:p-10 text-white">
        <h2 className="text-2xl font-bold mb-4">🎯 我们的使命</h2>
        <p className="text-lg leading-relaxed text-white/90">
          让每个人都能轻松使用AI工具。我们相信AI不应该只是少数技术专家的特权 —
          通过精选和整理，让优秀的AI工具触手可及，帮助人们在工作和生活中更高效、更有创造力。
        </p>
      </section>

      {/* Values */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">💡 我们的理念</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover:shadow-md transition-shadow">
              <v.icon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-bold text-slate-900 mb-1.5">{v.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">📦 目前收录</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {[
            { num: '12+', label: 'AI工具' },
            { num: '4', label: '分类' },
            { num: '100%', label: '免费' },
            { num: '每日', label: '更新' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="text-2xl font-extrabold text-blue-600">{s.num}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">🏢 运营团队</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">深圳市格涅科技有限公司</h3>
              <p className="text-sm text-slate-500">专注于AI工具和应用的科技公司</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            格涅科技是一家致力于AI应用落地的初创公司。我们的团队由AI爱好者、产品设计师和软件工程师组成，
            希望通过AI工具箱这个平台，帮助更多人发现和使用AI工具，提升工作和生活效率。
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">📬 联系我们</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📧</span>
            <div>
              <p className="font-semibold text-slate-900">邮箱</p>
              <a href="mailto:aikitsbox@163.com" className="text-blue-600 hover:text-blue-700 text-sm">aikitsbox@163.com</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">💼</span>
            <div>
              <p className="font-semibold text-slate-900">商务合作</p>
              <p className="text-slate-500 text-sm">欢迎AI工具开发者、内容创作者洽谈合作</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🔗</span>
            <div>
              <p className="font-semibold text-slate-900">友情链接</p>
              <p className="text-slate-500 text-sm">欢迎优质AI相关网站交换友情链接</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section>
        <div className="bg-slate-100 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-2">免责声明</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            本站收录的AI工具仅供学习交流使用。AI生成内容可能存在误差，请用户自行甄别。
            本站不对AI工具的输出结果承担责任。部分工具可能包含付费功能，请以工具提供方的说明为准。
          </p>
        </div>
      </section>
    </div>
  );
}
