import { useLang } from '@/lang/useLang';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import React, { RefObject, useEffect, useState } from 'react'
import { useWsTokenTransaction } from '@/hooks/useWsTokenTransaction';

interface Transaction {
    blockUnixTime: number;
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

export default function HistoryTransactions({ pendingOrders = [], orders = [], historyTransactionsRef, tokenAddress }: { pendingOrders?: any[], orders?: any[], historyTransactionsRef: any, tokenAddress: any }) {
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
        if (volume === undefined) return '0.000000';
        return volume.toFixed(6);
    };

    const formatPrice = (price: number | undefined) => {
        if (price === undefined) return '0.000000';
        return price.toFixed(6);
    };

    // Combine real-time orders with existing orders and limit to 30 most recent
    const allOrders = [...realTimeOrders, ...orders].slice(0, 30);

    return (
        <Card className="mt-6 shadow-md dark:shadow-blue-900/5 border">
            <CardHeader>
                <CardTitle>{t("trading.historyTransactions")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={historyTransactionsRef} className="overflow-x-auto max-h-[31.25rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
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
                                            {formatTime(order.blockUnixTime)}
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
                                            {formatVolume(Math.abs(order.from.changeAmount))}
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
