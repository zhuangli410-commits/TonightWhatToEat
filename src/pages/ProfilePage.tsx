import React, { useState, useEffect } from 'react';
import { Plus, X, Camera } from 'lucide-react';
import { UserProfile } from '../utils/storage';

const PRESET_GOALS = ['普通健康', '减脂塑形', '增肌健身', '控糖管理', '养胃护胃', '低嘌呤', '高血压管理', '高蛋白', '清淡饮食', '素食友好'];
const PRESET_CONDITIONS = ['糖尿病', '高血压', '痛风', '高血脂', '胃病', '海鲜过敏', '坚果过敏', '乳糖不耐受', '麸质过敏', '素食', '口腔溃疡', '贫血', '甲状腺', '肾病', '胆囊炎', '无'];
const PRESET_KITCHEN = ['电饭煲', '炒锅', '蒸锅', '高压锅', '空气炸锅', '微波炉', '烤箱', '平底锅', '砂锅', '破壁机', '不粘锅', '汤锅', '煎锅', '电炖盅', '电磁炉', '燃气灶'];

interface Props {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export default function ProfilePage({ profile, onUpdate }: Props) {
  const [height, setHeight] = useState(profile.height.toString());
  const [weight, setWeight] = useState(profile.weight.toString());
  const [bmi, setBmi] = useState(0);
  const [customGoal, setCustomGoal] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [customKitchen, setCustomKitchen] = useState('');

  useEffect(() => {
    const h = parseFloat(height) || 170;
    const w = parseFloat(weight) || 65;
    setBmi(w / Math.pow(h / 100, 2));
  }, [height, weight]);

  const toggleGoal = (goal: string) => {
    const goals = profile.goals.includes(goal)
      ? profile.goals.filter(g => g !== goal)
      : [...profile.goals, goal];
    onUpdate({ ...profile, goals });
  };

  const toggleCondition = (condition: string) => {
    if (condition === '无') {
      onUpdate({ ...profile, conditions: [], customConditions: [] });
      return;
    }
    const conditions = profile.conditions.includes(condition)
      ? profile.conditions.filter(c => c !== condition)
      : [...profile.conditions, condition];
    onUpdate({ ...profile, conditions });
  };

  const toggleKitchen = (kitchen: string) => {
    const kitchens = profile.kitchen.includes(kitchen)
      ? profile.kitchen.filter(k => k !== kitchen)
      : [...profile.kitchen, kitchen];
    onUpdate({ ...profile, kitchen: kitchens });
  };

  const addCustom = (type: 'goal' | 'condition' | 'kitchen') => {
    const value = type === 'goal' ? customGoal : type === 'condition' ? customCondition : customKitchen;
    if (!value.trim()) return;

    const key = type === 'goal' ? 'customGoals' : type === 'condition' ? 'customConditions' : 'customKitchen';
    const current = profile[key as keyof UserProfile] as string[];
    if (!current.includes(value.trim())) {
      onUpdate({ ...profile, [key]: [...current, value.trim()] });
    }

    if (type === 'goal') setCustomGoal('');
    else if (type === 'condition') setCustomCondition('');
    else setCustomKitchen('');
  };

  const removeCustom = (type: 'goal' | 'condition' | 'kitchen', value: string) => {
    const key = type === 'goal' ? 'customGoals' : type === 'condition' ? 'customConditions' : 'customKitchen';
    const current = profile[key as keyof UserProfile] as string[];
    onUpdate({ ...profile, [key]: current.filter(v => v !== value) });
  };

  const getBmiInfo = () => {
    if (bmi < 18.5) return { text: '偏瘦', color: '#4ECDC4' };
    if (bmi < 24) return { text: '正常', color: '#2EC4B6' };
    if (bmi < 28) return { text: '超重', color: '#FF8B5E' };
    return { text: '肥胖', color: '#FF6B35' };
  };

  const bmiInfo = getBmiInfo();

  return (
    <div style={{ animation: 'fadeIn .35s cubic-bezier(.4,0,.2,1)' }}>
      {/* 头部 */}
      <div style={{
        padding: '28px 0 18px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ fontSize: '46px', marginBottom: '6px' }}>🍜</div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#FF6B35',
          letterSpacing: '2px'
        }}>今晚吃什么</h1>
        <div style={{
          fontSize: '12.5px',
          color: '#a0a0a0',
          marginTop: '6px',
          letterSpacing: '.5px',
          fontWeight: 500
        }}>AI 智能菜谱推荐 · 量身定制</div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '3px',
          borderRadius: '2px',
          background: 'linear-gradient(90deg, #FF6B35, #2EC4B6)',
          opacity: .35
        }} />
      </div>

      {/* 身体数据 */}
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
          <span>👤</span> 身体数据
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={{ fontSize: '12.5px', color: '#888', marginBottom: '8px', display: 'block', fontWeight: 700 }}>身高 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={e => setHeight(e.target.value)}
              onBlur={() => onUpdate({ ...profile, height: parseFloat(height) || 170 })}
              style={{
                width: '100%',
                padding: '13px 15px',
                border: '1.5px solid rgba(0,0,0,.06)',
                borderRadius: '14px',
                fontSize: '14px',
                background: 'rgba(255,255,255,.6)',
                outline: 'none',
                fontFamily: 'inherit',
                color: '#2b2b2b'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12.5px', color: '#888', marginBottom: '8px', display: 'block', fontWeight: 700 }}>体重 (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              onBlur={() => onUpdate({ ...profile, weight: parseFloat(weight) || 65 })}
              style={{
                width: '100%',
                padding: '13px 15px',
                border: '1.5px solid rgba(0,0,0,.06)',
                borderRadius: '14px',
                fontSize: '14px',
                background: 'rgba(255,255,255,.6)',
                outline: 'none',
                fontFamily: 'inherit',
                color: '#2b2b2b'
              }}
            />
          </div>
        </div>

        <div style={{
          fontSize: '12.5px',
          color: '#777',
          padding: '8px 14px',
          background: 'linear-gradient(135deg, rgba(255,248,240,.8), rgba(255,240,225,.6))',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          display: 'inline-block',
          border: '1px solid rgba(255,220,200,.4)',
          fontWeight: 500
        }}>
          BMI: <strong style={{ color: bmiInfo.color }}>{bmi.toFixed(1)}</strong> ({bmiInfo.text})
        </div>
      </div>

      {/* 健康目标 */}
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
          <span>🎯</span> 健康目标
        </div>
        <div style={{ fontSize: '12px', color: '#b0b0b0', marginTop: '-8px', marginBottom: '14px', lineHeight: 1.7 }}>
          选择你的饮食目标，可多选
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          {PRESET_GOALS.map(goal => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              style={{
                padding: '8px 14px',
                border: profile.goals.includes(goal) ? 'none' : '1.5px solid rgba(0,0,0,.06)',
                borderRadius: '20px',
                fontSize: '13px',
                cursor: 'pointer',
                background: profile.goals.includes(goal)
                  ? 'linear-gradient(135deg, #FF6B35 0%, #FF8B5E 100%)'
                  : 'rgba(255,255,255,.7)',
                color: profile.goals.includes(goal) ? '#fff' : '#555',
                boxShadow: profile.goals.includes(goal) ? '0 4px 14px rgba(255, 107, 53, .30)' : 'none',
                transform: profile.goals.includes(goal) ? 'translateY(-1px)' : 'none',
                fontWeight: profile.goals.includes(goal) ? 600 : 500,
                transition: 'all .2s cubic-bezier(.4,0,.2,1)',
                userSelect: 'none'
              }}
            >
              {goal}
            </button>
          ))}
        </div>

        {/* 自定义目标 */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '12px', borderTop: '1px solid rgba(245,230,216,.5)' }}>
          <input
            type="text"
            value={customGoal}
            onChange={e => setCustomGoal(e.target.value)}
            placeholder="自定义目标..."
            onKeyPress={e => e.key === 'Enter' && addCustom('goal')}
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: '13px',
              border: '1.5px solid rgba(0,0,0,.06)',
              borderRadius: '14px',
              background: 'rgba(255,255,255,.6)',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={() => addCustom('goal')}
            style={{
              background: 'linear-gradient(135deg, #2EC4B6 0%, #25A99C 100%)',
              color: '#fff',
              border: 'none',
              padding: '0 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Plus size={16} />
          </button>
        </div>

        {profile.customGoals.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {profile.customGoals.map(goal => (
              <span key={goal} style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #FFF3EA 0%, #FFE8D8 100%)',
                border: '1.5px solid #ffb48a',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#FF6B35',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {goal}
                <button
                  onClick={() => removeCustom('goal', goal)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#FF6B35',
                    padding: 0,
                    display: 'inline-flex'
                  }}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 基础病/禁忌 */}
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
          <span>⚕️</span> 基础病/禁忌
        </div>
        <div style={{ fontSize: '12px', color: '#b0b0b0', marginTop: '-8px', marginBottom: '14px', lineHeight: 1.7 }}>
          选择需要忌口或特别注意的情况，可多选
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          {PRESET_CONDITIONS.map(condition => (
            <button
              key={condition}
              onClick={() => toggleCondition(condition)}
              style={{
                padding: '8px 14px',
                border: profile.conditions.includes(condition) || (condition === '无' && profile.conditions.length === 0)
                  ? 'none'
                  : '1.5px solid rgba(0,0,0,.06)',
                borderRadius: '20px',
                fontSize: '13px',
                cursor: 'pointer',
                background: profile.conditions.includes(condition) || (condition === '无' && profile.conditions.length === 0)
                  ? 'linear-gradient(135deg, #FF6B35 0%, #FF8B5E 100%)'
                  : 'rgba(255,255,255,.7)',
                color: profile.conditions.includes(condition) || (condition === '无' && profile.conditions.length === 0)
                  ? '#fff'
                  : '#555',
                boxShadow: profile.conditions.includes(condition) || (condition === '无' && profile.conditions.length === 0)
                  ? '0 4px 14px rgba(255, 107, 53, .30)'
                  : 'none',
                fontWeight: profile.conditions.includes(condition) || (condition === '无' && profile.conditions.length === 0)
                  ? 600
                  : 500,
                transition: 'all .2s cubic-bezier(.4,0,.2,1)'
              }}
            >
              {condition}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '12px', borderTop: '1px solid rgba(245,230,216,.5)' }}>
          <input
            type="text"
            value={customCondition}
            onChange={e => setCustomCondition(e.target.value)}
            placeholder="自定义禁忌..."
            onKeyPress={e => e.key === 'Enter' && addCustom('condition')}
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: '13px',
              border: '1.5px solid rgba(0,0,0,.06)',
              borderRadius: '14px',
              background: 'rgba(255,255,255,.6)',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={() => addCustom('condition')}
            style={{
              background: 'linear-gradient(135deg, #2EC4B6 0%, #25A99C 100%)',
              color: '#fff',
              border: 'none',
              padding: '0 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
          </button>
        </div>

        {profile.customConditions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {profile.customConditions.map(condition => (
              <span key={condition} style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #FFF3EA 0%, #FFE8D8 100%)',
                border: '1.5px solid #ffb48a',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#FF6B35',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {condition}
                <button
                  onClick={() => removeCustom('condition', condition)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#FF6B35',
                    padding: 0,
                    display: 'inline-flex'
                  }}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 厨具 */}
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
          <span>🍳</span> 我的厨具
        </div>
        <div style={{ fontSize: '12px', color: '#b0b0b0', marginTop: '-8px', marginBottom: '14px', lineHeight: 1.7 }}>
          选择你厨房中可用的厨具，可多选
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          {PRESET_KITCHEN.map(kitchen => (
            <button
              key={kitchen}
              onClick={() => toggleKitchen(kitchen)}
              style={{
                padding: '8px 14px',
                border: profile.kitchen.includes(kitchen) ? 'none' : '1.5px solid rgba(0,0,0,.06)',
                borderRadius: '20px',
                fontSize: '13px',
                cursor: 'pointer',
                background: profile.kitchen.includes(kitchen)
                  ? 'linear-gradient(135deg, #FF6B35 0%, #FF8B5E 100%)'
                  : 'rgba(255,255,255,.7)',
                color: profile.kitchen.includes(kitchen) ? '#fff' : '#555',
                boxShadow: profile.kitchen.includes(kitchen) ? '0 4px 14px rgba(255, 107, 53, .30)' : 'none',
                fontWeight: profile.kitchen.includes(kitchen) ? 600 : 500,
                transition: 'all .2s cubic-bezier(.4,0,.2,1)'
              }}
            >
              {kitchen}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '12px', borderTop: '1px solid rgba(245,230,216,.5)' }}>
          <input
            type="text"
            value={customKitchen}
            onChange={e => setCustomKitchen(e.target.value)}
            placeholder="自定义厨具..."
            onKeyPress={e => e.key === 'Enter' && addCustom('kitchen')}
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: '13px',
              border: '1.5px solid rgba(0,0,0,.06)',
              borderRadius: '14px',
              background: 'rgba(255,255,255,.6)',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={() => addCustom('kitchen')}
            style={{
              background: 'linear-gradient(135deg, #2EC4B6 0%, #25A99C 100%)',
              color: '#fff',
              border: 'none',
              padding: '0 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
          </button>
        </div>

        {profile.customKitchen.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {profile.customKitchen.map(kitchen => (
              <span key={kitchen} style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #FFF3EA 0%, #FFE8D8 100%)',
                border: '1.5px solid #ffb48a',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#FF6B35',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {kitchen}
                <button
                  onClick={() => removeCustom('kitchen', kitchen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#FF6B35',
                    padding: 0,
                    display: 'inline-flex'
                  }}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
