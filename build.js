const packager = require('electron-packager')

async function bundle() {

    const appPaths = await packager({
        dir: './',
        arch: "x64",
        out: '../release-builds',
        ignore: [
            '^/src/'
        ],
        platform: 'win32',
        arch: 'x64',
        overwrite: true
    })
}