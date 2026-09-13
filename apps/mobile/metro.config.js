const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

const mobileReact = path.resolve(projectRoot, 'node_modules/react');
const mobileReactDom = path.resolve(projectRoot, 'node_modules/react-dom');
const rootReact = path.resolve(workspaceRoot, 'node_modules/react');
const rootReactDom = path.resolve(workspaceRoot, 'node_modules/react-dom');

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Block root React 19 from ever being bundled into the Expo app
config.resolver.blockList = [
  new RegExp(`^${rootReact.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`),
  new RegExp(`^${rootReactDom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`),
];

config.resolver.extraNodeModules = {
  react: mobileReact,
  'react-dom': mobileReactDom,
};

module.exports = config;
