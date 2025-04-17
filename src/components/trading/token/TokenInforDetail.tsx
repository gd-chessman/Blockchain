import React, { useState } from 'react'
import { Card } from '@/ui/card'
import { cn } from '@/libs/utils'
import { getTokenInforByAddress } from '@/services/api/SolonaTokenService'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { formatNumberWithSuffix } from '@/utils/format'
import { useLang } from '@/lang/useLang'
type TimeFrame = '1m' | '5m' | '1h' | '24h'

interface TimeFrameData {
  percentage: number
  isPositive: boolean
  volume: string
  buys: { count: number; value: string }
  sells: { count: number; value: string }
  netBuy: string
}

const timeFrameData: Record<TimeFrame, TimeFrameData> = {
  '1m': {
    percentage: 0,
    isPositive: true,
    volume: '$103.7K',
    buys: { count: 71, value: '$103K' },
    sells: { count: 5, value: '$222' },
    netBuy: '+$103K'
  },
  '5m': {
    percentage: 0.2,
    isPositive: true,
    volume: '$156.2K',
    buys: { count: 85, value: '$142K' },
    sells: { count: 8, value: '$14.2K' },
    netBuy: '+$127.8K'
  },
  '1h': {
    percentage: 0.12,
    isPositive: true,
    volume: '$487.5K',
    buys: { count: 156, value: '$380K' },
    sells: { count: 42, value: '$107.5K' },
    netBuy: '+$272.5K'
  },
  '24h': {
    percentage: 1.83,
    isPositive: false,
    volume: '$2.1M',
    buys: { count: 523, value: '$980K' },
    sells: { count: 312, value: '$1.12M' },
    netBuy: '-$140K'
  }
}

interface TimeFrameStatsProps {
  timeFrame: TimeFrame
  isSelected: boolean
  onClick: () => void
}

const TimeFrameStats = ({ timeFrame, isSelected, onClick }: TimeFrameStatsProps) => {
  const data = timeFrameData[timeFrame]
  return (
    <div 
      className={cn(
        "flex flex-col items-center cursor-pointer transition-colors p-2 rounded-lg",
        isSelected ? "bg-muted" : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <span className="text-sm text-muted-foreground">
        {timeFrame}
      </span>
      <span className={cn(
        "text-sm font-medium",
        data.isPositive ? "text-green-500" : "text-red-500"
      )}>
        {data.isPositive ? "+" : ""}{data.percentage}%
      </span>
    </div>
  )
}


export default function TokenInforDetail({className}: {className?: string}) {
  const { t } = useLang();
  const searchParams = useSearchParams(); 
  const address = searchParams?.get("address");
  const { data: tokenInfor, refetch } = useQuery({
    queryKey: ["token-infor", address],
    queryFn: () => getTokenInforByAddress(address),
  });
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('1m')
  const currentData = timeFrameData[selectedTimeFrame]

  return (
    <Card className={cn("p-6 mb-6 w-full", className)}>
      <div className="w-full">
        <div className="space-y-4 w-full">
          {/* Market Statistics */}
          <div className="space-y-2 pb-4 border-b">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("trading.tokenInfo.marketCap")}</span>
              <span className="text-sm font-medium">{tokenInfor ? `$${formatNumberWithSuffix(tokenInfor.marketCap)}` : '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("trading.tokenInfo.volume24h")}</span>
              <span className="text-sm font-medium">{tokenInfor ? `$${formatNumberWithSuffix(tokenInfor.volume24h)}` : '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("trading.tokenInfo.liquidity")}</span>
              <span className="text-sm font-medium">{tokenInfor ? `$${formatNumberWithSuffix(tokenInfor.liquidity)}` : '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("trading.tokenInfo.holders")}</span>
              <span className="text-sm font-medium">{tokenInfor ? tokenInfor.holders.toLocaleString() : '-'}</span>
            </div>
          </div>

          {/* Time frame stats */}
          <div className="grid grid-cols-4 w-full gap-2">
            {(Object.keys(timeFrameData) as TimeFrame[]).map((timeFrame) => (
              <TimeFrameStats
                key={timeFrame}
                timeFrame={timeFrame}
                isSelected={selectedTimeFrame === timeFrame}
                onClick={() => setSelectedTimeFrame(timeFrame)}
              />
            ))}
          </div>

          {/* Volume and trades info */}
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Vol</span>
              <span className="text-sm font-medium">{currentData.volume}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Buys</span>
              <span className="text-sm font-medium">
                {currentData.buys.count} ({currentData.buys.value})
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Sells</span>
              <span className="text-sm font-medium">
                {currentData.sells.count} ({currentData.sells.value})
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Net Buy</span>
              <span className={cn(
                "text-sm font-medium",
                currentData.netBuy.startsWith('+') ? "text-green-500" : "text-red-500"
              )}>
                {currentData.netBuy}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
