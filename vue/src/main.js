import { createApp } from 'vue'
import './style.css'

import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router.js'

const app = createApp(App)
app.use(router)//使用路由
app.use(ElementPlus) // 使用 Element Plus
app.mount('#app') // 挂载根组件到 #app


