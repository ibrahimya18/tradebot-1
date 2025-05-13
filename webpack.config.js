module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://api.mexc.com',  
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
        },
      },
    },
  };
  