import { createApp } from 'vue'
import App from './App.vue'

// 引入ElementPlus组件
import ElementPlus from 'element-plus'
// 引入ElementPlus样式
import 'element-plus/dist/index.css'

// 引入路由的配置
import router from "./router/index.js";

const app = createApp(App);

// 加载ElementPlus
app.use(ElementPlus)

// 加载路由
app.use(router);

app.mount('#app')
