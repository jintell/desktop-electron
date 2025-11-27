import { useEffect, useState } from "react";

export const useStatistics = (dataPointCount: number) : ResourceUsage[] => {
    const [value, setValue] = useState<ResourceUsage[]>([]);
    useEffect(() => {
        const unsub = window.electron.subscribeToResources((data) => {
            setValue((prev) => {
                const newData = [...prev, data];
                return newData.slice(-dataPointCount);
            });
        });
        return unsub;
    }, []);
    return value
};