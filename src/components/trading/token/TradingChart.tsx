import IframeChartPage from '@/components/chart/IframeChartPage';
import { useLang } from '@/lang/useLang';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import React from 'react'

export default function TradingChart({ tokenInfor, address }: { tokenInfor: any, address: any }) {
  const { t } = useLang();
  return (
    <Card className="mb-6 shadow-md dark:shadow-blue-900/5 border lg:col-span-2">
    <CardHeader>
      <div className="flex items-center justify-between flex-wrap">
        <div>
          <CardTitle>{tokenInfor?.symbol}/SOL</CardTitle>
          <CardDescription>{tokenInfor?.name}</CardDescription>
        </div>
        <div className="text-right">
          <div className="text-sm flex gap-4 ">
            <div className="flex items-center flex-col">
              <span>{t("trading.tokenInfo.marketCap")}:</span>
              <span className="text-muted-foreground">${tokenInfor?.marketCap?.toFixed(1)}K</span>
            </div>

            <div className="flex items-center flex-col">
              <span>{t("trading.tokenInfo.volume24h")}:</span>
              <span className="text-muted-foreground">${tokenInfor?.volume24h?.toFixed(1)}K</span>
            </div>
            <div className="flex items-center flex-col">
              <span>{t("trading.tokenInfo.liquidity")}:</span>
              <span className="text-muted-foreground">${tokenInfor?.liquidity?.toFixed(1)}K</span>
            </div>
            <div className="flex items-center flex-col">
              <span>{t("trading.tokenInfo.holders")}:</span>
              <span className="text-muted-foreground">{tokenInfor?.holders}</span>
            </div>
            
          </div>
          <div className="text-2xl font-bold">
            {/* ${tokenPrice?.priceUSD?.toFixed(9) || "0.00"} */}
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <IframeChartPage token={address} />
    </CardContent>
  </Card>
  )
}
