import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const NAV_DATA = [
  {
    title:'💬 AI对话 / 大模型', tools:[
      { n:'ChatGPT', d:'OpenAI 顶级对话助手', u:'https://chat.openai.com' },
      { n:'Claude', d:'Anthropic 安全AI助手', u:'https://claude.ai' },
      { n:'通义千问', d:'阿里云自研大模型', u:'https://tongyi.aliyun.com' },
      { n:'文心一言', d:'百度知识增强大模型', u:'https://yiyan.baidu.com' },
      { n:'讯飞星火', d:'科大讯飞认知大模型', u:'https://xinghuo.xfyun.cn' },
      { n:'Kimi', d:'月之暗面长文本助手', u:'https://kimi.moonshot.cn' },
      { n:'DeepSeek', d:'深度求索开源模型', u:'https://chat.deepseek.com' },
      { n:'豆包', d:'字节跳动AI助手', u:'https://www.doubao.com' },
      { n:'智谱清言', d:'智谱AI大模型', u:'https://chatglm.cn' },
      { n:'腾讯元宝', d:'腾讯混元大模型', u:'https://yuanbao.tencent.com' },
    ]
  },
  {
    title:'🎨 AI绘画 / 设计', tools:[
      { n:'Midjourney', d:'最强AI艺术生成', u:'https://www.midjourney.com' },
      { n:'Stable Diffusion', d:'最强开源AI绘画', u:'https://stability.ai' },
      { n:'DALL·E 2', d:'OpenAI 图像生成', u:'https://openai.com/dall-e-2' },
      { n:'文心一格', d:'百度AI绘画平台', u:'https://yige.baidu.com' },
      { n:'Canva', d:'AI在线设计平台', u:'https://www.canva.cn' },
      { n:'稿定AI', d:'一站式AI设计工具', u:'https://www.gaoding.com' },
      { n:'LiblibAI', d:'AI模型分享社区', u:'https://www.liblib.ai' },
      { n:'堆友', d:'阿里3D素材平台', u:'https://www.duiyouai.com' },
    ]
  },
  {
    title:'🎬 AI视频 / 音频', tools:[
      { n:'Runway', d:'专业AI视频生成', u:'https://runwayml.com' },
      { n:'即梦AI', d:'剪映AI视频创作', u:'https://jimeng.jianying.com' },
      { n:'可灵', d:'快手AI视频生成', u:'https://kling.kuaishou.com' },
      { n:'剪映', d:'AI视频剪辑工具', u:'https://www.capcut.cn' },
      { n:'Suno', d:'AI音乐创作平台', u:'https://suno.com' },
      { n:'剪画', d:'AI音频处理工具', u:'https://www.jianhua.ai' },
    ]
  },
  {
    title:'💻 AI编程', tools:[
      { n:'GitHub Copilot', d:'AI代码补全先驱', u:'https://github.com/features/copilot' },
      { n:'Cursor', d:'AI原生编程IDE', u:'https://cursor.sh' },
      { n:'通义灵码', d:'阿里AI编程助手', u:'https://tongyi.aliyun.com/lingma' },
      { n:'CodeGeex', d:'免费AI编程助手', u:'https://codegeex.cn' },
      { n:'Windsurf', d:'AI驱动代码编辑器', u:'https://codeium.com/windsurf' },
      { n:'v0.dev', d:'Vercel AI UI生成', u:'https://v0.dev' },
    ]
  },
  {
    title:'📊 AI办公 / 效率', tools:[
      { n:'Notion AI', d:'AI驱动的笔记协作', u:'https://www.notion.so/product/ai' },
      { n:'Gamma', d:'AI演示文稿生成', u:'https://gamma.app' },
      { n:'AiPPT', d:'AI自动生成PPT', u:'https://www.aippt.cn' },
      { n:'万知', d:'AI文档阅读创作', u:'https://www.wanzi.ink' },
      { n:'通义听悟', d:'AI音视频转文字', u:'https://tingwu.aliyun.com' },
      { n:'秘塔AI', d:'AI搜索引擎', u:'https://metaso.cn' },
    ]
  },
];

export default function NavPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">🌐 AI工具导航</h1>
          <p className="text-slate-400">精选 40+ 优质第三方AI工具，按分类浏览，点击直达官网</p>
        </div>

        <div className="space-y-10">
          {NAV_DATA.map(group => (
            <div key={group.title}>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                {group.title}
                <span className="text-xs font-normal text-slate-600">{group.tools.length}个</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.tools.map(t => (
                  <a key={t.n} href={t.u} target="_blank" rel="noopener"
                    className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.06] hover:border-indigo-500/20 transition-all group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors">{t.n}</h3>
                        <ExternalLink className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{t.d}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
          <p className="text-slate-400 text-sm">📌 以上工具均为第三方网站，点击跳转到对应官网</p>
          <p className="text-slate-600 text-xs mt-1">持续更新中 · 发现好工具欢迎推荐</p>
        </div>
      </div>
    </div>
  );
}
