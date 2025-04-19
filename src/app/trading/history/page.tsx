"use client"; 

import React, { useEffect, useState } from "react";
import HistoryTransactions from "@/components/trading/history/HistoryTransactions";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOrderHistoriesByOwner } from "@/services/api/OnChainService";
import { getTokenInforByAddress } from "@/services/api/SolonaTokenService";
import { SiTelegram } from "react-icons/si";
import { Copy, Globe } from "lucide-react";
import { CardDescription } from "@/ui/card";
import { CardTitle } from "@/ui/card";
import { truncateString } from "@/utils/format";
import { ToastNotification } from "@/ui/toast";
import { useLang } from "@/lang/useLang";

interface Transaction {
  from: {
    address: string;
    symbol: string;
    decimals: number;
    price: number;
    amount: string;
    ui_amount: number;
    ui_change_amount: number;
  };
  to: {
    address: string;
    symbol: string;
    decimals: number;
    price: number;
    amount: string;
    ui_amount: number;
    ui_change_amount: number;
  };
  tx_type: string;
  tx_hash: string;
  block_unix_time: number;
  block_number: number;
  volume_usd: number;
  volume: number;
  owner: string;
  source: string;
  interacted_program_id: string;
  side: string;
  alias: string | null;
  price_pair: number;
  pool_id: string;
}

export default function History() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const address = searchParams?.get("address");
  const byOwner = searchParams?.get("by");
  const [traderAddress, setTraderAddress] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  const { data: orderHistoriesByOwner, isLoading: isLoadingOrderHistoriesByOwner } = useQuery<Transaction[]>({
    queryKey: ["orderHistories", address, byOwner],
    queryFn: () =>
      getOrderHistoriesByOwner({
        address: address || "",
        offset: 0,
        limit: 50,
        sort_by: "block_unix_time",
        sort_type: "desc",
        tx_type: "swap",
        owner: byOwner,
      }),
    enabled: !!address && !!byOwner,
  });

  useEffect(() => {
    if (orderHistoriesByOwner && orderHistoriesByOwner.length > 0) {
      const firstOrder = orderHistoriesByOwner[0];
      const newTraderAddress = firstOrder.from.address === address ? firstOrder.to.address : firstOrder.from.address;
      setTraderAddress(newTraderAddress);
      console.log('Trader Address:', newTraderAddress);
    }
  }, [orderHistoriesByOwner, address]);

  const { data: tokenInfor, refetch } = useQuery({
    queryKey: ["token-infor", traderAddress],
    queryFn: () => getTokenInforByAddress(traderAddress),
    enabled: !!traderAddress,
  });

  const handleCopyAddress = () => {
    if (tokenInfor?.address) {
      navigator.clipboard.writeText(tokenInfor.address);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {showToast && (
        <ToastNotification message={t("createCoin.copySuccess")} />
      )}
      <div className="flex items-center gap-2 mb-6">
        <img
          src={tokenInfor?.logoUrl || "/placeholder.png"}
          alt={tokenInfor?.symbol}
          className="size-12 rounded-full"
        />
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">
              {tokenInfor?.symbol}/SOL
            </CardTitle>
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
            {tokenInfor?.twitter && (
              <a
                href={tokenInfor.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <svg
                  width="14"
                  height="14"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 300 300"
                >
                  <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
                </svg>
              </a>
            )}
            {tokenInfor?.telegram && (
              <a
                href={tokenInfor.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <SiTelegram className="h-4 w-4" />
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
          </div>
        </div>
      </div>
      <HistoryTransactions orders={orderHistoriesByOwner} />
    </div>
  );
}
