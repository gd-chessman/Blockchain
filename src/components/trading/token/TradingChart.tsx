import IframeChartPage from "@/components/chart/IframeChartPage";
import { useLang } from "@/lang/useLang";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { formatNumberWithSuffix, truncateString } from "@/utils/format";
import React from "react";
import { Copy, Globe, MessageSquare, Twitter, Search } from "lucide-react";
import { ToastNotification } from "@/ui/toast";
import { useState } from "react";

export default function TradingChart({
  tokenInfor,
  address,
}: {
  tokenInfor: any;
  address: any;
}) {
  const { t } = useLang();
  const [showToast, setShowToast] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(tokenInfor?.address);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <>
      {showToast && (
        <ToastNotification
          message={t("createCoin.copySuccess")}
          duration={2000}
          onClose={() => setShowToast(false)}
        />
      )}
      <Card className="mb-6 shadow-md dark:shadow-blue-900/5 border lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <img
                src={tokenInfor?.logoUrl || "/placeholder.png"}
                alt={tokenInfor?.symbol}
                className="size-12 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">{tokenInfor?.symbol}/SOL</CardTitle>
                  <CardDescription>{tokenInfor?.name}</CardDescription>
                  {tokenInfor?.program === "pumpfun" && (
                    <img src="/pump.webp" alt="pump" className="h-6 w-6" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm">
                    {truncateString(tokenInfor?.address, 10)}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <a
                    href={`https://x.com/search?q=${tokenInfor?.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  >
                    <Search className="h-4 w-4" />
                  </a>
                  {tokenInfor?.telegram && (
                    <a
                      href={tokenInfor.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </a>
                  )}
                  {tokenInfor?.website && (
                    <a
                      href={tokenInfor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                  {tokenInfor?.twitter && (
                    <a
                      href={tokenInfor.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm flex gap-4 ">
                <div className="flex items-center flex-col">
                  <span>{t("trading.tokenInfo.marketCap")}:</span>
                  <span className="text-muted-foreground">
                    {/* ${tokenInfor?.marketCap?.toFixed(1)}K */}
                    ${formatNumberWithSuffix(tokenInfor?.marketCap)}
                  </span>
                </div>

                <div className="flex items-center flex-col">
                  <span>{t("trading.tokenInfo.volume24h")}:</span>
                  <span className="text-muted-foreground">
                    ${formatNumberWithSuffix(tokenInfor?.volume24h)}
                  </span>
                </div>
                <div className="flex items-center flex-col">
                  <span>{t("trading.tokenInfo.liquidity")}:</span>
                  <span className="text-muted-foreground">
                    ${formatNumberWithSuffix(tokenInfor?.liquidity)}
                  </span>
                </div>
                <div className="flex items-center flex-col">
                  <span>{t("trading.tokenInfo.holders")}:</span>
                  <span className="text-muted-foreground">
                    {tokenInfor?.holders}
                  </span>
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
    </>
  );
}
