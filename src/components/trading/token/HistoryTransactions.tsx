import { useLang } from '@/lang/useLang';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import React, { RefObject } from 'react'

export default function HistoryTransactions({ pendingOrders = [], orders = [], historyTransactionsRef }: { pendingOrders?: any[], orders?: any[], historyTransactionsRef: any }) {
    const { t } = useLang();
  return (
    <Card className="mt-6 shadow-md dark:shadow-blue-900/5 border">
    <CardHeader>
      <CardTitle>{t("trading.historyTransactions")}</CardTitle>
    </CardHeader>
    <CardContent>
      <div ref={historyTransactionsRef} className="overflow-x-auto">
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
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-1">
                    <span
                      className={
                        order.trade_type === "buy"
                          ? "text-green-500 uppercase"
                          : "text-red-500 uppercase"
                      }
                    >
                      {t(`trading.${order.trade_type}`)}
                    </span>
                  </td>
                  <td className="py-3 px-1">${order.price}</td>
                  <td className="py-3 px-1">{order.quantity}</td>
                  <td className="py-3 px-1">
                    ${(order.price * order.quantity).toFixed(8) || ""}
                  </td>
                  <td className="py-3 px-1 uppercase">
                    <span
                      className={
                        order.status === "pending"
                          ? "text-yellow-500"
                          : "text-blue-600"
                      }
                    >
                      {t(`trading.${order.status}`)}
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
