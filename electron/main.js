const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

const {loadProject} = require('./helpers')

let win = null;

function createWindow() {

    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, '../public/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.webContents.openDevTools()

    win.setMenu(null)

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('activate', () => {

    if (!win) {
        createWindow()
    }
})


/*
 |-------------------------------------------------------------------------------------
 | IPC Listeners
 |-------------------------------------------------------------------------------------
*/

ipcMain.on('load', async (event, payload) => {
    
    const {dir, object, scene, type} = payload

    console.log(payload)

    try {

        const data = await loadProject(dir, object, scene, type)

        win.webContents.send('load:response', {success: true, data})

    }

    catch (error) {

        win.webContents.send('load:response', {success: false, error})
    }
    
})