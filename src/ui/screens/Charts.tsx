import { BaseChart } from './BaseChart';
import { useMemo } from 'react';

type ChartProps = {
    data: number[];
    maxDataPoints: number;
};
export const Charts = (props: ChartProps) => {
    const preparedData = useMemo(() => {
        const points = props.data.map(point => ({ value: point * 100 }));
        return [...points, ...points.slice(0, props.maxDataPoints - points.length)];
    }, [props.data, props.maxDataPoints]);
    return <BaseChart data={preparedData} />;
}