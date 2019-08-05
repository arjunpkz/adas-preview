<template>
    <div class="uk-section uk-section-muted uk-padding-remove" id="sidebar">

        <div class="panel">
            <div class="panel-body">
                <div class="uk-flex uk-flex-middle uk-flex-around">
                    <button @click="prevFrame" class="uk-button uk-button-default">
                        <i class="uk-margin-small-right" uk-icon="arrow-left"></i>
                        Previous
                    </button>
                    <button @click="nextFrame" class="uk-button uk-button-default">
                        Next
                        <i class="uk-margin-small-right" uk-icon="arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>


        <div class="panel" v-if="scene">
            <h4 class="panel-title">
                <i class="icon" uk-icon="image"></i>
                Scene
            </h4>
            <div class="panel-body">
                <table class="uk-table uk-table-small uk-margin-remove">
                    <tr v-for="(value, key) in scene" :key="key">
                        <td>{{key}}</td>
                        <td>{{value}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="panel" v-if="label">
            <h4 class="panel-title">
                <i class="icon" uk-icon="tag"></i>
                Label Info
            </h4>
            <div class="panel-body">
                <table class="uk-table uk-table-small uk-margin-remove">
                    <tr>
                        <td>Trackid</td>
                        <td>{{label.id}}</td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td>{{label.category}}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="panel" v-if="label">
            <h4 class="panel-title">
                <i class="icon" uk-icon="paint-bucket"></i>
                Attributes
            </h4>
            <div class="panel-body">
                <table class="uk-table uk-table-small uk-margin-remove">
                    <tr v-for="(value, key) in label.attributes" :key="key">
                        <td>{{key}}</td>
                        <td>{{value.join(',')}}</td>
                    </tr>
                </table>
            </div>
        </div>

    </div>
</template>

<script>

import {mapGetters} from 'vuex'

export default {
    computed: {
        ...mapGetters(['scene', 'label', 'frame']),
        
        frames () {

            return this.$store.state.frames.map(f => f.name)
        }
    },
    methods: {
        nextFrame() {
            this.$store.dispatch('nextFrame')
        },

        prevFrame() {
            this.$store.dispatch('prevFrame')
        }
    }
}
</script>

<style lang="scss">

    #sidebar {
        border-left: 1px solid rgba(0,0,0,0.2);
        height: 100%;
    }
    
    .panel {

        .panel-title {
            font-size: 1.2rem;
            font-weight: 500;
            padding: 0.5rem;
            border-bottom: 1px solid rgba(0,0,0,0.2);
            margin: 0;

            .icon {
                margin-right: 0.5rem;
            }
        }

        .panel-body {
            padding: 0.5rem;
        }

        border-bottom: 1px solid rgba(0,0,0,0.2);
    }

    table {

        tr {
            &:nth-child(n+2) {
                border-top: 1px solid rgba(0,0,0,0.1);
            }

            td {
                font-size: 0.85rem;
                padding: 0.5rem !important;

                &:first-child {
                    font-weight: 500;
                }

                &:nth-child(2) {
                    &:before {
                        content: ':';
                        margin-right: 0.2rem;
                    }
                }
            }
        }
    }
</style>
