<template>
    <div class="uk-flex uk-flex-middle uk-flex-center" uk-height-viewport>
        
        <form @submit.prevent="load" class="uk-card uk-card-default uk-width-1-1 uk-width-1-2@m">
            <div class="uk-card-header">
                <h3 class="uk-card-title">Load Project</h3>
            </div>
            <div class="uk-card-body">

                <div class="uk-margin">
                    <file-input v-model="dir" class="uk-width-1-1" :properties="['openDirectory']" placeholder="Select input folder"></file-input>
                </div>

                <div class="uk-margin">
                    <file-input v-model="object" class="uk-width-1-1" :properties="['openFile']" :filters="[jsonFilter]" placeholder="Select object labels"></file-input>
                </div>

                <div class="uk-margin">
                    <file-input v-model="scene" class="uk-width-1-1" :properties="['openFile']" :filters="[jsonFilter]" placeholder="Select scene labels"></file-input>
                </div>

                <div class="uk-margin">
                    <label class="uk-form-label">Image type</label>
                    <select v-model="type" class="uk-select" placeholder="Select image type">
                        <option value="jpg">JPG Files (*.jpg)</option>
                        <option value="jpeg">JPEG Files (*.jpeg)</option>
                        <option value="png">PNG Files (*.png)</option>
                        <option value="bmp">Bitmap Files (*.bmp)</option>
                    </select>
                </div>

                <div class="uk-margin uk-text-center">
                    <button :disabled="!valid" type="submit" class="uk-button uk-button-primary">
                        Load
                        <span class="uk-margin-left">
                            <div uk-spinner="ratio: 0.4" v-if="loading"></div>
                            <i uk-icon="arrow-right" v-else></i>
                        </span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            jsonFilter: {
                name: 'JSON output file',
                extensions: ['json']
            },
            type: 'jpg',
            loading: false,
            dir: null,
            object: null,
            scene: null
        }
    },

    computed: {
        valid() {
            return this.dir && this.object && this.scene
        }
    },  

    methods: {

        async load() {

            // console.log(this.dir, this.object, this.scene)

            this.loading = true
            
            if (window.require && window.require('electron')) {
                
                const ipc = window.require('electron').ipcRenderer

                ipc.once('load:response', (e, res) => {

                    if (res.success) {

                        this.$store.dispatch('load', {
                            dir: this.dir,
                            frames: res.data
                        })

                        this.$router.replace({name: 'workspace'})
                    }

                    else if (res.error) {
                        throw res.error
                    }

                    else {
                        throw 'An unknown error occured'
                    }

                })

                ipc.send('load', {
                    dir: this.dir,
                    object: this.object,
                    scene: this.scene,
                    type: this.type
                })

            }

            else {
                console.warn('Couldn\'t connect to electron')
            }

            this.loading = false
        }
    }
}
</script>

<style>

</style>
