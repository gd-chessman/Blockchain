'use client';

import { useWsSubscribeTokensFlash } from '@/hooks/useWsSubscribeTokensFlash';
import { useEffect, useState } from 'react';
import { truncateString } from '@/utils/format';

export default function Home() {
  const { tokens, isConnected, error } = useWsSubscribeTokensFlash({
    limit: 9,
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      
      <div className="mb-4">
        <p>Connection Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
        {error && <p className="text-red-500">Error: {error}</p>}
        <p>Total Tokens: {tokens.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-[52rem]">
        {tokens.slice(0, 2).map((token, index) => (
          <div key={index} className="border p-2 rounded-lg text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {token.logoUrl && (
                  <img src={token.logoUrl} alt={token.symbol} className="w-6 h-6 rounded" />
                )}
                <div>
                  <h3 className="font-semibold text-sm">{token.name}</h3>
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
    </div>
  );
}
