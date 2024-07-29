const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,   // 未使用方法编译报错

  devServer: {
    port: 8080,

    historyApiFallback: true,
    allowedHosts: "all",      // 允许任何主机访问或者['stoneelm.cn', '.stoneelm.cn']
    client: {
      overlay: false,         // 关闭遮罩
    }
  }
})
