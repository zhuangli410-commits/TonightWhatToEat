import { AI_MODELS, PRESET_PROMPTS } from '../data/aiModels';
import { ApiConfig } from './storage';

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

function buildRequestBody(format: string, prompt: string, imageBase64?: string) {
  const messages: any[] = [{ role: 'user', content: prompt }];
  
  if (imageBase64) {
    messages[0].content = [
      { type: 'text', text: prompt },
      { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
    ];
  }

  switch (format) {
    case 'baidu':
      return { messages };
    case 'alibaba':
      return {
        model: 'qwen-turbo',
        input: { messages }
      };
    case 'zhipu':
      return {
        model: 'glm-4',
        messages
      };
    case 'bytedance':
      return {
        model: 'doubao-pro-4k',
        messages
      };
    case 'xunfei':
      return {
        model: 'generalv3.5',
        messages
      };
    case 'deepseek':
      return {
        model: 'deepseek-chat',
        messages,
        max_tokens: 4096
      };
    case 'openai':
    default:
      return {
        model: imageBase64 ? 'gpt-4o' : 'gpt-4o-mini',
        messages,
        max_tokens: 4096
      };
  }
}

function parseResponse(format: string, response: any): string {
  try {
    switch (format) {
      case 'baidu':
        return response.result || '';
      case 'alibaba':
        return response.output?.text || '';
      case 'zhipu':
        return response.choices?.[0]?.message?.content || '';
      case 'bytedance':
      case 'xunfei':
      case 'deepseek':
      case 'openai':
      default:
        return response.choices?.[0]?.message?.content || '';
    }
  } catch (e) {
    return '';
  }
}

export async function callAI(config: ApiConfig, prompt: string, imageBase64?: string): Promise<AIResponse> {
  if (!config.key) {
    return { success: false, error: '未配置 API Key' };
  }

  const model = AI_MODELS.find(m => m.id === config.provider);
  if (!model) {
    return { success: false, error: '未知的 AI 提供商' };
  }

  try {
    const endpoint = config.endpoint || model.apiEndpoint;
    const body = buildRequestBody(model.requestFormat, prompt, imageBase64);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (model.requestFormat === 'baidu') {
      headers['Authorization'] = config.key;
    } else if (model.requestFormat === 'alibaba') {
      headers['Authorization'] = `Bearer ${config.key}`;
    } else {
      headers['Authorization'] = `Bearer ${config.key}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `API 请求失败 (${response.status}): ${errorText}` };
    }

    const data = await response.json();
    const content = parseResponse(model.requestFormat, data);

    if (!content) {
      return { success: false, error: 'API 返回内容为空' };
    }

    try {
      const jsonData = JSON.parse(content);
      return { success: true, data: jsonData };
    } catch (e) {
      return { success: true, data: content };
    }
  } catch (error: any) {
    return { success: false, error: error.message || '网络请求失败' };
  }
}

export async function recognizeFood(config: ApiConfig, imageBase64: string): Promise<string[]> {
  const result = await callAI(config, PRESET_PROMPTS.foodRecognition, imageBase64);
  if (result.success && result.data?.ingredients) {
    return result.data.ingredients;
  }
  return [];
}

export async function recognizeKitchen(config: ApiConfig, imageBase64: string): Promise<string[]> {
  const result = await callAI(config, PRESET_PROMPTS.kitchenRecognition, imageBase64);
  if (result.success && result.data?.kitchen) {
    return result.data.kitchen;
  }
  return [];
}

export async function recognizeMedical(config: ApiConfig, imageBase64: string): Promise<string[]> {
  const result = await callAI(config, PRESET_PROMPTS.medicalRecognition, imageBase64);
  if (result.success && result.data?.conditions) {
    return result.data.conditions;
  }
  return [];
}

export async function recommendRecipes(config: ApiConfig, profile: any, ingredients: string[]): Promise<any[]> {
  const prompt = PRESET_PROMPTS.recipeRecommendation(profile, ingredients);
  const result = await callAI(config, prompt);
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }
  return [];
}
