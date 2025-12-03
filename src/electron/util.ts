import { ipcMain } from 'electron';
import type { WebContents, WebFrameMain } from 'electron';
// @ts-ignore
// import {getUIPath} from './pathResolver.js';
// import {fileURLToPath as pathToFileUrl} from 'url';

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

/**
 * Register an IPC main handler for a specific event key
 * @param key - The event key to handle
 * @param handler - The handler functions to execute when the event is triggered
 */
export function ipcMainHandler<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: () => EventPayloadMapping[Key]): any {
    ipcMain.handle(key, (event) => {
        // @ts-ignore
        validateEventFrame(event.senderFrame);
        return handler();
    })
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: (payload: EventPayloadMapping[Key]) => void) {
    ipcMain.on(key, (event, payload) => {
        // @ts-ignore
        validateEventFrame(event.senderFrame);
        return handler(payload);
    })
}

/**
 * Send a message to a specific WebContents with a given payload
 * @param key - The event key to send
 * @param webContents - The WebContents instance to send the message to
 * @param payload - The payload to send with the event
 */
export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]): any {
    webContents.send(key, payload);
}

function validateEventFrame(frame: WebFrameMain) {
    if(!frame) throw new Error('WebFrameMain cannot be null or undefined');
    if (isDev() && new URL(frame.url).host === 'localhost:5173') {
        return;
    }
    // if(frame.url !== pathToFileUrl(getUIPath()).toString()) throw new Error(
    //     'Only valid host is allowed to be loaded in the renderer process'
    // )
}