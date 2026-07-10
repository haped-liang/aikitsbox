import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI工具箱 - 18款AI工具免费在线使用 | aikitsbox.cn',
  description: '精选18款实用AI工具：老照片修复、AI写作、图片增强、AI抠图、简历优化、宠物医生、AI起名、食谱生成、合同审查、PPT生成、AI翻译、语音转文字，全部免费在线使用。',
  keywords: 'AI工具,老照片修复,AI写作,图片增强,AI抠图,简历优化,AI起名,宠物医生,食谱生成,合同审查,PPT生成,AI翻译,语音转文字,免费AI,在线工具',
  openGraph: {
    title: 'AI工具箱 - 18款AI工具免费在线使用',
    description: '精选18款实用AI工具，覆盖图像、写作、办公、生活四大场景，全部免费在线使用。',
    url: 'https://aikitsbox.cn',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="bg-[#0a0a1a] text-gray-900 antialiased">
        {/* Header */}
        <header className="fixed top-0 inset-x-0 z-50 bg-[#0a0a1a]/70 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white shadow-lg shadow-indigo-500/30">AI</span>
              <span className="text-white">AI工具箱</span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link href="/" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition">首页</Link>
              <Link href="/#tools" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition">AI工具</Link>
              <Link href="/nav/" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition">AI导航</Link>
              <Link href="/about/" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition">关于</Link>
              <Link href="/pricing/" className="ml-1 px-4 py-1.5 rounded-full bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition shadow-lg shadow-pink-500/25">❤️ 支持我们</Link>
            </nav>
          </div>
        </header>

        {/* Spacer for fixed header */}
        <div className="h-14" />
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#060618]">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="grid sm:grid-cols-4 gap-8 mb-10">
              <div className="sm:col-span-1">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white">AI</span>
                  <span className="text-white">AI工具箱</span>
                </Link>
                <p className="text-xs text-slate-500 leading-relaxed">精选实用AI工具导航平台，覆盖图像、写作、办公、生活四大场景。</p>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">快速链接</h4>
                <div className="space-y-2 text-sm text-slate-500">
                  <Link href="/" className="block hover:text-white transition">首页</Link>
                  <Link href="/about/" className="block hover:text-white transition">关于我们</Link>
                  <Link href="/pricing/" className="block hover:text-white transition">定价方案</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">工具分类</h4>
                <div className="space-y-2 text-sm text-slate-500">
                  <Link href="/tools/photo-restore/" className="block hover:text-white transition">AI图像处理</Link>
                  <Link href="/tools/ai-write/" className="block hover:text-white transition">AI写作创作</Link>
                  <Link href="/tools/resume/" className="block hover:text-white transition">AI办公效率</Link>
                  <Link href="/tools/baby-name/" className="block hover:text-white transition">AI生活助手</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">联系我们</h4>
                <div className="space-y-2 text-sm text-slate-500">
                  <a href="mailto:aikitsbox@163.com" className="block hover:text-white transition">📧 aikitsbox@163.com</a>
                  <span className="block text-xs text-slate-600">深圳市格涅科技有限公司</span>
                  <span className="block text-xs text-slate-600">ICP备案申请中</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 text-center text-xs text-slate-600">
              © 2026 AI工具箱 · aikitsbox.cn — 精选实用AI工具，全部免费在线使用
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
