import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI工具箱 - 10个AI工具免费在线使用 | aikitsbox.cn',
  description: '老照片修复、AI写作、图片增强、简历优化…10个AI工具全免费。无需下载，打开浏览器即用。每天免费3次。',
  keywords: 'AI工具,老照片修复,AI写作,图片增强,AI工具箱,在线工具,免费AI',
  openGraph: { title: 'AI工具箱 - 让AI为你工作', description: '10个AI工具免费在线使用', url: 'https://aikitsbox.cn' },
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
              <a href="https://aikitsbox.cn" className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition">免费使用</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t py-8 text-center text-sm text-gray-400 mt-20">
          <p>© 2026 AI工具箱 · aikitsbox.cn · 让AI为你工作</p>
        </footer>
      </body>
    </html>
  );
}
