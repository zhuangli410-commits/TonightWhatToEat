import React, { useState, useEffect } from 'react';
import { Loader, ChefHat, Clock, Flame, Utensils } from 'lucide-react';
import { UserProfile, ApiConfig } from '../utils/storage';
import { RECIPES, Recipe } from '../data/recipes';
import { recommendRecipes } from '../utils/aiApi';

interface Props {
  profile: UserProfile;
  ingredients: string[];
  apiConfig: ApiConfig;
}

interface MatchedRecipe {
  recipe: Recipe;
  score: number;
  info: {
    goalMatches: string[];
    conditionMatches: string[];
    kitchenMatches: string[];
    ingredientMatches: string[];
  };
}

export default function ResultPage({ profile, ingredients, apiConfig }: Props) {
  const [recipes, setRecipes] = useState<MatchedRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [subText, setSubText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (recipes.length === 0 && !loading) {
      generateRecipes();
    }
  }, []);

  const generateRecipes = async () => {
    setLoading(true);
    setError('');
    setRecipes([]);

    const subTexts = ['分析你的健康档案...', '匹配厨具与食材...', '筛选禁忌菜品...', '为你挑选今日菜谱...'];
    let subIdx = 0;
    setLoadingText('AI 正在为你搭配...');
    setSubText(subTexts[0]);

    const subTimer = setInterval(() => {
      subIdx = (subIdx + 1) % subTexts.length;
      setSubText(subTexts[subIdx]);
    }, 600);

    try {
      if (apiConfig.key && apiConfig.provider !== 'local') {
        // 使用真实AI
        const aiRecipes = await recommendRecipes(apiConfig, profile, ingredients);
        if (aiRecipes.length > 0) {
          const formatted = aiRecipes.map((r: any) => ({
            recipe: {
              name: r.name,
              time: r.time,
              calories: r.calories,
              cookware: r.cookware,
              match: r.match || [],
              avoid: r.avoid || [],
              ingredients: r.ingredients || [],
              recipe_items: r.recipe_items || [],
              steps: r.steps || [],
              reason: r.reason
            } as Recipe,
            score: 100,
            info: {
              goalMatches: profile.goals,
              conditionMatches: [],
              kitchenMatches: [r.cookware],
              ingredientMatches: r.ingredients || []
            }
          }));
          setRecipes(formatted);
        } else {
          // AI失败，回退到本地
          const localRecipes = matchRecipesLocal();
          setRecipes(localRecipes);
        }
      } else {
        // 使用本地算法
        await new Promise(resolve => setTimeout(resolve, 2400));
        const localRecipes = matchRecipesLocal();
        setRecipes(localRecipes);
      }
    } catch (e: any) {
      setError(e.message || '生成失败，请重试');
    } finally {
      clearInterval(subTimer);
      setLoading(false);
    }
  };

  const matchRecipesLocal = (): MatchedRecipe[] => {
    const allGoals = profile.goals.concat(profile.customGoals);
    const allConditions = profile.conditions.concat(profile.customConditions);
    const allKitchen = profile.kitchen.concat(profile.customKitchen);

    const scored = RECIPES.map(recipe => {
      let score = 0;
      let matchInfo = { goalMatches: [], conditionMatches: [], kitchenMatches: [], ingredientMatches: [] } as any;

      // 厨具匹配 (最高 30 分)
      if (allKitchen.length === 0) {
        score += 15;
      } else {
        if (allKitchen.includes(recipe.cookware)) {
          score += 30;
          matchInfo.kitchenMatches.push(recipe.cookware);
        } else {
          for (const userK of allKitchen) {
            if (recipe.cookware.includes(userK) || userK.includes(recipe.cookware)) {
              score += 20;
              matchInfo.kitchenMatches.push(userK);
              break;
            }
          }
        }
      }

      // 健康目标匹配 (最高 40 分)
      if (allGoals.length === 0) {
        score += 15;
      } else {
        for (const goal of allGoals) {
          let matched = false;
          for (const m of recipe.match) {
            if (goal.includes(m) || m.includes(goal)) {
              score += Math.ceil(40 / allGoals.length);
              matchInfo.goalMatches.push(goal);
              matched = true;
              break;
            }
          }
          if (!matched) {
            for (const m of recipe.match) {
              const shortGoal = goal.substring(0, 2);
              const shortM = m.substring(0, 2);
              if (shortGoal === shortM && goal.length > 0) {
                score += Math.ceil(20 / allGoals.length);
                matchInfo.goalMatches.push(`${goal}≈${m}`);
                break;
              }
            }
          }
        }
      }

      // 禁忌扣分
      if (allConditions.length > 0) {
        for (const cond of allConditions) {
          for (const avoid of recipe.avoid) {
            if (cond.includes(avoid) || avoid.includes(cond)) {
              score -= 100;
              matchInfo.conditionMatches.push(cond);
            }
          }
        }
      }

      // 食材匹配 (最高 50 分)
      if (ingredients.length > 0) {
        for (const ing of ingredients) {
          for (const ri of recipe.ingredients) {
            if (ing.includes(ri) || ri.includes(ing)) {
              score += Math.ceil(50 / Math.max(recipe.ingredients.length, 1));
              matchInfo.ingredientMatches.push(ing);
              break;
            }
          }
        }
      } else {
        score += 10;
      }

      return { recipe, score, info: matchInfo };
    });

    scored.sort((a, b) => b.score - a.score);
    let top = scored.slice(0, 3);

    const allBlocked = top.every(x => x.score < 0 || x.info.conditionMatches.length > 0);
    if (allBlocked) {
      const fallback = scored.filter(x => x.info.conditionMatches.length === 0).slice(0, 3);
      if (fallback.length > 0) {
        top = fallback;
      }
    }

    return top;
  };

  const bmi = profile.weight / Math.pow(profile.height / 100, 2);

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn .35s cubic-bezier(.4,0,.2,1)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B35, #FF8B5E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(255,107,53,.25)',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}>
          <ChefHat size={40} color="#fff" />
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#2b2b2b', marginBottom: '8px' }}>
          {loadingText}
        </div>
        <div style={{ fontSize: '13px', color: '#888' }}>{subText}</div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn .35s cubic-bezier(.4,0,.2,1)' }}>
      {/* 头部 */}
      <div style={{
        padding: '28px 0 18px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ fontSize: '46px', marginBottom: '6px' }}>✨</div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#FF6B35',
          letterSpacing: '2px'
        }}>今日推荐</h1>
        <div style={{
          fontSize: '12.5px',
          color: '#a0a0a0',
          marginTop: '6px',
          letterSpacing: '.5px',
          fontWeight: 500
        }}>AI 为你精选 {recipes.length} 道菜谱</div>
      </div>

      {/* 档案摘要 */}
      <div style={{
        background: 'linear-gradient(135deg,#fff8f0,#ffe8d4)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: '20px',
        padding: '18px',
        marginBottom: '16px',
        boxShadow: '0 4px 24px rgba(255, 107, 53, .06)',
        border: '1px solid rgba(255, 230, 210, .45)'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#ff6b35', marginBottom: '8px' }}>👤 你的档案</div>
        <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.9 }}>
          身高 {profile.height}cm · 体重 {profile.weight}kg · BMI {bmi.toFixed(1)}<br />
          目标: {profile.goals.concat(profile.customGoals).join('、') || '未设定'}<br />
          禁忌: {profile.conditions.concat(profile.customConditions).join('、') || '无'}<br />
          厨具: {profile.kitchen.concat(profile.customKitchen).join('、') || '未指定'}<br />
          食材: {ingredients.join('、') || '无'}
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fff0f0',
          color: '#d32f2f',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '16px',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      {/* 重新生成按钮 */}
      <button
        onClick={generateRecipes}
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
          marginBottom: '16px',
          transition: 'all .3s cubic-bezier(.4,0,.2,1)',
          letterSpacing: '.5px'
        }}
      >
        🔄 重新推荐
      </button>

      {/* 菜谱列表 */}
      {recipes.length === 0 ? (
        <div style={{
          background: 'rgba(255,255,255,.72)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          color: '#999'
        }}>
          😢 没有合适的菜谱，试试调整食材或健康目标？
        </div>
      ) : (
        recipes.map((matched, index) => (
          <div key={index} style={{
            background: 'rgba(255,255,255,.78)',
            backdropFilter: 'blur(20px) saturate(160%)',
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '16px',
            border: '1px solid rgba(255,230,210,.4)',
            boxShadow: '0 6px 28px rgba(255,107,53,.08), 0 2px 6px rgba(0,0,0,.02), inset 0 1px 0 rgba(255,255,255,.6)'
          }}>
            {/* 菜谱头部 */}
            <div style={{
              padding: '18px',
              background: 'linear-gradient(135deg, rgba(255,248,240,.9) 0%, rgba(255,232,212,.9) 100%)',
              borderBottom: '1px solid rgba(240,232,224,.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,107,53,.05)'
              }} />
              <div style={{ fontSize: '10px', color: '#FF6B35', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px', textTransform: 'uppercase' }}>
                推荐 #{index + 1}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#2b2b2b' }}>
                {matched.recipe.name}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#777', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {matched.recipe.time}
                </span>
                <span style={{ fontSize: '12px', color: '#777', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={12} /> {matched.recipe.calories}
                </span>
                <span style={{ fontSize: '12px', color: '#777', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Utensils size={12} /> {matched.recipe.cookware}
                </span>
              </div>
            </div>

            {/* 食材清单 */}
            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(240,232,224,.4)' }}>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 700, marginBottom: '8px' }}>📋 食材清单</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {matched.recipe.recipe_items.map((item, i) => (
                  <span key={i} style={{
                    fontSize: '12px',
                    color: '#555',
                    background: 'rgba(255,248,240,.8)',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,220,200,.4)'
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 烹饪步骤 */}
            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(240,232,224,.4)' }}>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 700, marginBottom: '8px' }}>👨‍🍳 烹饪步骤</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matched.recipe.steps.map((step, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    fontSize: '13px',
                    color: '#444',
                    lineHeight: 1.6
                  }}>
                    <span style={{
                      flexShrink: 0,
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF6B35, #FF8B5E)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '1px'
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ flex: 1 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI推荐理由 */}
            <div style={{ padding: '16px 18px', background: 'rgba(240,249,247,.6)' }}>
              <div style={{ fontSize: '13px', color: '#1d6b63', lineHeight: 1.7, fontWeight: 500 }}>
                💡 <strong>AI 推荐理由：</strong>{matched.recipe.reason}
              </div>
            </div>
          </div>
        ))
      )}

      <div style={{
        textAlign: 'center',
        padding: '16px',
        color: '#bbb',
        fontSize: '11px',
        lineHeight: 1.8
      }}>
        💡 提示：AI 推荐基于你的个人档案 + 现有食材，仅供参考。<br />
        如有特殊健康状况请咨询专业医生。
      </div>
    </div>
  );
}
