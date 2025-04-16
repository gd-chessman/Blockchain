'use client';

import { useWsSubscribeTokensFlash } from '@/hooks/useWsSubscribeTokensFlash';
import { useEffect, useState } from 'react';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokens.map((token, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <div className="flex items-center gap-2">
              {token.logoUrl && (
                <img src={token.logoUrl} alt={token.symbol} className="w-8 h-8" />
              )}
              <div>
                <h3 className="font-semibold">{token.name}</h3>
                <p className="text-gray-600">{token.symbol}</p>
              </div>
            </div>
            <div className="mt-2">
              <p>Address: {token.address}</p>
              <p>Market Cap: ${token.marketCap?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
