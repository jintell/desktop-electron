
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

type EventPayloadMapping = {
    resourceUsage: ResourceUsage,
    statisticalData: StatisticData
}

type UnsubscribeFunction = () => void;

interface Window {
    electron: {
        subscribeToResources: (callback: (data: ResourceUsage) => void) => UnsubscribeFunction;
        getStatisticalData: () => Promise<StatisticData>;
    }
}