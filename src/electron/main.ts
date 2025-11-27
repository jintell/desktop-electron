import {app, BrowserWindow, ipcMain } from "electron";
import path from "path";
// @ts-ignore
import {ipcMainHandler, isDev} from "./util.js";
// @ts-ignore
import { pollResources, getStatisticalData } from "./resourceManager.js";
import {getPreloadPath, getUIPath} from "./pathResolver.js";

app.on('ready', () => {
    const mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: getPreloadPath(),
        }
    })
    if(isDev()) {
        mainWin.loadURL('http://localhost:5173')
    }
    else mainWin.loadFile(getUIPath())

    pollResources(mainWin);
    ipcMainHandler('statisticalData', () => {
        return getStatisticalData();
    })
});




