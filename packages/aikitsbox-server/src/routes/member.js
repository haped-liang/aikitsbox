/**
 * 会员中心 — 余额/充值/记录
 */
const { Router } = require('express');
const { Members, RechargeOrders, UsageRecords } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/me', requireAuth, (req, res) => {
  const member = Members.findById(req.memberId);
  if (!member) return res.status(404).json({ error: '会员不存在' });

  const pendingTotal = RechargeOrders.pendingTotal(req.memberId);
  const recentRecords = UsageRecords.findByMember(req.memberId, 20);

  res.json({
    member: {
      id: member.id, email: member.email, nickname: member.nickname,
      balance: member.balance, totalTokensUsed: member.totalTokensUsed, createdAt: member.createdAt
    },
    pendingRecharge: pendingTotal,
    recentRecords,
  });
});

router.post('/recharge', requireAuth, (req, res) => {
  const { planId, amount, tokens } = req.body;
  if (!planId || !amount || !tokens) return res.status(400).json({ error: '缺少充值参数' });

  const order = RechargeOrders.create(req.memberId, planId, amount, tokens);
  res.json({ ok: true, orderId: order.id, message: '充值申请已提交，请扫码支付后联系客服确认' });
});

router.get('/recharge/:id', requireAuth, (req, res) => {
  const order = RechargeOrders.findById(Number(req.params.id));
  if (!order || order.memberId !== req.memberId) return res.status(404).json({ error: '订单不存在' });
  res.json({ order });
});

router.get('/records', requireAuth, (req, res) => {
  const records = UsageRecords.findByMember(req.memberId, 50);
  res.json({ records });
});

// 管理员确认充值
router.post('/admin/confirm-recharge', (req, res) => {
  const { orderId, adminKey } = req.body;
  if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: '管理员密钥错误' });

  const order = RechargeOrders.findById(Number(orderId));
  if (!order) return res.status(404).json({ error: '订单不存在' });

  const confirmed = RechargeOrders.confirm(Number(orderId));
  if (!confirmed) return res.status(400).json({ error: '订单已确认或不存在' });

  Members.updateBalance(order.memberId, order.amount);
  res.json({ ok: true, message: '充值已确认，余额已更新' });
});

module.exports = router;
