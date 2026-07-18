import { Preferences } from '@capacitor/preferences';

export interface UserProfile {
  height: number;
  weight: number;
  goals: string[];
  conditions: string[];
  kitchen: string[];
  customGoals: string[];
  customConditions: string[];
  customKitchen: string[];
}

export interface ApiConfig {
  provider: string;
  key: string;
  endpoint?: string;
}

const defaultProfile: UserProfile = {
  height: 170,
  weight: 65,
  goals: [],
  conditions: [],
  kitchen: [],
  customGoals: [],
  customConditions: [],
  customKitchen: []
};

export async function getProfile(): Promise<UserProfile> {
  try {
    const { value } = await Preferences.get({ key: 'profile_v3' });
    if (value) {
      return { ...defaultProfile, ...JSON.parse(value) };
    }
  } catch (e) {
    console.error('Failed to load profile:', e);
  }
  return { ...defaultProfile };
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  try {
    await Preferences.set({ key: 'profile_v3', value: JSON.stringify(profile) });
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export async function getIngredients(): Promise<string[]> {
  try {
    const { value } = await Preferences.get({ key: 'ingredients_v3' });
    if (value) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.error('Failed to load ingredients:', e);
  }
  return [];
}

export async function saveIngredients(ingredients: string[]): Promise<void> {
  try {
    await Preferences.set({ key: 'ingredients_v3', value: JSON.stringify(ingredients) });
  } catch (e) {
    console.error('Failed to save ingredients:', e);
  }
}

export async function getApiConfig(): Promise<ApiConfig> {
  try {
    const { value } = await Preferences.get({ key: 'api_config_v3' });
    if (value) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.error('Failed to load API config:', e);
  }
  return { provider: 'local', key: '' };
}

export async function saveApiConfig(config: ApiConfig): Promise<void> {
  try {
    await Preferences.set({ key: 'api_config_v3', value: JSON.stringify(config) });
  } catch (e) {
    console.error('Failed to save API config:', e);
  }
}
