/**
 * AI 代理 — Token 计数 + 计费扣费
 */
const { Router } = require('express');
const { Members, UsageRecords } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = Router();
const TOKEN_COST = { input: 0.001, output: 0.002 };
const MEMBER_MULT = 1.3;
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

/** POST /api/ai/chat — 会员调用（需认证，扣余额） */
router.post('/chat', requireAuth, async (req, res) => {
  const { messages, toolId = 'unknown', temperature = 0.7, maxTokens = 2000 } = req.body;
  if (!messages || !messages.length) return res.status(400).json({ error: '缺少 messages' });

  const member = Members.findById(req.memberId);
  if (!member) return res.status(404).json({ error: '会员不存在' });
  if (member.balance <= 0) return res.status(402).json({ error: '余额不足，请充值' });

  try {
    const apiRes = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_KEY}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages, temperature, max_tokens: maxTokens }),
    });

    if (!apiRes.ok) {
      const err = await apiRes.text();
      return res.status(502).json({ error: 'AI 服务异常: ' + err.slice(0, 200) });
    }

    const data = await apiRes.json();
    const usage = data.usage || {};
    const inputTokens = usage.prompt_tokens || 0;
    const outputTokens = usage.completion_tokens || 0;
    const apiCost = (inputTokens * TOKEN_COST.input + outputTokens * TOKEN_COST.output) / 1000;
    const charge = Math.round(apiCost * MEMBER_MULT * 100) / 100;

    Members.deductBalance(req.memberId, charge);
    Members.addTokens(req.memberId, inputTokens + outputTokens);
    UsageRecords.create({ memberId: req.memberId, toolId, inputTokens, outputTokens, cost: charge });

    const updated = Members.findById(req.memberId);
    res.json({
      ok: true,
      content: data.choices?.[0]?.message?.content || '',
      usage: { inputTokens, outputTokens, cost: charge, balance: updated ? updated.balance : 0 },
    });
  } catch (e) {
    console.error('[AI Proxy]', e.message);
    res.status(500).json({ error: 'AI 调用失败: ' + e.message });
  }
});

/** POST /api/ai/chat-guest — 游客调用（记录用量，不扣费） */
router.post('/chat-guest', async (req, res) => {
  const { messages, toolId = 'unknown', temperature = 0.7, maxTokens = 2000 } = req.body;
  if (!messages || !messages.length) return res.status(400).json({ error: '缺少 messages' });

  try {
    const apiRes = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_KEY}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages, temperature, max_tokens: maxTokens }),
    });

    if (!apiRes.ok) {
      const err = await apiRes.text();
      return res.status(502).json({ error: 'AI 服务异常: ' + err.slice(0, 200) });
    }

    const data = await apiRes.json();
    const usage = data.usage || {};
    UsageRecords.create({
      memberId: null, toolId, inputTokens: usage.prompt_tokens || 0,
      outputTokens: usage.completion_tokens || 0, cost: 0, isGuest: true,
      ip: req.ip || '',
    });

    res.json({
      ok: true,
      content: data.choices?.[0]?.message?.content || '',
      usage: { inputTokens: usage.prompt_tokens || 0, outputTokens: usage.completion_tokens || 0 },
    });
  } catch (e) {
    console.error('[AI Guest]', e.message);
    res.status(500).json({ error: 'AI 调用失败: ' + e.message });
  }
});

module.exports = router;
