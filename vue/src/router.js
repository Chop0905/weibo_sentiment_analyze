import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Analysis from './views/Analysis.vue'

const router = createRouter({
    history: createWebHashHistory(),
    base: '/sentiment-analysis/', // 设置基础 URL
    routes: [
        {
            path: '/', // 设置默认路由为 '/home'
            redirect: '/home'
        },
        {
            path: '/home',
            name: 'Home',
            component: Home
        },
        {
            path: '/analysis/:id',
            name: 'Analysis',
            component: Analysis
        }
    ]
})

export default router
