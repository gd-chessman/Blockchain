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

export default function TradingViewChart({
  symbol = 'BINANCE:BTCUSDT',
  interval = 'D',
  theme = 'light',
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [widget, setWidget] = useState<any>(null); // Có thể custom typing sau nếu cần

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
      if (widget && typeof widget.remove === 'function') {
        widget.remove();
      }
      document.head.removeChild(script);
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
