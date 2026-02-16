import appJson from './app.json';

export default ({ config }) => ({
  ...config,
  ...appJson.expo,
  web: {
    ...(appJson.expo?.web ?? {}),
    ...(config.web ?? {}),
    basePath: process.env.EXPO_PUBLIC_BASE_PATH || '/react-native-ait',
  },
  experiments: {
    ...(appJson.expo?.experiments ?? {}),
    ...(config.experiments ?? {}),
    baseUrl: process.env.EXPO_PUBLIC_BASE_PATH || '/react-native-ait',
  },
  extra: {
    ...(appJson.expo?.extra ?? {}),
    ...(config.extra ?? {}),
    basePath: process.env.EXPO_PUBLIC_BASE_PATH || '/react-native-ait',
  },
});
