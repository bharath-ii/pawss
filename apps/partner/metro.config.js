const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];
// 3. Force SINGLE copy of React & React Native using resolveRequest (true override).
//    This fixes "Invalid hook call / useEffect of null" in monorepos.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName === 'react-native' || moduleName === 'react-dom') {
    const resolved = path.resolve(projectRoot, 'node_modules', moduleName);
    return context.resolveRequest(
      { ...context, originModulePath: path.join(resolved, 'package.json') },
      moduleName,
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
