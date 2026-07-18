import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tonightwhattoeat.app',
  appName: '今晚吃什么',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      allowEditing: false,
      resultType: 'base64',
      saveToGallery: false
    }
  }
};

export default config;
