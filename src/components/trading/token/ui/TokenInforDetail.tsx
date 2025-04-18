import React, { useState, useEffect, useRef } from "react";
import {
  getTokenInforByAddress,
  getTokenPrice,
} from "@/services/api/SolonaTokenService";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { formatNumberWithSuffix } from "@/utils/format";
import { useLang } from "@/lang/useLang";
import { useTokenInfor } from "@/hooks/useTokenInfor";

export default function TokenInforDetail({
  className,
}: {
  className?: string;
}) {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const address = searchParams?.get("address");
  const { data: tokenInfor, refetch: refetchTokenInfor } = useQuery({
    queryKey: ["token-infor", address],
    queryFn: () => getTokenInforByAddress(address),
    refetchInterval: 3000,
  });
  const { data: tokenPrice, refetch: refetchTokenPrice } = useQuery({
    queryKey: ["token-price", address],
    queryFn: () => getTokenPrice(address),
    enabled: !tokenInfor?.price,
  });
  const { price: realtimePrice } = useTokenInfor(address || "");
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [initialRatio, setInitialRatio] = useState<number | null>(null);
  
  // Add refs to track previous values
  const prevMarketCap = useRef<number | null>(null);
  const prevVolume = useRef<number | null>(null);
  const prevLiquidity = useRef<number | null>(null);

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

  // Helper function to determine if value increased
  const isValueIncreased = (current: number | null, previous: number | null) => {
    if (!current || !previous) return null;
    return current > previous;
  };

  // Update previous values when new data arrives
  useEffect(() => {
    if (marketCap) prevMarketCap.current = marketCap;
    if (tokenInfor?.volume24h) prevVolume.current = tokenInfor.volume24h;
    if (tokenInfor?.liquidity) prevLiquidity.current = tokenInfor.liquidity;
  }, [marketCap, tokenInfor]);

  return (
    <>
      <div className="text-sm flex gap-4 ">
        <div className="flex items-center flex-col">
          <span>{t("trading.tokenInfo.marketCap")}:</span>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">
              {marketCap ? `$${formatNumberWithSuffix(marketCap)}` : "-"}
            </span>
            {isValueIncreased(marketCap, prevMarketCap.current) !== null && (
              <span className={isValueIncreased(marketCap, prevMarketCap.current) ? "text-green-500" : "text-red-500"}>
                {isValueIncreased(marketCap, prevMarketCap.current) ? "↑" : "↓"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center flex-col">
          <span>{t("trading.tokenInfo.volume24h")}:</span>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">
              {tokenInfor
                ? `$${formatNumberWithSuffix(tokenInfor.volume24h)}`
                : "-"}
            </span>
            {isValueIncreased(tokenInfor?.volume24h, prevVolume.current) !== null && (
              <span className={isValueIncreased(tokenInfor?.volume24h, prevVolume.current) ? "text-green-500" : "text-red-500"}>
                {isValueIncreased(tokenInfor?.volume24h, prevVolume.current) ? "↑" : "↓"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center flex-col">
          <span>{t("trading.tokenInfo.liquidity")}:</span>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">
              {tokenInfor
                ? `$${formatNumberWithSuffix(tokenInfor.liquidity)}`
                : "-"}
            </span>
            {isValueIncreased(tokenInfor?.liquidity, prevLiquidity.current) !== null && (
              <span className={isValueIncreased(tokenInfor?.liquidity, prevLiquidity.current) ? "text-green-500" : "text-red-500"}>
                {isValueIncreased(tokenInfor?.liquidity, prevLiquidity.current) ? "↑" : "↓"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center flex-col">
          <span>{t("trading.tokenInfo.holders")}:</span>
          <span className="text-muted-foreground">
            {tokenInfor ? tokenInfor?.holders?.toLocaleString() : "-"}
          </span>
        </div>
      </div>
    </>
  );
}
