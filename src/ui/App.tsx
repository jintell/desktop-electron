import { useState, useEffect, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Charts } from './screens/Charts';
import { useStatistics } from './hooks/useStatistics';

function App() {
  const [count, setCount] = useState(0);
  const usages = useStatistics(10);
  const cpuUsages = useMemo(()=> usages.map((usage) => usage.cpuUsage),
      [usages]);

    useEffect(() => {
        const unsub = window.electron.subscribeToResources((data) => {
            console.log(data);
        });
        return unsub;
    }, []);

  return (
    <>
        <div style={{ height: 120 }}>
            <Charts data={cpuUsages} maxDataPoints={10}/>
        </div>
        {/*<div style={{ height: 120 }}>*/}
        {/*    <BaseChart*/}
        {/*        data={[{value: 25}, {value: 30}, {value: 100}]}>*/}
        {/*    </BaseChart>*/}
        {/*</div>*/}
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
