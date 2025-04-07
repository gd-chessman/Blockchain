'use client';

import { useEffect, useRef, useState } from 'react';

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: 'light' | 'dark';
}

// Mở rộng window object để dùng TradingView
declare global {
  interface Window {
    TradingView?: any;
  }
}

// Tạo dữ liệu giả cho 30 ngày
const generateMockData = () => {
  const data = [];
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const basePrice = 50000;
  
  for (let i = 30; i >= 0; i--) {
    // Tạo dữ liệu có quy luật tăng giảm
    const priceChange = Math.sin(i * 0.2) * 1000; // Dao động theo sin
    const currentPrice = basePrice + priceChange;
    
    data.push({
      time: now - (i * oneDay),
      open: currentPrice,
      high: currentPrice + 500,
      low: currentPrice - 500,
      close: currentPrice + (Math.sin(i * 0.2) * 200), // Đóng cửa dao động nhẹ
      volume: 1000
    });
  }

  return data;
};

export default function TradingViewChart({
  symbol = 'BINANCE:BTCUSDT',
  interval = 'D',
  theme = 'light',
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [widget, setWidget] = useState<any>(null);
  const mockData = generateMockData();
  console.log(mockData);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        const newWidget = new window.TradingView.widget({
          width: '100%',
          height: '100%',
          symbol,
          interval,
          timezone: 'Asia/Ho_Chi_Minh',
          theme,
          style: '1',
          locale: 'vi_VN',
          toolbar_bg: theme === 'dark' ? '#2a2e39' : '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: true,
          hide_top_toolbar: true,
          hide_legend: true,
          hide_volume: true,
          allow_symbol_change: true,
          container_id: 'tradingview_chart',
          datafeed: {
            onReady: (callback: any) => {
              callback({
                supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W'],
                exchanges: [],
                symbols_types: [],
              });
            },
            searchSymbols: (userInput: string, exchange: string, symbolType: string, onResultReadyCallback: any) => {
              onResultReadyCallback([]);
            },
            resolveSymbol: (symbolName: string, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
              onSymbolResolvedCallback({
                name: symbolName,
                full_name: symbolName,
                description: symbolName,
                type: 'crypto',
                session: '24x7',
                timezone: 'Asia/Ho_Chi_Minh',
                ticker: symbolName,
                minmov: 1,
                pricescale: 100,
                has_intraday: true,
                intraday_multipliers: ['1', '5', '15', '30', '60'],
                supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W'],
                volume_precision: 8,
                data_status: 'streaming',
              });
            },
            getBars: (symbolInfo: any, resolution: string, periodParams: any, onHistoryCallback: any, onErrorCallback: any) => {
              onHistoryCallback(mockData, { noData: false });
            },
            subscribeBars: (symbolInfo: any, resolution: string, onRealtimeCallback: any, subscriberUID: string, onResetCacheNeededCallback: any) => {
              // Thêm dữ liệu realtime cố định mỗi giây
              const interval = setInterval(() => {
                const lastData = mockData[mockData.length - 1];
                const timeChange = Math.sin(mockData.length * 0.1) * 200; // Dao động theo sin
                const newData = {
                  time: lastData.time + (24 * 60 * 60 * 1000),
                  open: lastData.close,
                  high: lastData.close + 500,
                  low: lastData.close - 500,
                  close: lastData.close + timeChange,
                  volume: 1000
                };
                mockData.push(newData);
                onRealtimeCallback(newData);
              }, 1000);

              return () => clearInterval(interval);
            },
            unsubscribeBars: (subscriberUID: string) => {
              // Cleanup
            },
          },
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
          ],
        });
        setWidget(newWidget);
      }
    };

    document.head.appendChild(script);

    return () => {
      if (widget && containerRef.current && containerRef.current.parentNode) {
        try {
          widget.remove();
        } catch (error) {
          console.error('Error removing widget:', error);
        }
      }
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [symbol, interval, theme]);

  return (
    <>
      <style jsx>{`
        .tradingview-widget-container {
          height: 70% !important;
          width: 100% !important;
        }
        #tradingview_chart {
          height: 100% !important;
          width: 100% !important;
        }
      `}</style>
      <div className="tradingview-widget-container">
        <div id="tradingview_chart" ref={containerRef} />
      </div>
    </>
  );
}
