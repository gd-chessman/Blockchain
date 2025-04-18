import { useLang } from '@/lang/useLang';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import React, { RefObject, useEffect, useState } from 'react'
import { useWsTokenTransaction } from '@/hooks/useWsTokenTransaction';
import { formatNumberWithSuffix } from '@/utils/format';

interface Transaction {
    blockUnixTime: number;
    block_unix_time: number;
    from: {
        address: string;
        amount: number;
        changeAmount: number;
        decimals: number;
        nearestPrice: number;
    };
    owner: string;
    side: string;
    source: string;
    to: {
        address: string;
        amount: number;
        changeAmount: number;
        decimals: number;
    };
    tokenAddress: string;
    txHash: string;
    volumeUSD: number;
}

export default function HistoryTransactions({ pendingOrders = [], orders = [], historyTransactionsRef, tokenAddress , className}: { pendingOrders?: any[], orders?: any[], historyTransactionsRef: any, tokenAddress: any, className?: string }) {
    const { t } = useLang();
    const [realTimeOrders, setRealTimeOrders] = useState<Transaction[]>([]);
    const { transaction } = useWsTokenTransaction(tokenAddress);
    
    useEffect(() => {
        if (transaction) {
            setRealTimeOrders(prev => [transaction, ...prev]);
        }
    }, [transaction]);

    const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const formatVolume = (volume: number | undefined) => {
        if (volume === undefined) return '0.0';
        return volume?.toFixed(2);
    };

    const formatPrice = (price: number | undefined) => {
        if (price === undefined) return '0.0';
        return price?.toFixed(6);
    };

    // Combine real-time orders with existing orders and limit to 30 most recent
    const allOrders = [...realTimeOrders, ...orders].filter(order => 
        order.side === "buy" || order.side === "sell"
    );

    return (
        <Card className="shadow-md dark:shadow-blue-900/5 border h-full">
            <CardHeader>
                <CardTitle>{t("trading.historyTransactions")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={historyTransactionsRef} className={`overflow-x-auto max-h-[31.25rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 ${className}`}>
                    <table className="w-full">
                        <thead>
                            <tr className="text-sm text-muted-foreground border-b">
                                <th className="text-left py-3 px-1">{t("trading.time")}</th>
                                <th className="text-left py-3 px-1">{t("trading.type")}</th>
                                <th className="text-left py-3 px-1">{t("trading.price")}</th>
                                <th className="text-left py-3 px-1">{t("trading.amount")}</th>
                                <th className="text-left py-3 px-1">{t("trading.total")}</th>
                                <th className="text-left py-3 px-1">{t("trading.status")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...pendingOrders, ...allOrders].map(
                                (order: Transaction, index: number) => (
                                    <tr key={index} className="text-sm border-b">
                                        <td className="py-3 px-1">
                                            {formatTime(order.blockUnixTime || order.block_unix_time)}
                                        </td>
                                        <td className="py-3 px-1">
                                            <span
                                                className={
                                                    order.side === "buy"
                                                        ? "text-green-500 uppercase"
                                                        : "text-red-500 uppercase"
                                                }
                                            >
                                                {t(`trading.${order.side}`)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-1">
                                            ${formatPrice(order.from.nearestPrice)}
                                        </td>
                                        <td className="py-3 px-1">
                                           
                                            {formatNumberWithSuffix(order.from.amount)}
                                        </td>
                                        <td className="py-3 px-1">
                                            ${formatVolume(order.volumeUSD)}
                                        </td>
                                        <td className="py-3 px-1 uppercase">
                                            <span className="text-blue-600">
                                                {t("trading.completed")}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
