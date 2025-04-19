"use client"; 

import React from "react";
import HistoryTransactions from "@/components/trading/history/HistoryTransactions";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOrderHistoriesByOwner } from "@/services/api/OnChainService";
export default function History() {
  const searchParams = useSearchParams();
  const address = searchParams?.get("address");
  const byOwner = searchParams?.get("by");

  const { data: orderHistoriesByOwner, isLoading: isLoadingOrderHistoriesByOwner } = useQuery(
    {
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
    }
  );

  return (
    <div className="container mx-auto p-6">
      <HistoryTransactions orders={orderHistoriesByOwner}/>
    </div>
  );
}
