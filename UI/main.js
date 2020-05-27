const electron = require("electron"); 
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path')
const url = require('url')


let win

const createWindow = () => {

    //add student window


    //create browser window
    win = new BrowserWindow({
        center: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            show: false
        },
        width: 900,
        height: 600,
    });

    //load url (index.html)
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }));

    // set win var to null, when win is closed
    win.on('closed', () => {
        win = null;
        //add_win.close()
    })

    // show window when all file are loaded, and ready to show
    win.once('ready-to-show', () => {
        win.show()
    });

}

// create window when app is ready
app.on("ready", function () {
    createWindow()
});

// quit app when all windows are closed
app.on("window-all-closed", ()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on("activate", ()=>{
    if(win===null){
        createWindow()
    }
})