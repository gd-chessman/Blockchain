"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/libs/utils";
import { Button } from "@/ui/button";
import {
  LayoutDashboard,
  TrendingUp,
  Copy,
  Users,
  Wallet,
  Menu,
  Coins,
  LogOut,
  Wallet2,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "./logo";
import { useLang } from "@/lang";
import { LangToggle } from "./lang-toggle";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getInforWallet, getMyWallets, useWallet, getListBuyToken } from "@/services/api/TelegramWalletService";
import { truncateString } from "@/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Badge } from "@/ui/badge";
import dynamic from 'next/dynamic';

const BalanceDisplay = dynamic(() => Promise.resolve(({ balance, usdBalance }: { balance: string, usdBalance: string }) => (
  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-white dark:bg-[#1d8e50] dark:text-white border-blue-200">
    {balance} SOL (${usdBalance})
  </div>
)), { ssr: false });

export default function Navigation() {
  const { data: walletInfor, refetch } = useQuery({
    queryKey: ["wallet-infor"],
    queryFn: getInforWallet,
    refetchInterval: 30000,
    staleTime: 30000,
  });
  const { data: myWallets } = useQuery({
    queryKey: ["my-wallets"],
    queryFn: getMyWallets,
    staleTime: 30000,
  });
  const { data: tokenList, refetch: refetchTokenList } = useQuery({
    queryKey: ["token-buy-list"],
    queryFn: getListBuyToken,
  });
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, updateToken } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { t } = useLang();
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  const handleChangeWallet = async (walletId: string) => {
    try {
      const res = await useWallet({ wallet_id: walletId });
      updateToken(res.token);
      await refetch();
      await refetchTokenList();
      window.location.reload();
    } catch (error) {
      console.error('Error changing wallet:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if(walletInfor?.status === 401){
      logout();
    }
  }, [walletInfor]);


  const navItems = [
    {
      name: "newcoin-pumpfun",
      href: "/create-coin-pumpfun",
      icon: <Coins className="mr-2 h-5 w-5" />,
    },
    {
      name: "newcoin",
      href: "/create-new-coin",
      icon: <Coins className="mr-2 h-5 w-5" />,
    },
    {
      name: "dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
    },
    {
      name: "trading",
      href: "/trading",
      icon: <TrendingUp className="mr-2 h-5 w-5" />,
    },

    {
      name: "mastertrade",
      href: "/master-trade",
      icon: <Users className="mr-2 h-5 w-5" />,
    },
    // {
    //   name: "copytrade",
    //   href: "/copy-trade",
    //   icon: <Copy className="mr-2 h-5 w-5" />,
    // },
    {
      name: "wallet",
      href: "/wallet",
      icon: <Wallet className="mr-2 h-5 w-5" />,
    },
  ];

  return (
    <nav className="bg-gradient-to-r bg-primary text-white sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border-b">
      <div className="container mx-auto flex items-center justify-between py-3 !px-0 md:!px-4">
        {/* Logo bên trái */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Tabs ở giữa */}
        <div className="hidden md:flex items-center justify-center flex-1 px-4">
          <div className="flex items-center justify-center gap-1 xl:gap-4 2xl:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-all hover:bg-white/10 text-sm font-semibold",
                  pathname?.startsWith(item.href)
                    ? "bg-white/20 shadow-sm"
                    : "bg-transparent"
                )}
              >
                {item.icon}
                {t(`navigation.${item.name}`)}
              </Link>
            ))}
          </div>
        </div>

        {/* Các nút chức năng bên phải */}
        <div className="flex items-center gap-1 md:gap-3">
          {isAuthenticated && mounted && walletInfor && (
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6rem] md:text-xs font-bold text-white dark:text-white border-white">
              {walletInfor.solana_balance?.toFixed(5) || '0.00000'} SOL (${walletInfor.solana_balance_usd?.toFixed(2) || '0.00'})
            </div>
          )}
          <ThemeToggle />
          <LangToggle />
          {mounted && (
            <>
              {!isAuthenticated && (
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold"
                  onClick={() =>
                    window.open(
                      "https://t.me/michosso_connect_wallet_bot?start",
                      "_blank"
                    )
                  }
                >
                  Connect Telegram
                </Button>
              )}
              {isAuthenticated && walletInfor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold">
                      <Wallet2 className="sm:hidden h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">{truncateString(walletInfor.solana_address, 14)}</span>
                      <ChevronDown size={16} className="ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setIsWalletDialogOpen(true)}>
                      <Wallet2 className="mr-2 h-4 w-4" />
                      <span>{t('navigation.selectWallet.selectWalletButton')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-600" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('navigation.selectWallet.disconnectButton')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>

        {/* Menu mobile */}
        <div className="md:hidden flex mx-2">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu />
          </button>
        </div>
      </div>

      {/* Wallet Selection Dialog */}
      <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t('navigation.selectWallet.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {myWallets?.map((wallet: { wallet_id: string; wallet_name: string; solana_address: string; wallet_type: string; wallet_auth: string }) => (
              <div
                key={wallet.wallet_id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  handleChangeWallet(wallet.wallet_id);
                  setIsWalletDialogOpen(false);
                }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Wallet2 className="h-4 w-4" />
                    <span className="font-semibold">{wallet.wallet_name}</span>
                    <Badge variant="outline" className="ml-2">
                      {t(`navigation.selectWallet.walletType.${wallet.wallet_type?.toLowerCase() || 'primary'}`)}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      {t(`navigation.selectWallet.walletAuth.${wallet.wallet_auth?.toLowerCase() || 'owner'}`)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {truncateString(wallet.solana_address, 20)}
                  </div>
                </div>
                {walletInfor?.solana_address === wallet.solana_address && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lớp phủ */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Menu mobile hiển thị khi click vào nút menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMenuOpen ? "auto" : 0,
          opacity: isMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden md:hidden fixed top-16 left-0 w-full bg-primary z-50 shadow-lg"
      >
        <div className="flex flex-col gap-1 px-4 pb-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-all hover:bg-white/10 text-sm font-semibold",
                pathname?.startsWith(item.href)
                  ? "bg-white/20 shadow-sm"
                  : "bg-transparent"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon}
              {t(`navigation.${item.name}`)}
            </Link>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
