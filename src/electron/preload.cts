import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeToResources: (callback: (statistic: any) => (void)) =>
        ipcOn('resourceUsage', (data: any) => {
            callback(data);
        }),
    getStatisticalData: () => ipcInvoke('statisticalData'),
} satisfies Window['electron']);

// electron.contextBridge.exposeInMainWorld('electron', {
//     subscribeToResources: (callback: (statistic: any) => (void)) => {
//         electron.ipcRenderer.on('statistic', (_:any, data: any) => {
//             callback(data);
//         });
//     },
//     getStatisticalData: () => electron.ipcRenderer.invoke('getStatisticalData'),
// } satisfies Window['electron']);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
     electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
}