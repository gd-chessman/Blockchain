'use client';

import React from 'react';
import { useWsTokenTransaction } from '@/hooks/useWsTokenTransaction';

export default function TestPage() {
  // Thay thế tokenAddress bằng địa chỉ token thực tế bạn muốn theo dõi
  const tokenAddress = '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump';
  const { transaction, error, isConnected } = useWsTokenTransaction(tokenAddress);
  console.log(transaction);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Token Transaction</h1>
      
      <div className="mb-4">
        <p className="font-semibold">Connection Status:</p>
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Latest Transaction</h2>
        {transaction ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(transaction, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">No transaction data received yet</p>
        )}
      </div>
    </div>
  );
}
