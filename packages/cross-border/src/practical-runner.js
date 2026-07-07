/**
 * 实战选品报告生成器
 *
 * 用法: node src/practical-runner.js
 * 输出: 完整选品决策报告 + 首批采购清单
 */

const db = require('./product-database');

// ============================================================
// 配置
// ============================================================
const CONFIG = {
  budget: 50000,       // ¥50,000首批预算
  exchangeRate: 7.25,  // 美元汇率
  targetMarket: 'US',
  maxFirstProducts: 3, // 首批测试3个品
  // 成本结构 (Amazon FBA)
  fbaFeeRate: 0.12,    // FBA费用约占售价12%
  referralFeeRate: 0.15, // 佣金15%
  adBudgetPerProduct: 3000, // 每个产品广告预算¥3000
  sampleCostPerProduct: 500, // 每个产品样品费¥500
};

// ============================================================
// 核心分析函数
// ============================================================

/**
 * 跑完整选品流程
 */
function runFullAnalysis() {
  console.log('\n' + '='.repeat(70));
  console.log('  🚀 Gagne Geld · AI跨境选品决策报告');
  console.log('  预算: ¥' + CONFIG.budget.toLocaleString() + ' | 市场: ' + CONFIG.targetMarket);
  console.log('  日期: ' + new Date().toISOString().slice(0, 10));
  console.log('='.repeat(70));

  // 1. 全品类扫描
  const allCategories = db.getAllCategories();
  console.log('\n📊 Phase 1: 全品类扫描 (' + allCategories.length + '个品类)\n');

  let allProducts = [];
  for (const cat of allCategories) {
    const products = db.getProducts(cat);
    console.log('  ' + cat + ': ' + products.length + '个候选产品');
    allProducts = allProducts.concat(products.map(p => ({ ...p, category: cat })));
  }

  // 2. 机会评分排序
  console.log('\n📊 Phase 2: 机会评分 & 排序\n');

  const scored = allProducts.map(p => ({
    ...p,
    opportunityScore: db.calcOpportunityScore(p),
    estimatedProfit: calcDetailedProfit(p),
    estimatedMargin: calcMargin(p),
    estimatedMonthlyProfit: calcMonthlyProfit(p),
  }));

  scored.sort((a, b) => b.opportunityScore - a.opportunityScore);

  // 打印TOP 10
  console.log('  TOP 10 选品机会:\n');
  console.log('  ' + '-'.repeat(65));
  console.log('  排名 | 评分 | 产品名称                    | 月利(¥)  | 品类');
  console.log('  ' + '-'.repeat(65));

  scored.slice(0, 10).forEach((p, i) => {
    const bar = p.opportunityScore >= 8 ? '🟢' : p.opportunityScore >= 6 ? '🟡' : '🔴';
    console.log(`  ${bar} #${i+1}  | ${p.opportunityScore.toFixed(1)} | ${p.name.padEnd(28).slice(0,28)} | ¥${p.estimatedMonthlyProfit.toLocaleString().padStart(6)} | ${p.category}`);
  });

  // 3. 首批推荐
  console.log('\n📊 Phase 3: 首批3个测试产品推荐\n');

  const top3 = scored.slice(0, 3);
  const totalCost = top3.reduce((sum, p) => sum + calcFirstOrderCost(p), 0);

  console.log('  ┌─────────────────────────────────────────────────────────────┐');

  top3.forEach((p, i) => {
    const orderCost = calcFirstOrderCost(p);
    console.log(`  │ 🥇 产品${i+1}: ${p.name.padEnd(38).slice(0,38)} │`);
    console.log(`  │    品类: ${p.category.padEnd(42)} │`);
    console.log(`  │    机会评分: ${p.opportunityScore}/10  市场价: $${p.price}  1688采购: ¥${p.cost1688} │`);
    console.log(`  │    预估利润率: ${p.estimatedMargin}%  单品利润: ¥${p.estimatedProfit}  月预估利润: ¥${p.estimatedMonthlyProfit.toLocaleString()} │`);
    console.log(`  │    差异化方向: ${p.diffOpportunity.slice(0, 52).padEnd(52)} │`);
    console.log(`  │    首批采购: ${p.moq}件 × ¥${p.cost1688} = ¥${(p.moq * p.cost1688).toLocaleString()} │`);
    console.log(`  │    样品费: ¥${CONFIG.sampleCostPerProduct}  广告预算: ¥${CONFIG.adBudgetPerProduct.toLocaleString()}  首单总成本: ¥${orderCost.toLocaleString()} │`);
    if (i < 2) console.log(`  │─────────────────────────────────────────────────────────────│`);
  });

  console.log(`  │                                                             │`);
  console.log(`  │  💰 首批总投资: ¥${totalCost.toLocaleString()} (预算¥${CONFIG.budget.toLocaleString()}，剩余¥${(CONFIG.budget - totalCost).toLocaleString()}) │`);
  console.log(`  └─────────────────────────────────────────────────────────────┘`);

  // 4. 执行清单
  console.log('\n📊 Phase 4: 90天执行计划\n');

  const weeks = [
    { week: '第1周', tasks: ['在1688联系TOP3产品的供应商（各5家）','索要样品+报价单','对比供应商，确定每家最优1-2家'] },
    { week: '第2周', tasks: ['收到样品，质检（拍照/测试/对比竞品）','确认最终供应商，谈价格（首批量少，争取接近MOQ价）','注册品牌（如需要）或确认白标方案'] },
    { week: '第3周', tasks: ['下单首批采购（各MOQ量）','设计包装+说明书（用AI生成初稿）','拍摄产品图片+视频（手机即可，重点是真实感）'] },
    { week: '第4周', tasks: ['货发海外仓（联系货代，比价3家）','同时搭建Amazon Listing（用我们AI生成器）','开启PPC自动广告（日预算$10/品）'] },
    { week: '第5-6周', tasks: ['货物到仓，Listing激活','开启自动+手动广告','每天检查广告数据，优化关键词'] },
    { week: '第7-8周', tasks: ['收集第一批评论（通过Vine计划）','根据广告数据优化Listing','开始盈利分析'] },
    { week: '第9-12周', tasks: ['3个产品数据对比','砍掉亏损的，加大盈利的','考虑第2批产品测试'] },
  ];

  weeks.forEach(w => {
    console.log(`  📅 ${w.week}:`);
    w.tasks.forEach(t => console.log(`     ☐ ${t}`));
    console.log('');
  });

  // 5. 供应商联系模板
  console.log('📊 Phase 5: 1688供应商联系模板\n');
  console.log('  ┌─────────────────────────────────────────────┐');
  console.log('  │ 主题：跨境电商合作询价 - [产品名]           │');
  console.log('  │                                              │');
  console.log('  │ 您好，我们是深圳跨境电商团队，              │');
  console.log('  │ 对贵司的[产品名]很感兴趣。                  │');
  console.log('  │                                              │');
  console.log('  │ 请提供以下信息：                            │');
  console.log('  │ 1. 最小起订量(MOQ)及阶梯价格                │');
  console.log('  │ 2. 是否支持OEM/ODM（改包装+Logo）           │');
  console.log('  │ 3. 样品费用及寄送时间                       │');
  console.log('  │ 4. 是否出口过美国/欧洲（有无认证）          │');
  console.log('  │ 5. 正常交货周期(Lead Time)                  │');
  console.log('  │                                              │');
  console.log('  │ 首批试单量：50-100件                        │');
  console.log('  │ 长期合作意愿：月采购量1000+件               │');
  console.log('  │                                              │');
  console.log('  │ 期待合作！                                  │');
  console.log('  └─────────────────────────────────────────────┘\n');

  return { top3, totalCost, allScored: scored };
}

// ============================================================
// 利润计算
// ============================================================

function calcDetailedProfit(product) {
  const revenue = product.price * CONFIG.exchangeRate;
  const cost = product.cost1688;
  const fba = product.price * CONFIG.fbaFeeRate * CONFIG.exchangeRate;
  const referral = product.price * CONFIG.referralFeeRate * CONFIG.exchangeRate;
  const ad = product.price * 0.10 * CONFIG.exchangeRate; // 广告费按售价10%估
  const shipping = product.weight > 1 ? product.weight * 8 : 12; // 头程运费估算

  return Math.round(revenue - cost - fba - referral - ad - shipping);
}

function calcMargin(product) {
  const revenue = product.price * CONFIG.exchangeRate;
  const profit = calcDetailedProfit(product);
  return Math.round((profit / revenue) * 100);
}

function calcMonthlyProfit(product) {
  const profitPerUnit = calcDetailedProfit(product);
  // 假设我们能拿到该产品月销量的5-10%
  const ourShare = product.monthly * 0.05; // 保守估计5%
  return Math.round(profitPerUnit * ourShare);
}

function calcFirstOrderCost(product) {
  return product.moq * product.cost1688 + CONFIG.sampleCostPerProduct + CONFIG.adBudgetPerProduct;
}

// ============================================================
// 执行
// ============================================================

if (require.main === module) {
  runFullAnalysis();
}

module.exports = { runFullAnalysis, CONFIG };
