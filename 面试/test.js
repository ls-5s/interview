devServer: {
  proxy: {
    '/api': {
      target: 'http://后端真实地址:端口', // 目标后端地址
      changeOrigin: true, // 伪装请求来源
      pathRewrite: { '^/api': '' } // 去掉请求路径里的/api
    }
  }
}