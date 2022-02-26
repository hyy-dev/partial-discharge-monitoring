// https://umijs.org/config/
import { defineConfig } from 'umi';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

// 分包
const chunkCacheGroups = {
  react: {
    name: "react",
    test: /[\\/]node_modules[\\/](react)[\\/]/,
    priority: -9,
    enforce: true,
  },
  reactDom: {
    name: "react-dom",
    test: /[\\/]node_modules[\\/](react-dom)[\\/]/,
    priority: -9,
    enforce: true,
  },
  antd: {
    name: "antd",
    test: /[\\/]node_modules[\\/](@ant-design|antd|antd-mobile)[\\/]/,
    priority: -10,
    enforce: true,
  },
  '@antv': {
    name: '@antv',
    test: /[\\/]node_modules[\\/](@antv)[\\/]/,
    priority: -11,
    enforce: true,
  },
  vendors: {
    name: "vendors",
    test: /[\\/]node_modules[\\/]/,
    priority: -12,
    enforce: true,
  }
}

// chunk-name
const getSplitChunks = () => {
  const chunks = Object.values(chunkCacheGroups);
  const chunkBundles: string[] = [];
  chunks.map((chunk, key) => {
    chunkBundles[key] = chunk.name;
  });
  return chunkBundles;
};

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  exportStatic: {},

  chunks: REACT_APP_ENV !== 'dev' ? [...getSplitChunks(), 'umi'] : undefined,
  chainWebpack: REACT_APP_ENV !== 'dev' ? function(config, { webpack }) {
    // if (REACT_APP_ENV === 'dev') return;
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all', // async 不会打包静态引用的文件
          minSize: 30000, // 30000 大于这个值的文件会被提取成单独文件
          // maxSize: 50000,
          minChunks: 3, // 最少使用次数
          automaticNameDelimiter: '.',
          cacheGroups: chunkCacheGroups,
        },
      },
    });
  }:undefined,
});
