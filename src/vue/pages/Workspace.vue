<template>
    <div class="uk-section uk-section-default uk-padding-remove">
        <app-titlebar></app-titlebar>
        <div class="uk-grid-collapse" uk-grid>
            <div class="uk-width-expand">
                <app-canvas></app-canvas>
            </div>
            <div class="uk-width-medium">
                <app-sidebar></app-sidebar>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

import AppSidebar from '../partials/Sidebar.vue'
import AppCanvas from '../partials/Canvas.vue'
import AppTitlebar from '../partials/Titlebar.vue'

export default {
    computed: {

        ...mapGetters(['frame', 'label']),
        ...mapState(['frames', 'current'])
    },

    components: {
        AppSidebar,
        AppCanvas,
        AppTitlebar
    },

    mounted() {

    }
}
</script>

<style>

</style>
