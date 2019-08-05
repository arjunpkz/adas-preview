const {BrowserWindow} = require('electron')

const fs = require('fs')
const path = require('path')

/**
 * Read json from a file
 * @param {string} filepath path to the json file
 */
async function readJson(filepath) {

    if (fs.existsSync(filepath)) {

        const data = await fs.promises.readFile(filepath)

        return JSON.parse(data.toString())
    }

    return null

}



/**
 * Process the input object label json
 * @param {any} labels output labels
 * @returns {any[]} frames
 */
function processObjectLabels(labels) {
    
    const channels = labels.Sequence[0].Labels[0].Devices[0].Channels

    const frames = []

    for (let channel of channels) {

        const cframes = channel.ObjectLabels.map(frame => {

            return {
                id: frame.FrameNumber,
                timestamp: frame.TimeStamp.toString(),
                labels: frame.FrameObjectLabels.map(label => {

                    return {
                        category: label.category,
                        id: label.Trackid,
                        attributes: label.attributes,
                        image: {
                            name: label.imagename,
                            height: label.imageheight,
                            width: label.imagewidth
                        },
                        shape: {
                            type: label.shape.type,
                            x: label.shape.x,
                            y: label.shape.y,
                            z: label.shape.z
                        },
                        keypoints: label.keypoints
                    }
                })
            }
        })

        console.log(`Channel Frames:`, cframes.length)

        frames.push(...cframes)

    }

    return frames

}

/**
 * Process scene labels
 * @param {any} labels output scene labels
 * @returns {{[key:string]: any}} frames
 */
function processSceneLabels(labels) {

    const channels = labels.Sequence[0].Labels[0].Devices[0].Channels

    const frames = {}

    for (let channel of channels) {

        const scene = channel.SceneLabels

        for (let attr in scene) {

            for (let frame of scene[attr]) {

                if (!frames[frame.endtimestamp]) {

                    frames[frame.endtimestamp] = {
                        [attr] : frame.value
                    }
                }

                else {

                    frames[frame.endtimestamp][attr] = frame.value
                }
            }
        }
    }

    console.log(frames)

    return frames
}

/**
 * @typedef {Object} Frame
 * @property {number} id
 * @property {string} timestamp
 * @property {string} name
 * @property {any[]} labels
 * @property {any} scene 
 */

/**
 * Load project
 * @param {string} dir image directory path
 * @param {string} object object label json file path
 * @param {string} scene scene label json file path
 * @param {string} type type of the input file jpg, jpeg, png or bmp
 * @returns {Promise<Frame[]>} Promise resolving to frames
 */
async function loadProject(dir, object, scene, type) {

    try {

        if (!fs.existsSync(dir)) {

            throw 'Input folder does not exist'
        }

        if (!fs.existsSync(object)) {
            throw 'Object label json does not exist'
        }

        if (!fs.existsSync(scene)) {
            throw 'Scene label json does not exist'
        }

        const files = await fs.promises.readdir(dir)

        if (!files.length) {

            throw 'Input folder does not contain any images'
        }

        // process object labels
        const objectJson = processObjectLabels(await readJson(object))

        // process scene labels
        const sceneJson = processSceneLabels(await readJson(scene))

        // combine object and scene and image
        const frames = objectJson.map(frame => {

            return {
                ...frame,
                name: `${frame.timestamp}.${type}`,
                scene: sceneJson[frame.timestamp]
            }
        })

        return frames

    }

    catch (err) {

        throw err
    }
}

module.exports = {
    readJson,
    processObjectLabels,
    processSceneLabels,
    loadProject
}