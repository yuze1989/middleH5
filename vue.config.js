const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  publicPath: '/sh5/',
  outputDir: 'sh5',
  configureWebpack: {
    resolve: {
      alias: {
        static: '@/static',
        components: '@/components',
        views: '@/views',
        utils: '@/utils',
      },
    },
  },
  devServer: {
    proxy: {
      '/scrm': {
        target: 'https://test-scrm.juzhunshuyu.com/scrm',
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          '^/scrm': '',
        },
      },
    },
  },
  // eslint-disable-next-line no-dupe-keys
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      return {
        optimization: {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              sourceMap: true,
              terserOptions: {
                compress: {
                  drop_console: true,
                },
              },
            }),
          ],
        },
      };
    }
    return {};
  },
};
