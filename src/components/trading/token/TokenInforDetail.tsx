import React, { useState, useEffect } from 'react'
import { Card } from '@/ui/card'
import { cn } from '@/libs/utils'
import { getTokenInforByAddress, getTokenPrice } from '@/services/api/SolonaTokenService'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { formatNumberWithSuffix } from '@/utils/format'
import { useLang } from '@/lang/useLang'
import { useTokenInfor } from '@/hooks/useTokenInfor'

export default function TokenInforDetail({className}: {className?: string}) {
  const { t } = useLang();
  const searchParams = useSearchParams(); 
  const address = searchParams?.get("address");
  const { data: tokenInfor, refetch: refetchTokenInfor } = useQuery({
    queryKey: ["token-infor", address],
    queryFn: () => getTokenInforByAddress(address),
    refetchInterval: 10000,
  });
  const { data: tokenPrice, refetch: refetchTokenPrice } = useQuery({
    queryKey: ["token-price", address],
    queryFn: () => getTokenPrice(address),
    enabled: !tokenInfor?.price,
  });
  const { price: realtimePrice } = useTokenInfor(address || '');
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [initialRatio, setInitialRatio] = useState<number | null>(null);

  useEffect(() => {
    setMarketCap(null);
    setInitialRatio(null);
    refetchTokenInfor();
    if (!tokenInfor?.price) {
      refetchTokenPrice();
    }
  }, [address, refetchTokenInfor, refetchTokenPrice, tokenInfor?.price]);

  useEffect(() => {
    const price = tokenInfor?.price || tokenPrice?.priceUSD;
    if (!tokenInfor?.marketCap || !price || price === 0) {
      return;
    }

    const ratio = tokenInfor.marketCap / price;
    setInitialRatio(ratio);
    setMarketCap(tokenInfor.marketCap);
  }, [tokenInfor, tokenPrice]);

  useEffect(() => {
    if (!initialRatio || !realtimePrice) {
      return;
    }

    const newMarketCap = initialRatio * realtimePrice;
    setMarketCap(newMarketCap);
  }, [realtimePrice, initialRatio]);

  return (
    <Card className={cn("p-6 mb-6 w-full", className)}>
      <div className="w-full">
        <div className="space-y-4 w-full">
          {/* Market Statistics */}
          <div className="space-y-2 pb-4 border-b">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("trading.tokenInfo.marketCap")}</span>
              <span className="text-sm font-medium">{marketCap ? `$${formatNumberWithSuffix(marketCap)}` : '-'}</span>
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
              <span className="text-sm font-medium">{tokenInfor ? tokenInfor?.holders?.toLocaleString() : '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
