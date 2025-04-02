"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  ReferenceLine,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Kiểu dữ liệu cho một điểm dữ liệu trên biểu đồ
export interface ChartDataPoint {
  date: string
  timestamp: number
  open: number
  close: number
  high: number
  low: number
  volume: number
  ma7: number | null
  ma25: number | null
}

// Props cho component TradingChart
interface TradingChartProps {
  data: ChartDataPoint[]
  symbol?: string
  onTimeframeChange?: (timeframe: string) => void
}

// Hàm tạo dữ liệu mẫu cho biểu đồ
export const generateChartData = (days = 30, startPrice = 43000): ChartDataPoint[] => {
  const data = []
  let price = startPrice

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))

    // Tạo biến động giá ngẫu nhiên
    const change = (Math.random() - 0.5) * 500
    price = Math.max(price + change, price * 0.95)

    const open = price
    const close = price + (Math.random() - 0.5) * 200
    const high = Math.max(open, close) + Math.random() * 200
    const low = Math.min(open, close) - Math.random() * 200
    const volume = Math.floor(Math.random() * 1000) + 500

    data.push({
      date: date.toLocaleDateString(),
      timestamp: date.getTime(),
      open: Number.parseFloat(open.toFixed(2)),
      close: Number.parseFloat(close.toFixed(2)),
      high: Number.parseFloat(high.toFixed(2)),
      low: Number.parseFloat(low.toFixed(2)),
      volume,
      ma7: null,
      ma25: null,
    })
  }

  // Tính toán đường MA (Moving Average)
  for (let i = 0; i < data.length; i++) {
    if (i >= 6) {
      let sum = 0
      for (let j = i - 6; j <= i; j++) {
        sum += data[j].close
      }
      data[i].ma7 = Number.parseFloat((sum / 7).toFixed(2)) as number | null
    }

    if (i >= 24) {
      let sum = 0
      for (let j = i - 24; j <= i; j++) {
        sum += data[j].close
      }
      data[i].ma25 = Number.parseFloat((sum / 25).toFixed(2))
    }
  }

  return data
}

export default function TradingChart({ data, symbol = "BTC/USDT", onTimeframeChange }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState("1D")
  const [showVolume, setShowVolume] = useState(true)
  const [showMA, setShowMA] = useState(true)

  // Lấy giá hiện tại từ dữ liệu biểu đồ
  const latestData = data[data.length - 1]

  const formatPrice = (value: any) => {
    return `$${value.toLocaleString()}`
  }

  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  const formatVolume = (value: any) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value
  }

  const handleTimeframeChange = (tf: any) => {
    setTimeframe(tf)
    if (onTimeframeChange) {
      onTimeframeChange(tf)
    }
  }

  return (
    <>
      <div className="h-[400px] border rounded-md bg-white/50 dark:bg-gray-900/50 overflow-hidden">
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: "hsl(var(--chart-1))",
            },
            ma7: {
              label: "MA7",
              color: "hsl(var(--chart-2))",
            },
            ma25: {
              label: "MA25",
              color: "hsl(var(--chart-3))",
            },
            volume: {
              label: "Volume",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                yAxisId="price"
                domain={["auto", "auto"]}
                tickFormatter={formatPrice}
                orientation="right"
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
              />
              {showVolume && (
                <YAxis
                  yAxisId="volume"
                  orientation="left"
                  tickFormatter={formatVolume}
                  domain={[0, "dataMax"]}
                  tick={{ fontSize: 12 }}
                  stroke="var(--muted-foreground)"
                />
              )}
              <Tooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => {
                  if (name === "volume") return [formatVolume(value), "Volume"]
                  if (name === "ma7") return [formatPrice(value), "MA7"]
                  if (name === "ma25") return [formatPrice(value), "MA25"]
                  return [formatPrice(value), String(name).charAt(0).toUpperCase() + String(name).slice(1)]
                }}
                labelFormatter={formatDate}
              />

              {/* Candlestick simulation using Area */}
              {data.map((entry, index) => {
                const isUp = entry.close >= entry.open
                const color = isUp ? "var(--color-price)" : "var(--destructive)"
                return (
                  <Line
                    key={`candle-${index}`}
                    type="monotone"
                    dataKey="close"
                    stroke={color}
                    dot={false}
                    activeDot={false}
                    yAxisId="price"
                  />
                )
              })}

              {/* Moving Averages */}
              {showMA && (
                <>
                  <Line
                    type="monotone"
                    dataKey="ma7"
                    stroke="var(--color-ma7)"
                    dot={false}
                    strokeWidth={2}
                    yAxisId="price"
                  />
                  <Line
                    type="monotone"
                    dataKey="ma25"
                    stroke="var(--color-ma25)"
                    dot={false}
                    strokeWidth={2}
                    yAxisId="price"
                  />
                </>
              )}

              {/* Volume */}
              {showVolume && (
                <Bar dataKey="volume" yAxisId="volume" fill="var(--color-volume)" opacity={0.5} barSize={20} />
              )}

              {/* Current price line */}
              <ReferenceLine y={latestData.close} yAxisId="price" stroke="#888" strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="flex justify-between mt-4">
        <div className="grid grid-cols-5 gap-2">
          {["1H", "4H", "1D", "1W", "1M"].map((tf) => (
            <Button
              key={tf}
              variant="outline"
              size="sm"
              className={
                timeframe === tf
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  : ""
              }
              onClick={() => handleTimeframeChange(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={showVolume ? "bg-blue-100 dark:bg-blue-900/30" : ""}
            onClick={() => setShowVolume(!showVolume)}
          >
            Volume
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={showMA ? "bg-blue-100 dark:bg-blue-900/30" : ""}
            onClick={() => setShowMA(!showMA)}
          >
            MA
          </Button>
        </div>
      </div>
    </>
  )
}

