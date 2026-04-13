import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.infinity.app',
  appName: 'Infinity',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
