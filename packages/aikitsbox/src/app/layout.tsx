import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI工具箱 - 12款AI工具免费在线使用 | aikitsbox.cn',
  description: '精选12款实用AI工具：老照片修复、AI写作、图片增强、AI抠图、简历优化、宠物医生、AI起名、食谱生成、合同审查、PPT生成、AI翻译、语音转文字，全部免费在线使用。',
  keywords: 'AI工具,老照片修复,AI写作,图片增强,AI抠图,简历优化,AI起名,宠物医生,食谱生成,合同审查,PPT生成,AI翻译,语音转文字,免费AI,在线工具',
  openGraph: {
    title: 'AI工具箱 - 12款AI工具免费在线使用',
    description: '精选12款实用AI工具，覆盖图像、写作、办公、生活四大场景，全部免费在线使用。',
    url: 'https://aikitsbox.cn',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-bold text-xl tracking-tight">
              <span className="text-primary">AI</span>工具箱
            </a>
            <nav className="flex gap-4 text-sm text-gray-600">
              <a href="/#tools" className="hover:text-primary">工具</a>
              <a href="/#pricing" className="hover:text-primary">价格</a>
              <a href="/about" className="hover:text-primary">关于</a>
              <a href="/#tools" className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition">免费使用</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t py-10 text-center text-sm text-gray-400 mt-20">
          <div className="max-w-6xl mx-auto px-4 space-y-3">
            <div className="flex justify-center gap-6">
              <a href="/" className="hover:text-gray-600 transition">首页</a>
              <a href="/#tools" className="hover:text-gray-600 transition">全部工具</a>
              <a href="/about" className="hover:text-gray-600 transition">关于我们</a>
              <a href="mailto:aikitsbox@163.com" className="hover:text-gray-600 transition">联系我们</a>
            </div>
            <p>© 2026 AI工具箱 · aikitsbox.cn · 精选实用AI工具，全部免费在线使用</p>
            <p className="text-xs text-gray-300">深圳市格涅科技有限公司 · ICP备案申请中</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
