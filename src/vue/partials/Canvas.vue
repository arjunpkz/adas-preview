<template>
    <div id="canvas-wrapper">
        <canvas ref="canvas" id="canvas" resize></canvas>
    </div>
</template>

<script>

import {mapGetters, mapState} from 'vuex'
import {PaperScope, Raster, Point, Layer, Path, Color, Tool} from 'paper'

import createTool from '../../tool'

export default {
    computed: {
        ...mapGetters(['frame']),
        ...mapState(['currentFrame', 'currentLabel', 'dir', 'zoom', 'offset'])
    },

    watch: {

        currentFrame() {

            console.log(this.currentFrame)

            this.refresh()
        },

        currentLabel() {

            this.redraw()
        },

        zoom() {
            if (this.scope) {
                this.scope.view.zoom = this.zoom
                this.redraw()
            }
        }
    },

    data() {
        return {
            scope: null,
            imageLayer: null,
            artLayer: null,
            colors: {},
            tool: null
        }
    },

    methods: {

        draw() {

            if (this.frame) {

                // console.log(this.frame.labels)

                for (let label of this.frame.labels) {

                    let path;

                    if (label.shape.type === 'Box') {

                        path = this.drawBox(label.shape)
                    }

                    else if (label.shape.type === 'Polyline') {

                        path = this.drawLine(label.shape)

                        
                    }

                    path.data.id = label.id

                    if (!this.colors[label.category]) {
                        this.colors[label.category] = Color.random()
                    }

                    const strokeColor = this.colors[label.category]
                    const fillColor = new Color(strokeColor)
                    fillColor.alpha = 0.1

                    path.style = {
                        strokeWidth: 1 * 1/this.zoom,
                        strokeColor,
                        selectedColor: strokeColor
                    }

                    if (label.shape.type !== 'Polyline') path.fillColor = fillColor

                    if (this.currentLabel === label.id) path.selected = true
                }
            }

        },

        drawBox(shape) {

            const topLeft = new Point(shape.x[0], shape.y[0])

            const bottomRight = new Point(shape.x[2], shape.y[2])

            const rect = new Path.Rectangle(topLeft, bottomRight)

            return rect
        },

        drawLine(shape) {

            const line = new Path()

            for (let i=0; i<shape.x.length; i++) {

                line.add(new Point(shape.x[i], shape.y[i]))

            }

            return line
        },

        clear() {

            if (this.artLayer) {
                this.artLayer.removeChildren()
            }

        },

        redraw() {

            this.clear()

            this.draw()

        },

        async refresh() {

            await this.loadImage()

            this.redraw()
        },

        loadImage() {

            return new Promise(
                (res, rej) => {

                    if (this.frame && this.dir) {

                        // activate image layer
                        this.imageLayer.activate()

                        this.imageLayer.removeChildren()

                        // const data = await this.$fs.read(this.dir, this.frame.name)

                        // const file = new File(data, this.frame.name)

                        const image = this.$fs.path.join(this.dir, this.frame.name)

                        const raster = new Raster(image)

                        raster.onLoad = () => {

                            raster.bounds.topLeft = new Point(0,0)

                            // move view
                            const diff = raster.position.subtract(this.scope.view.center)

                            this.scope.view.scrollBy(diff)

                            // resolve promise
                            res()

                        }

                        raster.onError = (err) => {
                            rej(err)
                        }

                        // reactivate art layer
                        this.artLayer.activate()
                    }
                }
            )

        }
    },

    async mounted() {
        
        this.scope = new PaperScope()

        this.scope.setup(this.$refs.canvas)

        this.imageLayer = new Layer()
        this.imageLayer.locked = true

        this.artLayer = new Layer()

        await this.refresh()

        // create tool
        this.tool = createTool(this.$store, this.scope.view)

        // create zoom
        window.onmousewheel = (e) => {
            
            // zoom out
            if (e.deltaY > 0) {
                this.$store.dispatch('zoomOut')
            }

            // zoom in
            else {
                this.$store.dispatch('zoomIn')
            }
        }
    }
}
</script>

<style>
    #canvas-wrapper {
        height: calc(100vh - 50px);
        overflow: auto;
    }

    canvas {
        width: 100%;
        height: 100%;
        min-width: 500px;
        cursor: none;
    }
</style>
