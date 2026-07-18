export interface AIModelConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  apiEndpoint: string;
  apiKeyPlaceholder: string;
  apiKeyHelp: string;
  supportsVision: boolean;
  maxTokens: number;
  requestFormat: 'openai' | 'baidu' | 'alibaba' | 'zhipu' | 'bytedance' | 'xunfei' | 'deepseek';
}

export const AI_MODELS: AIModelConfig[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🐋',
    description: '深度求索大模型，性价比高，支持对话和推理',
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    apiKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    apiKeyHelp: '在 DeepSeek 开放平台 (platform.deepseek.com) 获取 API Key',
    supportsVision: false,
    maxTokens: 4096,
    requestFormat: 'deepseek'
  },
  {
    id: 'baidu',
    name: '百度文心一言',
    icon: '📚',
    description: '百度ERNIE大模型，中文理解能力强',
    apiEndpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
    apiKeyPlaceholder: 'Bearer 你的AccessToken',
    apiKeyHelp: '在百度AI开放平台 (ai.baidu.com) 创建应用获取 API Key 和 Secret Key',
    supportsVision: true,
    maxTokens: 4096,
    requestFormat: 'baidu'
  },
  {
    id: 'alibaba',
    name: '阿里通义千问',
    icon: '🌐',
    description: '阿里云Qwen大模型，多轮对话和代码能力强',
    apiEndpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    apiKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    apiKeyHelp: '在阿里云百炼平台 (bailian.aliyun.com) 获取 API Key',
    supportsVision: true,
    maxTokens: 4096,
    requestFormat: 'alibaba'
  },
  {
    id: 'zhipu',
    name: '智谱AI (GLM)',
    icon: '🧠',
    description: '智谱ChatGLM大模型，开源生态丰富',
    apiEndpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    apiKeyPlaceholder: '你的API Key',
    apiKeyHelp: '在智谱AI开放平台 (open.bigmodel.cn) 获取 API Key',
    supportsVision: true,
    maxTokens: 4096,
    requestFormat: 'zhipu'
  },
  {
    id: 'bytedance',
    name: '字节豆包',
    icon: '🎵',
    description: '字节跳动豆包大模型，内容创作能力强',
    apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    apiKeyPlaceholder: 'Bearer 你的API Key',
    apiKeyHelp: '在火山引擎方舟平台 (console.volcengine.com/ark) 获取 API Key',
    supportsVision: true,
    maxTokens: 4096,
    requestFormat: 'bytedance'
  },
  {
    id: 'xunfei',
    name: '讯飞星火',
    icon: '⭐',
    description: '科大讯飞星火大模型，语音和NLP能力强',
    apiEndpoint: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
    apiKeyPlaceholder: 'Bearer 你的API Key',
    apiKeyHelp: '在讯飞开放平台 (xinghuo.xfyun.cn) 获取 API Key',
    supportsVision: true,
    maxTokens: 4096,
    requestFormat: 'xunfei'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    description: 'OpenAI GPT-4o / GPT-4o mini',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    apiKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    apiKeyHelp: '在 OpenAI 平台 (platform.openai.com) 获取 API Key',
    supportsVision: true,
    maxTokens: 4096,
    requestFormat: 'openai'
  }
];

export const PRESET_PROMPTS = {
  foodRecognition: `你是一位专业的食材识别专家。请分析用户上传的食材图片，识别出图中所有食材，并以JSON格式返回。
要求：
1. 只返回JSON格式数据，不要有任何其他文字说明
2. JSON格式：{"ingredients": ["食材1", "食材2", ...]}
3. 使用中文食材名称
4. 如果无法识别，返回 {"ingredients": []}`,

  kitchenRecognition: `你是一位厨房用品识别专家。请分析用户上传的厨房照片，识别出图中所有可用的厨具/电器。
要求：
1. 只返回JSON格式数据，不要有任何其他文字说明
2. JSON格式：{"kitchen": ["厨具1", "厨具2", ...]}
3. 使用中文名称
4. 如果无法识别，返回 {"kitchen": []}`,

  medicalRecognition: `你是一位专业的医疗文档分析助手。请分析用户上传的医疗报告/病例照片，识别出相关的健康状况和饮食禁忌。
要求：
1. 只返回JSON格式数据，不要有任何其他文字说明
2. JSON格式：{"conditions": ["病症1", "病症2", ...]}
3. 使用中文病症名称
4. 如果无法识别或没有明显病症，返回 {"conditions": []}`,

  recipeRecommendation: (profile: any, ingredients: string[]) => `你是一位专业的营养师和厨师。请根据以下用户信息，推荐3道适合的菜谱。

用户信息：
- 身高：${profile.height}cm
- 体重：${profile.weight}kg
- BMI：${(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)}
- 健康目标：${profile.goals.concat(profile.customGoals).join('、') || '未设定'}
- 基础病/禁忌：${profile.conditions.concat(profile.customConditions).join('、') || '无'}
- 可用厨具：${profile.kitchen.concat(profile.customKitchen).join('、') || '未指定'}
- 现有食材：${ingredients.join('、') || '无'}

要求：
1. 只返回JSON格式数据，不要有任何其他文字说明
2. JSON格式：[{"name": "菜名", "time": "烹饪时间", "calories": "约xxx千卡", "cookware": "所需厨具", "ingredients": ["食材1", "食材2"], "recipe_items": ["食材用量1", "食材用量2"], "steps": ["步骤1", "步骤2"], "reason": "推荐理由"}]
3. 必须考虑用户的健康目标和禁忌
4. 优先使用用户现有的食材
5. 推荐适合用户厨具的菜品
6. 每道菜需要详细的烹饪步骤`
};
