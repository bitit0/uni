import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        name: 'Home',
        path: '/',
        component: () => import('../views/Home.vue')
    },
    {
        name: 'Predict',
        path: '/predict',
        component: () => import('../views/Predict.vue')
    },
    {
        name: 'About',
        path: '/about',
        component: () => import('../views/About.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router