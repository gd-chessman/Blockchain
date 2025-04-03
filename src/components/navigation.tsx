"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  TrendingUp,
  Copy,
  Users,
  Wallet,
  Menu,
  Coins,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "./logo";
import { t } from "@/lang";
import { LangToggle } from "./lang-toggle";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getInforWallets } from "@/services/api/TelegramWalletService";
import { truncateString } from "@/utils/format";

export default function Navigation() {
  const { data: walletInfor, refetch } = useQuery({
    queryKey: ["wallet-infor"],
    queryFn: getInforWallets,
  });
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
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
      name: "copytrade",
      href: "/copy-trade",
      icon: <Copy className="mr-2 h-5 w-5" />,
    },
    {
      name: "mastertrade",
      href: "/master-trade",
      icon: <Users className="mr-2 h-5 w-5" />,
    },
    {
      name: "wallet",
      href: "/wallet",
      icon: <Wallet className="mr-2 h-5 w-5" />,
    },
  ];

  return (
    <nav className="bg-gradient-to-r bg-primary text-white sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border-b">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo bên trái */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Tabs ở giữa */}
        <div className="hidden md:flex items-center justify-center flex-1 px-4">
          <div className="flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-all hover:bg-white/10 text-sm font-medium",
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
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <LangToggle />
          {mounted && (
            <>
              {!isAuthenticated && (
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white font-medium"
                  onClick={() =>
                    window.open(
                      "https://t.me/kcomeme_connect_wallet_bot?start",
                      "_blank"
                    )
                  }
                >
                  Connect Telegram
                </Button>
              )}
              {isAuthenticated && (
                <Button className="bg-green-500 hover:bg-green-600 text-white font-medium w-36 block">
                  {truncateString(walletInfor?.solana_address, 14)}
                </Button>
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
                "flex items-center px-3 py-2 rounded-lg transition-all hover:bg-white/10 text-sm font-medium",
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
