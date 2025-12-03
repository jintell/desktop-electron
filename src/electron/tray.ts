import {BrowserWindow, Tray, Menu, app} from "electron";
import path from "path";
import {getAssetPath} from "./pathResolver.js";

export function createTray(mainWindow: BrowserWindow) {
    const tray = new Tray(path.join(getAssetPath(),
        process.platform === 'darwin' ? 'trayIconTemplate.png' : 'trayIcon.png'));

    tray.setToolTip('This is my application.');
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => mainWindow.show(),
        },
        {
            type: "separator"
        },
        {
            label: 'Quit',
            click: () => app.quit()
        }
        ]));
}