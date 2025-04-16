'use client';

import { useWsSubscribeTokensFlash } from '@/hooks/useWsSubscribeTokensFlash';
import { useEffect, useState } from 'react';
import { truncateString } from '@/utils/format';
import CardFlash from '@/components/dashboard/CardFlash';

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

      <CardFlash tokens={tokens} />
    </div>
  );
}
