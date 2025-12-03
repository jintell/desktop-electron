import { BaseChart } from './BaseChart';
import { useMemo } from 'react';

type ChartProps = {
    data: number[];
    maxDataPoints: number;
    selectedView: "CPU" | "MEMORY" | "STORAGE";
};

export const COLOR_MAP = {
    CPU: {
       fill: '#5DD4EE',
       stroke: '#0A4D5C'
    },
    MEMORY: {
        fill: '#E99311',
        stroke: '#5F3C07'
    },
    STORAGE: {
        fill: '#1ACF4D',
        stroke: '#0B5B22'
    }
};

export const Charts = (props: ChartProps) => {
    const color= useMemo(() => COLOR_MAP[props.selectedView], [props.selectedView]);
    const preparedData = useMemo(() => {
        const points = props.data.map(point => ({ value: point * 100 }));
        return [...points, ...points.slice(0, props.maxDataPoints - points.length)];
    }, [props.data, props.maxDataPoints]);
    return <BaseChart data={preparedData} fill={color.fill} stroke={color.stroke} />;
}