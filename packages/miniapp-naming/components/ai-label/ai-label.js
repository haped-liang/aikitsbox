/**
 * AI内容标识组件
 *
 * 2026年《人工智能生成合成内容标识办法》要求：
 * - 显式标识：用户可见的文字/图形提示"内容由AI生成"
 * - 隐式标识：数字水印/元数据中包含AI生成标记
 *
 * 缺失此标识 = 审核直接驳回
 */

Component({
  properties: {
    // 是否显示标识
    show: {
      type: Boolean,
      value: true,
    },
    // 标识文字
    text: {
      type: String,
      value: '内容由AI生成，仅供参考',
    },
    // 标识位置: 'top' | 'bottom' | 'inline'
    position: {
      type: String,
      value: 'top',
    },
    // 标识样式: 'banner' | 'badge' | 'text'
    type: {
      type: String,
      value: 'banner',
    },
  },

  data: {
    // AI内容元数据（隐式标识）
    aiMetadata: {
      generator: 'AI起名大师 - 混元大模型',
      version: '1.0.0',
      timestamp: '',
      modelName: 'hunyuan-lite',
      provider: '腾讯混元',
    },
  },

  lifetimes: {
    attached() {
      // 自动生成时间戳
      this.setData({
        'aiMetadata.timestamp': new Date().toISOString(),
      });
    },
  },

  methods: {
    /**
     * 获取隐式标识元数据（嵌入到内容中传给后端/存储）
     */
    getMetadata() {
      return {
        ...this.data.aiMetadata,
        appName: 'AI起名大师',
        contentId: this.generateContentId(),
      };
    },

    /**
     * 生成内容唯一ID
     */
    generateContentId() {
      return `ai_naming_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    },
  },
});
