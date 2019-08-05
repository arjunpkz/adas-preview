import Vue from 'vue'
import Vuex from 'vuex'
import { Point } from 'paper';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        frames: null,
        dir: null,
        currentFrame: -1,
        currentLabel: -1,
        zoom: 1
    },

    getters: {
        frame(state) {
            
            if (state.frames) {
                return state.frames[state.currentFrame]
            }

            return undefined
        },

        label(state, getters) {

            if (getters.frame && state.currentLabel > -1) {

                return getters.frame.labels.find(l => l.id === state.currentLabel)

            }

            return null
        },

        scene(state, getters) {

            if (getters.frame) {
                return getters.frame.scene
            }

            return null
        }
    },

    mutations: {

        load(state, payload) {
            state.frames = payload.frames
            state.dir = payload.dir
            state.currentFrame = 0
        },

        changeFrame(state, payload) {
            state.currentFrame = Math.max(0, Math.min(state.frames.length-1, payload))
        },

        selectLabel(state, payload) {
            state.currentLabel = payload
        },

        zoom(state, payload) {

            if (payload !== 0) {
                state.zoom = payload
            }
        },

        offset(state, payload) {

            state.offset = payload
        }
    },

    actions: {

        load(context, payload) {
            context.commit('load', payload)
        },

        nextFrame(context) {
            context.dispatch('loadFrame', context.state.currentFrame + 1)
        },

        prevFrame(context) {
            context.dispatch('loadFrame', context.state.currentFrame - 1)
        },

        loadFrame(context, payload) {
            context.commit('changeFrame', payload)

            context.commit('selectLabel', -1)
        },

        nextLabel(context) {
            context.commit('selectLabel', context.state.currentLabel + 1)
        },

        prevLabel(context) {
            context.commit('selectLabel', context.state.currentLabel - 1)
        },

        selectLabel(context, payload) {
            context.commit('selectLabel', payload)
        },

        scrollBy(context, payload) {
            context.commit('offset', context.state.offset.add(payload))
        },

        zoom(context) {
            context.commit('zoom', payload)
        },

        zoomIn(context) {
            context.commit('zoom', context.state.zoom * 1.25)
        },

        zoomOut(context) {
            context.commit('zoom', context.state.zoom / 1.25)
        }
    }
})