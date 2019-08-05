<template>
    <div id="titlebar" class="uk-section uk-section-muted uk-padding-small">
        <div class="uk-logo">
            {{frame.name}}
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters(['frame'])
    }
}
</script>

<style>
    #titlebar {
        box-sizing: border-box;
        height: 50px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(0,0,0,0.3);
        border-top: 1px solid rgba(0,0,0,0.3);
    }
</style>
