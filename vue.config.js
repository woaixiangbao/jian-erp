module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  devServer: {
    port: 9527,
    open: process.platform === 'darwin',
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/': '',
        },
      },
    },
  },
  productionSourceMap: true,
};
