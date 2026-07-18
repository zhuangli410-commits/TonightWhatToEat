import React, { useState, useEffect } from 'react';
import { User, ChefHat, Sparkles, Settings } from 'lucide-react';
import ProfilePage from './pages/ProfilePage';
import FoodPage from './pages/FoodPage';
import ResultPage from './pages/ResultPage';
import SettingsPage from './pages/SettingsPage';
import { getProfile, saveProfile, getIngredients, saveIngredients, getApiConfig, saveApiConfig, UserProfile, ApiConfig } from './utils/storage';

export type PageType = 'profile' | 'food' | 'result' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({ provider: 'local', key: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [p, i, a] = await Promise.all([
        getProfile(),
        getIngredients(),
        getApiConfig()
      ]);
      setProfile(p);
      setIngredients(i);
      setApiConfig(a);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    await saveProfile(newProfile);
  };

  const updateIngredients = async (newIngredients: string[]) => {
    setIngredients(newIngredients);
    await saveIngredients(newIngredients);
  };

  const updateApiConfig = async (newConfig: ApiConfig) => {
    setApiConfig(newConfig);
    await saveApiConfig(newConfig);
  };

  if (loading || !profile) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(165deg, #FFF5EE 0%, #FFF0E5 30%, #F8F0FA 70%, #F0F7FA 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍜</div>
          <div style={{ color: '#888', fontSize: '14px' }}>加载中...</div>
        </div>
      </div>
    );
  }

  const navItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: '档案', icon: <User size={22} /> },
    { id: 'food', label: '食材', icon: <ChefHat size={22} /> },
    { id: 'result', label: '推荐', icon: <Sparkles size={22} /> },
    { id: 'settings', label: '设置', icon: <Settings size={22} /> },
  ];

  return (
    <div style={{
      maxWidth: '520px',
      margin: '0 auto',
      minHeight: '100vh',
      paddingBottom: '80px',
      position: 'relative'
    }}>
      <div style={{ padding: '0 18px' }}>
        {currentPage === 'profile' && (
          <ProfilePage profile={profile} onUpdate={updateProfile} />
        )}
        {currentPage === 'food' && (
          <FoodPage 
            ingredients={ingredients} 
            onUpdate={updateIngredients}
            apiConfig={apiConfig}
          />
        )}
        {currentPage === 'result' && (
          <ResultPage 
            profile={profile} 
            ingredients={ingredients}
            apiConfig={apiConfig}
          />
        )}
        {currentPage === 'settings' && (
          <SettingsPage apiConfig={apiConfig} onUpdate={updateApiConfig} />
        )}
      </div>

      {/* 底部导航 */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '520px',
        margin: '0 auto',
        background: 'rgba(255,255,255,.82)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(0,0,0,.04)',
        display: 'flex',
        padding: '8px 12px 14px',
        boxShadow: '0 -4px 24px rgba(0,0,0,.04)',
        zIndex: 100
      }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '8px 0',
              cursor: 'pointer',
              color: currentPage === item.id ? '#FF6B35' : '#b0b0b0',
              fontSize: '11px',
              fontWeight: 600,
              transition: 'all .25s cubic-bezier(.4,0,.2,1)',
              borderRadius: '14px',
              position: 'relative',
              background: currentPage === item.id ? 'rgba(255,107,53,.08)' : 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span style={{
              display: 'inline-flex',
              transform: currentPage === item.id ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform .25s cubic-bezier(.4,0,.2,1)'
            }}>
              {item.icon}
            </span>
            {item.label}
            {currentPage === item.id && (
              <span style={{
                position: 'absolute',
                bottom: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '3px',
                borderRadius: '2px',
                background: 'linear-gradient(90deg, #FF6B35, #FF8850)'
              }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
