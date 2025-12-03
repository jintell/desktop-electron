import {BrowserWindow, Menu} from "electron";
import {ipcWebContentsSend} from "./util.js";
// import {isDev} from "./util.js";

export function createMenu(mainWindow: BrowserWindow) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: process.platform === 'darwin' ? undefined : 'App',
            type: 'submenu',
            submenu: [
                {
                    label: 'Quit',
                    role: 'quit'
                },
                { type: 'separator' },
                {
                    label: 'Developer Tools',
                    role: 'toggleDevTools',
                    click: () => mainWindow.webContents.toggleDevTools(),
                    // visible: isDev()
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'CPU Usage',
                    click: () => ipcWebContentsSend('changeView', mainWindow.webContents, "CPU")
                },
                {
                    label: 'RAM Usage',
                    click: () => ipcWebContentsSend('changeView', mainWindow.webContents, "MEMORY")
                },
                {
                    label: 'Storage Usage',
                    click: () => ipcWebContentsSend('changeView', mainWindow.webContents, "STORAGE")
                },
            ]
        },
    ]));
}