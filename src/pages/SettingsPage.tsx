import React, { useState } from 'react';
import { Save, ExternalLink, AlertCircle } from 'lucide-react';
import { ApiConfig } from '../utils/storage';
import { AI_MODELS } from '../data/aiModels';

interface Props {
  apiConfig: ApiConfig;
  onUpdate: (config: ApiConfig) => void;
}

export default function SettingsPage({ apiConfig, onUpdate }: Props) {
  const [provider, setProvider] = useState(apiConfig.provider);
  const [key, setKey] = useState(apiConfig.key);
  const [endpoint, setEndpoint] = useState(apiConfig.endpoint || '');
  const [saved, setSaved] = useState(false);

  const selectedModel = AI_MODELS.find(m => m.id === provider);

  const handleSave = () => {
    onUpdate({
      provider,
      key,
      endpoint: endpoint || undefined
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ animation: 'fadeIn .35s cubic-bezier(.4,0,.2,1)' }}>
      {/* 头部 */}
      <div style={{
        padding: '28px 0 18px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ fontSize: '46px', marginBottom: '6px' }}>⚙️</div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#FF6B35',
          letterSpacing: '2px'
        }}>设置</h1>
        <div style={{
          fontSize: '12.5px',
          color: '#a0a0a0',
          marginTop: '6px',
          letterSpacing: '.5px',
          fontWeight: 500
        }}>AI 模型配置与使用说明</div>
      </div>

      {/* AI设置 */}
      <div style={{
        background: 'rgba(255,255,255,.72)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: '20px',
        padding: '20px 18px 22px',
        marginBottom: '16px',
        boxShadow: '0 4px 24px rgba(255, 107, 53, .06), 0 1px 3px rgba(0, 0, 0, .03), inset 0 1px 0 rgba(255,255,255,.8)',
        border: '1px solid rgba(255, 230, 210, .45)'
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 800,
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🔧</span> AI 模型配置
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #FFF8F0, #FFE8D4)',
          padding: '14px 16px',
          borderRadius: '14px',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#666',
          lineHeight: 1.7,
          border: '1px solid rgba(255,200,150,.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 700, color: '#FF6B35' }}>
            <AlertCircle size={16} />
            说明
          </div>
          <strong>本地模式</strong>：不填写 API Key，使用本地算法推荐菜谱。<br />
          <strong>AI 模式</strong>：填写 API Key 后启用，调用真实大模型进行食材识别和菜谱生成。
        </div>

        {/* 提供商选择 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12.5px', color: '#888', marginBottom: '8px', display: 'block', fontWeight: 700 }}>
            选择 AI 提供商
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {AI_MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => {
                  setProvider(model.id);
                  setEndpoint(model.apiEndpoint);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  border: provider === model.id ? '2px solid #FF6B35' : '1.5px solid rgba(0,0,0,.06)',
                  background: provider === model.id ? 'rgba(255,107,53,.08)' : 'rgba(255,255,255,.6)',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <span style={{ fontSize: '28px' }}>{model.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#2b2b2b' }}>
                    {model.name}
                    {provider === model.id && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#FF6B35' }}>✓ 已选择</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{model.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        {selectedModel && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12.5px', color: '#888', marginBottom: '8px', display: 'block', fontWeight: 700 }}>
                API Key
              </label>
              <input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder={selectedModel.apiKeyPlaceholder}
                style={{
                  width: '100%',
                  padding: '13px 15px',
                  border: '1.5px solid rgba(0,0,0,.06)',
                  borderRadius: '14px',
                  fontSize: '14px',
                  background: 'rgba(255,255,255,.6)',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '6px', lineHeight: 1.5 }}>
                {selectedModel.apiKeyHelp}
              </div>
            </div>

            {/* 自定义 Endpoint */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12.5px', color: '#888', marginBottom: '8px', display: 'block', fontWeight: 700 }}>
                API 地址（可选）
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={e => setEndpoint(e.target.value)}
                placeholder={selectedModel.apiEndpoint}
                style={{
                  width: '100%',
                  padding: '13px 15px',
                  border: '1.5px solid rgba(0,0,0,.06)',
                  borderRadius: '14px',
                  fontSize: '14px',
                  background: 'rgba(255,255,255,.6)',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </>
        )}

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '16px',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8850 50%, #FF6B35 100%)',
            backgroundSize: '200% auto',
            color: '#fff',
            boxShadow: '0 6px 24px rgba(255,107,53,.30), 0 2px 6px rgba(255,107,53,.15)',
            transition: 'all .3s cubic-bezier(.4,0,.2,1)',
            letterSpacing: '.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Save size={18} />
          {saved ? '✅ 已保存' : '保存配置'}
        </button>
      </div>

      {/* 使用指南 */}
      <div style={{
        background: 'rgba(255,255,255,.72)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: '20px',
        padding: '20px 18px 22px',
        marginBottom: '16px',
        boxShadow: '0 4px 24px rgba(255, 107, 53, .06), 0 1px 3px rgba(0, 0, 0, .03), inset 0 1px 0 rgba(255,255,255,.8)',
        border: '1px solid rgba(255, 230, 210, .45)'
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 800,
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📖</span> 使用指南
        </div>

        <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.8 }}>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#FF6B35' }}>1. 完善个人档案</strong><br />
            填写身高体重 → 选择/输入健康目标 → 设置基础病禁忌 → 选择可用厨具
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#FF6B35' }}>2. 添加食材</strong><br />
            拍冰箱照片AI识别 → 手动补充食材
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#FF6B35' }}>3. 获取推荐</strong><br />
            点击"今日推荐"查看AI为你精选的菜谱
          </div>
          <div>
            <strong style={{ color: '#FF6B35' }}>4. 配置AI（可选）</strong><br />
            在设置中选择大模型提供商并填写API Key，获得更智能的推荐
          </div>
        </div>
      </div>

      {/* 版本信息 */}
      <div style={{
        textAlign: 'center',
        padding: '16px',
        color: '#bbb',
        fontSize: '11px',
        lineHeight: 1.8
      }}>
        🍜 今晚吃什么 · v2.0<br />
        AI 智能菜谱推荐应用
      </div>
    </div>
  );
}
