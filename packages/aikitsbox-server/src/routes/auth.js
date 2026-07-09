/**
 * 会员注册/登录
 */
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { Members } = require('../db');
const { signToken } = require('../middleware/auth');

const router = Router();

router.post('/register', (req, res) => {
  const { email, password, nickname } = req.body;
  if (!email || !password) return res.status(400).json({ error: '邮箱和密码不能为空' });
  if (password.length < 6) return res.status(400).json({ error: '密码至少6位' });

  const hash = bcrypt.hashSync(password, 10);
  const member = Members.create(email, hash, nickname);
  if (!member) return res.status(409).json({ error: '该邮箱已注册' });

  const token = signToken(member.id, member.email);
  res.json({ ok: true, token, member: { id: member.id, email: member.email, nickname: member.nickname, balance: 0 } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: '邮箱和密码不能为空' });

  const member = Members.findByEmail(email);
  if (!member || !bcrypt.compareSync(password, member.password_hash)) {
    return res.status(401).json({ error: '邮箱或密码错误' });
  }

  const token = signToken(member.id, member.email);
  res.json({
    ok: true, token,
    member: { id: member.id, email: member.email, nickname: member.nickname, balance: member.balance, totalTokensUsed: member.totalTokensUsed }
  });
});

module.exports = router;
