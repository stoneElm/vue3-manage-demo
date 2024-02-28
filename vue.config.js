const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,   // 未使用方法编译报错

  devServer: {
    client: {
      overlay: false    // 关闭遮罩
    }
  }
})
