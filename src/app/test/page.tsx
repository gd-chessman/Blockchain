'use client';

import TradingViewChart from '@/components/chart/TradingViewChart';
import { useState, ChangeEvent } from 'react';


export default function Home() {

  const [interval, setInterval] = useState<string>('D');
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const handleIntervalChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setInterval(e.target.value);
  };

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  return (
    <div className="container">


      <div className="controls">

        <button onClick={toggleTheme} className="theme-toggle">
          Toggle Theme
        </button>
      </div>

      <div className="chart-container">
        <TradingViewChart
          interval={interval}
          theme={isDarkTheme ? 'dark' : 'light'}
        />
      </div>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100%;
        }
        .header {
          background: ${isDarkTheme ? '#2a2e39' : '#2962ff'};
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .chart-container {
          flex: 1;
          display: flex;
          width: 100%;
        }
        .controls {
          padding: 1rem;
          background: ${isDarkTheme ? '#1e222d' : '#f5f5f5'};
          display: flex;
          gap: 1rem;
          width: 100%;
        }
        select,
        button {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        button {
          background: #2962ff;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background: #1e4bd8;
        }
      `}</style>
    </div>
  );
}