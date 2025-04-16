import { truncateString } from '@/utils/format';
import React from 'react'

export default function CardFlash({ tokens }: { tokens: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-[52rem]">
    {tokens.slice(0, 2).map((token, index) => (
      <div key={index} className="border p-2 rounded-lg text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {token.logoUrl && (
              <img src={token.logoUrl} alt={token.symbol} className="w-6 h-6 rounded" />
            )}
            <div>
              <h3 className="font-semibold text-sm max-w-[12rem] truncate">{token.name}</h3>
              <p className="text-gray-600 text-xs">{token.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs">{truncateString(token.address, 20)}</p>
            <p className="text-xs">Market Cap: ${Number(token.marketCap).toFixed(1)}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}
