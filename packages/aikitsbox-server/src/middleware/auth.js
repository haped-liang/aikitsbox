/**
 * JWT 认证中间件
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

/** 生成 JWT token */
function signToken(memberId, email) {
  return jwt.sign({ id: memberId, email }, JWT_SECRET, { expiresIn: '30d' });
}

/** 验证 JWT — Express 中间件 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '请先登录' });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    req.memberId = payload.id;
    req.memberEmail = payload.email;
    next();
  } catch (e) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

/** 可选认证 — 不强制，但如果有 token 就解析 */
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), JWT_SECRET);
      req.memberId = payload.id;
      req.memberEmail = payload.email;
    } catch (e) { /* ignore invalid token */ }
  }
  next();
}

module.exports = { signToken, requireAuth, optionalAuth, JWT_SECRET };
