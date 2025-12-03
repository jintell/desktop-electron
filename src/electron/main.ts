import {app, BrowserWindow } from "electron";
// @ts-ignore
import {ipcMainHandler, ipcMainOn, isDev} from "./util.js";
// @ts-ignore
import { pollResources, getStatisticalData } from "./resourceManager.js";
import {getPreloadPath, getUIPath} from "./pathResolver.js";
import {createTray} from "./tray.js";
import {createMenu} from "./menu.js";

app.on('ready', () => {
    const mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: getPreloadPath(),
        },
        frame: false
    })
    if(isDev()) {
        mainWin.loadURL('http://localhost:5173')
    }
    else mainWin.loadFile(getUIPath())

    pollResources(mainWin);
    ipcMainHandler('statisticalData', () => {
        return getStatisticalData();
    })

    ipcMainOn("sendFrameAction", (action) => {
        switch (action) {
            case 'CLOSE':
                mainWin.close();
            break;
            case 'MINIMIZE':
                mainWin.minimize();
                break;
            case 'MAXIMIZE':
                mainWin.isMaximized() ? mainWin.unmaximize() : mainWin.maximize();
        }
    })

    createTray(mainWin);
    handleCloseEvent(mainWin);
    createMenu(mainWin);
});

function handleCloseEvent(mainWindow: BrowserWindow) {
    let willClose: boolean = false;

    mainWindow.on('close', (event) => {
        if(willClose) return;
        event.preventDefault();
        mainWindow.hide();
        if(app.dock) app.dock.hide();
    });

    mainWindow.on('show', () => {
        if(app.dock) app.dock.show();
        willClose = false;
    });

    app.on('window-all-closed', () => {
        if(!willClose) app.quit();
    });

    app.on('before-quit', () => {
       willClose = true;
    });
}



