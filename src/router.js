import Vue from 'vue'
import Router from 'vue-router'

// route components
import HomePage from './vue/pages/Home.vue'
import WorkspacePage from './vue/pages/Workspace.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: HomePage
        },
        {
            path: '/workspace',
            name: 'workspace',
            component: WorkspacePage
        },
        {
            path: '',
            redirect: {name: 'home'}
        }
    ]
})

export default router