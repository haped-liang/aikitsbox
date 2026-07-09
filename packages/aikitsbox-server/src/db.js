/**
 * 轻量 JSON 文件数据库
 *
 * 纯 JS 实现，零依赖，适合小规模会员系统
 * 后期可迁移到 SQLite/PostgreSQL
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// 确保 data 目录存在
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// 初始化或加载数据库
let db = { members: [], rechargeOrders: [], usageRecords: [], _nextId: 1 };
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    console.error('[DB] 数据库文件损坏，重建中...');
  }
}

/** 持久化到磁盘（每次写操作后调用） */
function save() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

/** 生成自增 ID */
function nextId() {
  return db._nextId++;
}

// ===== Members =====

const Members = {
  create(email, passwordHash, nickname) {
    const existing = db.members.find(m => m.email === email);
    if (existing) return null;
    const member = {
      id: nextId(), email, password_hash: passwordHash, nickname: nickname || email.split('@')[0],
      balance: 0, totalTokensUsed: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    db.members.push(member);
    save();
    return member;
  },
  findByEmail(email) {
    return db.members.find(m => m.email === email) || null;
  },
  findById(id) {
    return db.members.find(m => m.id === id) || null;
  },
  updateBalance(id, amount) {
    const m = db.members.find(m => m.id === id);
    if (!m) return null;
    m.balance = Math.round((m.balance + amount) * 10000) / 10000;
    m.updatedAt = new Date().toISOString();
    save();
    return m;
  },
  deductBalance(id, amount) {
    const m = db.members.find(m => m.id === id);
    if (!m || m.balance < amount) return null;
    m.balance = Math.round((m.balance - amount) * 10000) / 10000;
    m.totalTokensUsed = (m.totalTokensUsed || 0);
    m.updatedAt = new Date().toISOString();
    save();
    return m;
  },
  addTokens(id, tokenCount) {
    const m = db.members.find(m => m.id === id);
    if (!m) return null;
    m.totalTokensUsed = (m.totalTokensUsed || 0) + tokenCount;
    m.updatedAt = new Date().toISOString();
    save();
    return m;
  },
};

// ===== Recharge Orders =====

const RechargeOrders = {
  create(memberId, planId, amount, tokens) {
    const order = {
      id: nextId(), memberId, planId, amount, tokens,
      status: 'pending', createdAt: new Date().toISOString(), confirmedAt: null
    };
    db.rechargeOrders.push(order);
    save();
    return order;
  },
  findById(id) {
    return db.rechargeOrders.find(o => o.id === id) || null;
  },
  findByMember(memberId) {
    return db.rechargeOrders.filter(o => o.memberId === memberId);
  },
  confirm(id) {
    const o = db.rechargeOrders.find(o => o.id === id);
    if (!o || o.status === 'confirmed') return null;
    o.status = 'confirmed';
    o.confirmedAt = new Date().toISOString();
    save();
    return o;
  },
  pendingTotal(memberId) {
    return db.rechargeOrders
      .filter(o => o.memberId === memberId && o.status === 'pending')
      .reduce((sum, o) => sum + o.amount, 0);
  },
};

// ===== Usage Records =====

const UsageRecords = {
  create({ memberId, toolId, model, inputTokens, outputTokens, cost, isGuest, ip }) {
    const record = {
      id: nextId(), memberId: memberId || null, toolId, model: model || 'deepseek-chat',
      inputTokens, outputTokens, cost, isGuest: isGuest || false, ip: ip || '',
      createdAt: new Date().toISOString()
    };
    db.usageRecords.push(record);
    save();
    return record;
  },
  findByMember(memberId, limit = 20) {
    return db.usageRecords
      .filter(r => r.memberId === memberId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
  recent(limit = 50) {
    return db.usageRecords
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
};

console.log('[DB] JSON 数据库就绪 —', db.members.length, '会员,', db.rechargeOrders.length, '充值订单,', db.usageRecords.length, '使用记录');

module.exports = { Members, RechargeOrders, UsageRecords };
