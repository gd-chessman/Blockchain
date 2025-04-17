import { useLang } from '@/lang/useLang';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import React, { RefObject } from 'react'

export default function HistoryTransactions({ pendingOrders = [], orders = [], historyTransactionsRef }: { pendingOrders?: any[], orders?: any[], historyTransactionsRef: any }) {
    const { t } = useLang();
    
    const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const formatVolume = (volume: number) => {
        return volume.toFixed(8);
    };

    const formatPrice = (price: number) => {
        return price.toFixed(8);
    };

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
                            {[...pendingOrders, ...(orders || [])].map(
                                (order: any, index: number) => (
                                    <tr key={index} className="text-sm border-b">
                                        <td className="py-3 px-1">
                                            {formatTime(order.block_unix_time)}
                                        </td>
                                        <td className="py-3 px-1">
                                            <span
                                                className={
                                                    order.tx_type === "buy"
                                                        ? "text-green-500 uppercase"
                                                        : "text-red-500 uppercase"
                                                }
                                            >
                                                {t(`trading.${order.tx_type}`)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-1">
                                            ${formatPrice(order.price_pair)}
                                        </td>
                                        <td className="py-3 px-1">
                                            {formatVolume(order.volume)}
                                        </td>
                                        <td className="py-3 px-1">
                                            ${formatVolume(order.volume_usd)}
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
