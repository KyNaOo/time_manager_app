import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'front',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'http',
    cleartext: true, // This allows HTTP (non-HTTPS) requests
    allowNavigation: [
      'http://10.0.2.2:4000', // Allow navigation to your API running locally
    ]
  },
  // android: {
  //   allowMixedContent: true // This allows HTTP (non-HTTPS) requests
  // },
};


export default config;
