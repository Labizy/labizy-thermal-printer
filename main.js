

const { app, BrowserWindow, Tray, nativeImage, Menu, ipcMain } = require('electron')
const path = require("path");
const pkg = require("./package.json")
var server = require("./server");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 580,
        height: 420,
        backgroundColor: "#1e293b",
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: __dirname + '/preload.js'
        },
        icon: path.join(__dirname, "icon.ico")
    })
    win.setMenu(null)
    win.removeMenu()
    win.setMenuBarVisibility(false)
    win.loadFile('client.html')
    win.on('minimize', function (event) {
        event.preventDefault();
        win.hide();
    });
    win.on('close', function (event) {
        event.preventDefault();
        win.hide();
    });

    win.on('restore', function () {
        win.show();
    });

    win.on('ready-to-show', function () {
        win.show();
        win.focus();
    });

    const icon = nativeImage.createFromPath(path.join(__dirname, "icon.ico"))
    
    const tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quitter',
            type: 'normal',
            click: () => {
                app.isQuitting = true;
                app.quit();
                app.exit(0);

            }
        },
    ])

    tray.setContextMenu(contextMenu)

    tray.setToolTip(`${pkg.description}`)
    tray.setTitle(`${pkg.description}`)

    tray.on('click', () => {
        win.show();
    });

    ipcMain.on('open-devtools', (event) => {
        console.log("clikkkk")
        if (win) {
            win.webContents.openDevTools();
        }
    });

}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
app.on('before-quit', function () {
    app.isQuitting = true;
});



app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

