/**
 * AI工具箱后端服务
 *
 * 功能：会员注册登录、余额管理、AI代理（token计费）、充值管理
 * 部署：node src/index.js
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/member');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 请求日志
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/ai', aiRoutes);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// 启动
app.listen(PORT, () => {
  console.log(`\n🚀 aikitsbox-server 已启动: http://localhost:${PORT}`);
  console.log('   API 文档:');
  console.log('   POST /api/auth/register  — 注册');
  console.log('   POST /api/auth/login     — 登录');
  console.log('   GET  /api/member/me      — 会员信息');
  console.log('   POST /api/member/recharge — 充值申请');
  console.log('   POST /api/ai/chat        — AI代理（会员）');
  console.log('   POST /api/ai/chat-guest  — AI代理（游客）');
  console.log('   POST /api/admin/confirm-recharge — 确认充值\n');
});
