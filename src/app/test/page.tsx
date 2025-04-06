'use client';

import TradingViewChart from '@/components/chart/TradingViewChart';
import { useState, ChangeEvent } from 'react';


export default function Home() {
  const [symbol, setSymbol] = useState<string>('BINANCE:BTCUSDT');
  const [interval, setInterval] = useState<string>('D');
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const handleSymbolChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSymbol(e.target.value);
  };

  const handleIntervalChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setInterval(e.target.value);
  };

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Crypto Trading Charts</h1>
        <div id="price-ticker"></div>
      </div>

      <div className="controls">
        <select
          value={symbol}
          onChange={handleSymbolChange}
          className="symbol-select"
        >
          <option value="BINANCE:BTCUSDT">Bitcoin (BTC/USDT)</option>
          <option value="BINANCE:ETHUSDT">Ethereum (ETH/USDT)</option>
          <option value="BINANCE:BNBUSDT">Binance Coin (BNB/USDT)</option>
          <option value="BINANCE:DOGEUSDT">Dogecoin (DOGE/USDT)</option>
        </select>

        <select
          value={interval}
          onChange={handleIntervalChange}
          className="interval-select"
        >
          <option value="1">1 Minute</option>
          <option value="5">5 Minutes</option>
          <option value="15">15 Minutes</option>
          <option value="30">30 Minutes</option>
          <option value="60">1 Hour</option>
          <option value="D">1 Day</option>
          <option value="W">1 Week</option>
        </select>

        <button onClick={toggleTheme} className="theme-toggle">
          Toggle Theme
        </button>
      </div>

      <div className="chart-container">
        <TradingViewChart
          symbol={symbol}
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
