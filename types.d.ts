
type ResourceUsage = {
    cpuUsage: number,
    memoryUsage: number,
    storageUsage: number,
}

type StatisticData = {
    totalStorage: number,
    cpuModel: string,
    totalMemInGb: number
}

type View = "CPU" | "MEMORY" | "STORAGE";

type FrameActionWindow = "CLOSE" | "MINIMIZE" | "MAXIMIZE";

type EventPayloadMapping = {
    resourceUsage: ResourceUsage,
    statisticalData: StatisticData,
    changeView: View,
    sendFrameAction: FrameActionWindow
}

type UnsubscribeFunction = () => void;

interface Window {
    electron: {
        subscribeToResources: (callback: (data: ResourceUsage) => void) => UnsubscribeFunction;
        getStatisticalData: () => Promise<StatisticData>;
        subscribeChangeView: (
            callback: (view: View) => void) => UnsubscribeFunction;
        sendFrameAction: (action: FrameActionWindow) => void;
    }
}