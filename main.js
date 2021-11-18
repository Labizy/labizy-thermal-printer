const { app, BrowserWindow } = require('electron')

var exec = require("child_process").exec;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 400,
        height: 300
    })

    win.loadFile('client.html')


    // exec("node server");

    const cmd = "node server.js"

    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.log("err", err)
            return;
        }
        console.log(stdout)
    })



}


app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})