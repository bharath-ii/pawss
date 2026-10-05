const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Force SINGLE copy of React & React Native using resolveRequest (true override).
//    extraNodeModules is only a fallback and won't override normal resolution.
//    This fixes "Invalid hook call / useEffect of null" in monorepos.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force single React/RN copy to prevent duplicate-React hooks crash
  if (moduleName === 'react' || moduleName === 'react-native' || moduleName === 'react-dom') {
    const resolved = path.resolve(projectRoot, 'node_modules', moduleName);
    return context.resolveRequest(
      { ...context, originModulePath: path.join(resolved, 'package.json') },
      moduleName,
      platform
    );
  }

  // Redirect google-signin to a safe mock in Expo Go —
  // the real package calls TurboModuleRegistry.getEnforcing() at module level,
  // which crashes before any JS try/catch can intercept it.
  if (moduleName === '@react-native-google-signin/google-signin') {
    return {
      filePath: path.resolve(projectRoot, 'src/mocks/google-signin-mock.js'),
      type: 'sourceFile',
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

