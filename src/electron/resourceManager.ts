import osUtils from 'os-utils';
import os from 'os';
import fs from 'fs';
import {BrowserWindow} from 'electron';
import {ipcWebContentsSend} from './util.js';

const POLL_INTERVAL = 500;

export const pollResources = (mainWindow: BrowserWindow) => {
    setInterval(async () => {
        const cpuUsage = await getCpuUsage();
        const memoryUsage = getMemoryUsage();
        const disk = getDiskUsage();
        // Communicate with the bowser window
        ipcWebContentsSend('resourceUsage', mainWindow.webContents, { memoryUsage, cpuUsage, storageUsage: disk.usage });
        // mainWindow.webContents.send('statistic', {memoryUsage, cpuUsage, storageUsage: disk.usage});
    }, POLL_INTERVAL);
};

export const getStatisticalData = () : {totalStorage: number, cpuModel: string, totalMemInGb: number} => {
    const totalStorage = getDiskUsage().total;
    const cpuModel = os.cpus()[0].model;
    const totalMemInGb = Math.floor(osUtils.totalmem() / 1024);
    return {
        totalStorage,
        cpuModel,
        totalMemInGb
    };
};

const getCpuUsage = () : Promise<number> => {
    return new Promise(resolve => {
        osUtils.cpuUsage(resolve);
    });
    // osUtils.cpuUsage((percent) => console.log(percent));
};

function getMemoryUsage(): number {
    return 1 - osUtils.freememPercentage();
}

function getDiskUsage() :  {total: number, usage: number} {
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C:\\' : '/');
    const total = stats.blocks * stats.bsize;
    const free = stats.bfree * stats.bsize;

    return {
        total: Math.floor(total / 1_000_000_000),
        usage: 1 - free / total
    };
}