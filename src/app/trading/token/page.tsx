"use client";
import TradingTokenMaster from '@/components/trading/token/TradingTokenMaster'
import TradingTokenMember from '@/components/trading/token/TradingTokenMember'
import { getInforWallet } from '@/services/api/TelegramWalletService';
import { useQuery } from '@tanstack/react-query';

export default function Trading() {
  const { data: walletInfor, refetch: refetchWalletInfor } = useQuery({
    queryKey: ["wallet-infor"],
    queryFn: getInforWallet,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });

  return (
    <>
      {walletInfor?.role === 'master' && <TradingTokenMaster />}
      {walletInfor?.role === 'member' && <TradingTokenMember />}
    </>
  )
}
