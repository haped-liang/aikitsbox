# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目背景

Gagne Geld — 50万到10亿的十年造富计划。四个业务方向：
- **A: AI工具箱网站** (aikitsbox.cn) — 已上线，持续迭代
- **B: 微信AI小程序** (4个) — 等公司执照
- **C: 内容工厂** — 本地CLI工具，已就绪
- **D: 跨境电商** — 等公司注册
- **E: AI SaaS** — 验证阶段

公司：深圳市格涅科技有限公司（一人有限责任公司，1万元认缴，纯线上经营）

## 仓库结构

非标准 monorepo（无 root package.json / workspace）：

```
packages/
├── aikitsbox/              # Next.js 14 静态网站 → aikitsbox.cn
├── aikitsbox-server/       # Node.js 后端 — 会员系统 + AI代理
├── cross-border/           # Node.js CLI — 跨境选品/Listing/竞品分析
├── content-factory/        # Node.js CLI — 多平台内容自动生成
├── shared/ai/              # 共享AI引擎 (Hunyuan/DeepSeek/Claude) — 占位
├── miniapp-naming/         # 微信小程序 — AI起名大师
├── miniapp-bookkeeping/    # 微信小程序 — AI记账管家
├── miniapp-pet/            # 微信小程序 — AI宠物医生
├── miniapp-photo-restore/  # 微信小程序 — 老照片修复
└── saas-contract/          # SaaS验证计划（文档）
```

## 常用命令

### aikitsbox (Next.js 网站) — 主力项目

```bash
cd packages/aikitsbox
npm run dev              # 开发服务器 → localhost:3000
npm run build            # 静态导出到 out/ 目录
```

**构建后部署到 OSS：**
```bash
node upload-oss.js <AccessKey> <SecretKey>
# 或设环境变量 OSS_ACCESS_KEY_ID / OSS_ACCESS_KEY_SECRET
```
OSS Bucket: `aikitsbox` / 香港节点 `oss-cn-hongkong` / 域名 `aikitsbox.cn`

### aikitsbox-server (后端服务)

```bash
cd packages/aikitsbox-server
cp .env.example .env    # 编辑配置 JWT_SECRET, DEEPSEEK_API_KEY
npm run dev             # 启动 → localhost:3001
```

### content-factory (内容工厂)

```bash
cd packages/content-factory
node auto-agent.js       # 生成今日3平台内容
node auto-agent.js --week # 生成一周内容
```

### cross-border (跨境电商)

```bash
cd packages/cross-border
npm run agent            # 5阶段选品流水线
npm run research         # 单品调研
```

## 关键架构决策

### aikitsbox 网站

- **静态导出模式**：`output: 'export'` + `trailingSlash: true`。trailingSlash 是必须的，否则 OSS 不识别 `/about` → `about.html` 的映射。
- **构建产物在 `out/` 目录**，部署时复制到 `deploy/` 再上传 OSS
- **Deploy目录** `C:\Oth\Essie\Gagne Geld\packages\aikitsbox\deploy` — 用户经常直接往里放文件（如付款码），重新构建前需先同步到源码 `public/`
- **CDN 缓存问题**：`upload-oss.js` 对非 HTML 文件设 `max-age=31536000, immutable`。更新静态资源（付款码图片等）需换文件名（如 `-v2.png`），否则 CDN 永远返回旧文件。
- **图标库**：`lucide-react`（已安装）
- **`@/` 路径别名**：tsconfig.json 必须配置 `"paths": { "@/*": ["./src/*"] }`（已配置）
- **目前 12 个工具全部有独立页面**（`/tools/<tool-id>/`），不再是占位重定向
- **图片 AI 为模拟处理**（需真实 AI 后端），文本 AI 通过 `src/lib/ai.ts` 调用（模拟模式 + 可选 DeepSeek API）
- **收费模式**：打赏制（非强制付费），PaymentModal 显示微信/支付宝收款码
- **会员系统**：代码已就绪但默认关闭（`NEXT_PUBLIC_MEMBERSHIP_ENABLED=false`），等公司注册后开启

### aikitsbox-server 后端

- Express + JSON 文件数据库（`data/database.json`），轻量无依赖
- JWT 认证，API 端点：`/api/auth/*`, `/api/member/*`, `/api/ai/*`
- AI 代理自动 Token 计数 + 按 1.3x（会员）/ 1.6x（游客）扣费
- 端口默认 3001

### 打赏/收款系统

- 收款二维码位置：`public/images/wechat-pay-qr-v2.png` 和 `alipay-qr-v2.png`
- 注意版本号后缀，更换时递增 `-v3`, `-v4`...
- 同时更新引用文件：`PaymentModal.tsx` 和 `member/recharge/page.tsx`
- 定价三档：免费（2次/天）、一杯咖啡 ¥3.3（5次）、一杯奶茶 ¥6.6（10次）

### 共享AI引擎 (`shared/ai/`)

- 三供应商架构：混元（免费）、DeepSeek（性价比）、Claude（高质量）
- 目前是占位实现，需填入真实 API Key
- 各包引用路径：`require('../../shared/ai/index')`

### 微信小程序

- 4个小程序均已开发完成，等公司执照注册企业小程序
- 不使用 `shared/ai`（小程序不支持 Node.js require）
- 各有独立 `components/ai-label` 组件

## 工作树开发流程

本项目使用 Claude Code worktree 隔离开发：
- 工作树位于 `.claude/worktrees/<name>/`
- 在当前工作树中开发，不要 `cd` 到原始仓库根目录
- 构建产物需手动复制到原始仓库的 `deploy/` 再上传 OSS
- 原始仓库路径：`C:\Oth\Essie\Gagne Geld\packages\aikitsbox\`

## Tailwind 自定义设计系统

`tailwind.config.js` 中定义：
- **颜色**: `primary: '#FF6B35'`（橙）, `dark: '#1a1a2e'`, `accent: '#e94560'`
- **动画**: `scan`, `fade-in`, `float`, `float-slow`, `pulse-glow`, `shimmer`, `grid-scroll`, `fade-in-up`, `scale-in`
- **全站暗色主题**：`body` 背景 `bg-[#0a0a1a]`，Header/Footer 暗色玻璃拟态
- **工具页面**：白色卡片容器，与暗色背景形成对比

## 关键文件速查

| 文件 | 用途 |
|------|------|
| `packages/aikitsbox/next.config.js` | `output:'export'`, `trailingSlash:true` |
| `packages/aikitsbox/src/app/page.tsx` | 首页（暗色科技风） |
| `packages/aikitsbox/src/lib/ai.ts` | AI 调用（模拟+真实） |
| `packages/aikitsbox/src/lib/pricing.ts` | 定价配置 |
| `packages/aikitsbox/src/lib/config.ts` | Feature flags |
| `packages/aikitsbox/src/lib/token-pricing.ts` | Token 成本计算 |
| `packages/aikitsbox/src/app/components/PaymentModal.tsx` | 打赏弹窗 |
| `packages/aikitsbox/public/images/*-qr-v2.png` | 收款二维码 |
| `packages/aikitsbox/upload-oss.js` | OSS 上传脚本 |
| `packages/aikitsbox-server/src/index.js` | 后端入口 |
| `packages/aikitsbox-server/src/db.js` | JSON 文件数据库 |
