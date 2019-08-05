<template>
    <div class="uk-inline">
        <a class="uk-form-icon uk-form-icon-flip" @click="open" uk-icon="icon: folder"></a>
        <input type="text" :value="path_value" class="uk-input" :placeholder="placeholder" readonly>
    </div>
</template>

<script>

export default {
    props: ['value', 'placeholder', 'properties', 'filters', 'title'],
    data() {
        return {
            filepath: ''
        }
    },
    watch: {
        value() {
            this.value = this.filepath
        },

        filepath() {

            if (this.value !== this.filepath) {
                this.$emit('input', this.filepath)
            }
        }
    },
    computed: {
        path_value() {

            if (this.filepath) {
                
                if (this.filepath.length > 50) {
                    return '...' + this.filepath.substr(-47)
                }

                return this.filepath
            }

            return ''
        }
    },
    methods: {
        open() {

            if (window.require && window.require('electron')) {

                const {dialog} = window.require('electron').remote

                const filepaths = dialog.showOpenDialogSync({
                    properties: this.properties || ['openFile'],
                    filters: this.filters || [],
                    title: this.title || 'Select files',
                    buttonLabel: 'Open'
                })

                if (filepaths) this.filepath = filepaths[0]

            }
        }
    }
}
</script>

<style>

</style>
