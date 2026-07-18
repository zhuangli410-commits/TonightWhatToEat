import React, { useState, useRef } from 'react';
import { Plus, X, Camera, Loader } from 'lucide-react';
import { ApiConfig } from '../utils/storage';
import { recognizeFood } from '../utils/aiApi';

interface Props {
  ingredients: string[];
  onUpdate: (ingredients: string[]) => void;
  apiConfig: ApiConfig;
}

export default function FoodPage({ ingredients, onUpdate, apiConfig }: Props) {
  const [input, setInput] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizeStatus, setRecognizeStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addIngredient = () => {
    if (!input.trim()) return;
    const items = input.split(/[\s,，、]+/).filter(x => x);
    const newIngredients = [...ingredients];
    let added = 0;
    items.forEach(item => {
      if (!newIngredients.includes(item)) {
        newIngredients.push(item);
        added++;
      }
    });
    onUpdate(newIngredients);
    setInput('');
    setRecognizeStatus(added > 0 ? `已添加 ${added} 种食材` : '这些食材已经在列表中了');
    setTimeout(() => setRecognizeStatus(''), 2000);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    onUpdate(newIngredients);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!apiConfig.key) {
      setRecognizeStatus('请先设置AI API密钥');
      setTimeout(() => setRecognizeStatus(''), 3000);
      return;
    }

    setIsRecognizing(true);
    setRecognizeStatus('AI正在识别食材...');

    try {
      const base64 = await fileToBase64(file);
      const result = await recognizeFood(apiConfig, base64);

      if (result.length > 0) {
        const newIngredients = [...ingredients];
        let added = 0;
        result.forEach(item => {
          if (!newIngredients.includes(item)) {
            newIngredients.push(item);
            added++;
          }
        });
        onUpdate(newIngredients);
        setRecognizeStatus(`识别到 ${result.join('、')}，已添加 ${added} 种`);
      } else {
        setRecognizeStatus('未能识别出食材，请手动添加');
      }
    } catch (error) {
      setRecognizeStatus('识别失败，请检查API配置');
    } finally {
      setIsRecognizing(false);
      setTimeout(() => setRecognizeStatus(''), 3000);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div style={{ animation: 'fadeIn .35s cubic-bezier(.4,0,.2,1)' }}>
      {/* 头部 */}
      <div style={{
        padding: '28px 0 18px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ fontSize: '46px', marginBottom: '6px' }}>🥬</div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#FF6B35',
          letterSpacing: '2px'
        }}>我的食材</h1>
        <div style={{
          fontSize: '12.5px',
          color: '#a0a0a0',
          marginTop: '6px',
          letterSpacing: '.5px',
          fontWeight: 500
        }}>添加现有食材，AI为你推荐菜谱</div>
      </div>

      {/* 拍照识别 */}
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
          <span>📸</span> 拍照识别食材
        </div>
        <div style={{ fontSize: '12px', color: '#b0b0b0', marginTop: '-8px', marginBottom: '14px', lineHeight: 1.7 }}>
          上传冰箱或食材照片，AI自动识别
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isRecognizing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'linear-gradient(135deg, rgba(255,248,240,.85) 0%, rgba(255,236,224,.85) 100%)',
            backdropFilter: 'blur(16px) saturate(140%)',
            borderRadius: '18px',
            padding: '18px 16px',
            marginBottom: '14px',
            cursor: isRecognizing ? 'not-allowed' : 'pointer',
            transition: 'all .3s cubic-bezier(.4,0,.2,1)',
            border: '1.5px solid rgba(255,216,184,.6)',
            boxShadow: '0 4px 20px rgba(255,107,53,.06), inset 0 1px 0 rgba(255,255,255,.7)',
            width: '100%',
            opacity: isRecognizing ? 0.7 : 1
          }}
        >
          <div style={{
            flexShrink: 0,
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(255,255,255,.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 3px 10px rgba(255,107,53,.10)',
            border: '1px solid rgba(255,224,200,.5)'
          }}>
            {isRecognizing ? <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={24} />}
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#FF6B35', marginBottom: '4px', lineHeight: 1.4 }}>
              {isRecognizing ? 'AI 正在识别...' : '拍照识别食材'}
            </div>
            <div style={{ fontSize: '12px', color: '#999', lineHeight: 1.6 }}>
              {isRecognizing ? '请稍候...' : '拍一张冰箱或食材照片'}
            </div>
          </div>
          <div style={{ fontSize: '18px', color: '#ff9870', flexShrink: 0 }}>›</div>
        </button>

        {recognizeStatus && (
          <div style={{
            marginTop: '8px',
            marginBottom: '12px',
            fontSize: '12.5px',
            color: '#444',
            padding: '14px 16px',
            background: 'rgba(255,255,255,.7)',
            backdropFilter: 'blur(16px)',
            borderRadius: '14px',
            border: '1px solid rgba(0,0,0,.04)',
            boxShadow: '0 2px 12px rgba(0,0,0,.03)'
          }}>
            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isRecognizing ? '#FF6B35' : '#2EC4B6',
                animation: isRecognizing ? 'pulse 1.2s ease-in-out infinite' : 'none'
              }} />
              {isRecognizing ? '处理中...' : '完成'}
            </div>
            <div>{recognizeStatus}</div>
          </div>
        )}
      </div>

      {/* 手动添加 */}
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
          <span>✏️</span> 手动添加
        </div>
        <div style={{ fontSize: '12px', color: '#b0b0b0', marginTop: '-8px', marginBottom: '14px', lineHeight: 1.7 }}>
          支持空格、逗号分隔多个食材
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入食材名称..."
            onKeyPress={e => e.key === 'Enter' && addIngredient()}
            style={{
              flex: 1,
              padding: '13px 15px',
              border: '1.5px solid rgba(0,0,0,.06)',
              borderRadius: '14px',
              fontSize: '14px',
              background: 'rgba(255,255,255,.6)',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={addIngredient}
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8B5E 100%)',
              color: '#fff',
              border: 'none',
              padding: '0 20px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={18} /> 添加
          </button>
        </div>
      </div>

      {/* 食材列表 */}
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
          gap: '8px',
          justifyContent: 'space-between'
        }}>
          <span><span style={{ marginRight: '8px' }}>🥗</span>食材清单</span>
          <span style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>
            共 {ingredients.length} 种
          </span>
        </div>

        {ingredients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', color: '#c0c0c0', fontSize: '13px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🥬</div>
            还没有添加食材<br />拍照识别或手动添加
          </div>
        ) : (
          <div>
            {ingredients.map((ingredient, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(255,250,243,.65)',
                backdropFilter: 'blur(8px)',
                borderRadius: '14px',
                marginBottom: '6px',
                border: '1px solid rgba(255,232,212,.4)',
                transition: 'all .2s ease'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#555' }}>
                  🥦 {ingredient}
                </span>
                <button
                  onClick={() => removeIngredient(index)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FF6B35',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '0 6px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    transition: 'all .15s ease'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
