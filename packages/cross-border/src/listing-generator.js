/**
 * AI Listing生成器
 *
 * 功能：
 * 1. 多语言Listing自动生成（英语/德语/日语/西班牙语）
 * 2. SEO关键词挖掘与布局
 * 3. A+内容框架生成
 * 4. 后端Search Terms优化
 */

class ListingGenerator {
  constructor(config) {
    this.config = config;
  }

  /**
   * 为一个产品生成多市场Listing
   * @param {Object} product - 产品信息
   * @param {string[]} markets - 目标市场
   */
  async generate(product, markets) {
    const listings = {};

    for (const market of markets) {
      const language = this.getLanguage(market);
      console.log(`   📝 生成${market}市场Listing (${language})...`);

      listings[market] = {
        title: await this.generateTitle(product, market),
        bulletPoints: await this.generateBulletPoints(product, market),
        description: await this.generateDescription(product, market),
        searchTerms: await this.generateSearchTerms(product, market),
        aPlusContent: await this.generateAPlus(product, market),
      };
    }

    return listings;
  }

  /**
   * 生成标题（Amazon规则：200字符内）
   */
  async generateTitle(product, market) {
    // TODO: 接入AI API
    // const prompts = require('../../shared/ai/prompts');
    // return await askAI(prompts.CROSS_BORDER.listingGenerator(...));

    const templates = {
      US: `${product.name} - [Main Feature] | [Material] | [Size/Color] | Perfect for [Target Audience]`,
      UK: `${product.name} | Premium [Material] | [Key Benefit] | Ideal for [Use Case]`,
      DE: `${product.name} - [Hauptmerkmal] | [Material] | [Größe/Farbe] | Perfekt für [Zielgruppe]`,
      JP: `【日本正規品】${product.name} | [特徴] | [素材] | [サイズ] | [対象]`,
    };

    return this.expandTemplate(templates[market] || templates.US, product);
  }

  /**
   * 生成5个Bullet Points
   */
  async generateBulletPoints(product, market) {
    const features = [
      `✨ PREMIUM QUALITY: ${product.name} is crafted from high-quality materials, ensuring durability and long-lasting performance. Each unit undergoes rigorous quality testing before shipping.`,
      `🎯 SMART DESIGN: Thoughtfully engineered with user experience in mind. Features intuitive controls, ergonomic grip, and sleek modern aesthetics that complement any setting.`,
      `📦 READY TO USE: Comes with everything you need to get started right out of the box. Includes detailed instruction manual, mounting accessories, and 24/7 customer support access.`,
      `💪 VERSATILE APPLICATION: Perfect for home, office, travel, or gifting. Works great in multiple scenarios - whether you're a beginner or a pro, this product adapts to your needs.`,
      `🛡️ WORRY-FREE PURCHASE: Backed by our 30-day money-back guarantee and 12-month warranty. If you're not 100% satisfied, we'll make it right - no questions asked.`,
    ];

    return features;
  }

  /**
   * 生成产品描述（HTML格式）
   */
  async generateDescription(product, market) {
    return `<h2>Why Choose Our ${product.name}?</h2>
<p>We understand that you deserve the best. That's why we've designed our ${product.name.toLowerCase()} with one goal in mind: <strong>your complete satisfaction</strong>.</p>

<h3>Key Features:</h3>
<ul>
  <li>Premium build quality for daily use</li>
  <li>Intuitive design that anyone can use</li>
  <li>Compact and portable - take it anywhere</li>
  <li>Easy to clean and maintain</li>
  <li>Perfect gift idea for any occasion</li>
</ul>

<h3>Specifications:</h3>
<ul>
  <li>Material: High-grade ABS + Silicone</li>
  <li>Dimensions: Custom-fit design</li>
  <li>Package Includes: 1x ${product.name} + Accessories Kit + User Manual</li>
</ul>

<p><strong>Click "Add to Cart" now and experience the difference!</strong></p>`;
  }

  /**
   * 生成后端搜索词
   */
  async generateSearchTerms(product, market) {
    // 策略：用AI分析竞品标题+评论提取高频词
    const baseTerms = product.name.toLowerCase().split(' ');
    const synonyms = this.getSynonyms(product);
    const misspellings = this.getCommonMisspellings(product.name);
    const longTail = this.getLongTailKeywords(product);

    return [...baseTerms, ...synonyms, ...misspellings, ...longTail]
      .filter(Boolean)
      .slice(0, 249)  // Amazon 249字节限制
      .join(' ');
  }

  /**
   * 生成A+内容框架
   */
  async generateAPlus(product, market) {
    return {
      modules: [
        {
          type: 'logo_header',
          content: 'Brand Logo + Tagline',
        },
        {
          type: 'image_text_overlay',
          headline: `Premium ${product.name}`,
          text: 'Crafted with care for your everyday needs',
          imageIndex: 0,
        },
        {
          type: 'three_column_comparison',
          headline: 'Why We\'re Different',
          columns: [
            { icon: 'quality', title: 'Premium Materials', text: 'Built to last' },
            { icon: 'design', title: 'Smart Design', text: 'User-friendly' },
            { icon: 'support', title: 'Lifetime Support', text: 'We\'re here 24/7' },
          ],
        },
        {
          type: 'single_image_side_text',
          headline: 'Perfect for Any Setting',
          text: 'Whether at home, in the office, or on the go, our product fits seamlessly into your lifestyle.',
          imageIndex: 1,
        },
        {
          type: 'faq',
          questions: [
            { q: 'How long does shipping take?', a: '5-8 business days via FBA.' },
            { q: 'What\'s the warranty?', a: '12-month full warranty.' },
            { q: 'Can I return if not satisfied?', a: 'Yes! 30-day no-questions-asked return policy.' },
          ],
        },
      ],
    };
  }

  // ========== 辅助方法 ==========

  getLanguage(market) {
    const map = { US: 'English', UK: 'English', DE: 'German', FR: 'French', IT: 'Italian', ES: 'Spanish', JP: 'Japanese' };
    return map[market] || 'English';
  }

  expandTemplate(template, product) {
    return template
      .replace('[Main Feature]', product.name.split(' ').slice(-1)[0] || 'Pro')
      .replace('[Key Benefit]', 'Superior Quality & Design')
      .replace('[Material]', 'Premium Materials')
      .replace('[Size/Color]', 'Multiple Options Available')
      .replace('[Target Audience]', 'Home & Office')
      .replace('[Hauptmerkmal]', 'Premium Qualität')
      .replace('[Größe/Farbe]', 'Mehrere Optionen')
      .replace('[Zielgruppe]', 'Zuhause & Büro')
      .replace('[特徴]', '高品質素材')
      .replace('[素材]', 'プレミアム素材')
      .replace('[対象]', '家庭·オフィス');
  }

  getSynonyms(product) {
    // TODO: AI生成同义词
    return [];
  }

  getCommonMisspellings(name) {
    // TODO: 常见的拼写错误（有时搜索量很大）
    return [];
  }

  getLongTailKeywords(product) {
    // TODO: AI生成长尾关键词
    return [
      `best ${product.name.toLowerCase()} for home`,
      `${product.name.toLowerCase()} gift ideas`,
      `affordable ${product.name.toLowerCase()}`,
    ];
  }
}

module.exports = ListingGenerator;
