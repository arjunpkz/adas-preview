import Vue from 'vue'

// import uikit
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

UIkit.use(Icons)
window.UIkit = UIkit

import store from './store'
import router from './router'

import Components from './vue/components'
import FileService from './services/file'

Vue.use(Components)

Vue.use(FileService)
const fs = new FileService.FileReader()

// Main App
import App from './vue/App.vue'

const app = new Vue({
    store,
    router,
    fs,
    render: h => h(App),
}).$mount('#app')