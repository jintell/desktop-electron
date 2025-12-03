import { useState, useMemo, useEffect } from 'react'
import './App.css'
import { Charts } from './screens/Charts';
import { useStatistics } from './hooks/useStatistics';

function App() {
    const statistic = getStatistics();
  const [activeView, setActiveView] = useState<string>('CPU');
  const usages = useStatistics(10);
  const cpuUsages = useMemo(()=> usages.map((usage) => usage.cpuUsage),
      [usages]);
  const ramUsages = useMemo(()=> usages.map((usage) => usage.memoryUsage),
        [usages]);
  const storageUsages = useMemo(()=> usages.map((usage) => usage.storageUsage),
        [usages]);

  const activeViewUsages = useMemo(() => {
      switch (activeView) {
      case 'CPU': return cpuUsages;
      case 'MEMORY': return ramUsages;
      case 'STORAGE': return storageUsages;
      default: return [];
      }
  }, [activeView, cpuUsages, ramUsages, storageUsages]);

    useEffect(() => {
        return window.electron.subscribeChangeView((view) => setActiveView(view));
    }, []);

  // @ts-ignore
    // @ts-ignore
    return (
    <>
        <Header/>
        <div className="main">
            <div>
                <SelectOption title="CPU"
                              view="CPU"
                              subTitle={statistic?.cpuModel ?? ""}
                              data={cpuUsages}
                              onclick={ () => setActiveView('CPU')}/>
                <SelectOption title="MEMORY"
                              view="MEMORY"
                              subTitle={(statistic?.totalMemInGb.toString() ?? "") + 'GB'}
                              data={ramUsages}
                              onclick={ () => setActiveView('MEMORY')}/>
                <SelectOption title="STORAGE"
                              view="STORAGE"
                              subTitle={(statistic?.totalStorage.toString() ?? "") + 'GB'}
                              data={storageUsages}
                              onclick={ () => setActiveView('STORAGE')}/>
            </div>
            <div className="mainGrid">
                <Charts
                    data={activeViewUsages}
                    maxDataPoints={10}
                    // @ts-ignore
                    selectedView={activeView} />
            </div>
        </div>
    </>
  )
}

function SelectOption({title, view, subTitle, data, onclick}: {title: string, view: View, subTitle: string, data: number[], onclick: () => void}) {
    return <button className="selectOption" onClick={onclick}>
                <div className="selectOptionTitle">
                    <div>{title}</div>
                    <div>{subTitle}</div>
                </div>
                <div className="selectOptionChart">
                    <Charts
                        data={data}
                        maxDataPoints={10}
                        selectedView={view}/>
                </div>
            </button>
}

function Header() {
    return (
        <header>
            <button id="close" onClick={() => window.electron.sendFrameAction('CLOSE')}/>
            <button id="minimize" onClick={() => window.electron.sendFrameAction('MINIMIZE')}/>
            <button id="maximize" onClick={() => window.electron.sendFrameAction('MAXIMIZE')}/>
        </header>
    );
}

function getStatistics() {
    const [statistic, setStatistic] = useState<StatisticData>();

    useEffect(() => {
        (async ()=> {
            setStatistic(await window.electron.getStatisticalData());
        })();
    }, []);

    return statistic;
}

export default App
