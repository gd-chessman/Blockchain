"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/libs/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, TrendingUp, Copy, Users, Wallet } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "./logo"
import { t } from "@/lang"
import { LangToggle } from "./lang-toggle"
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
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
  ]

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-900 dark:to-blue-800 text-white sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border-b border-blue-700/50 dark:border-blue-950/50">
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
                  pathname?.startsWith(item.href) ? "bg-white/20 shadow-sm" : "bg-transparent",
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
          <Button className="bg-green-500 hover:bg-green-600 text-white font-medium">
            Connect Telegram
          </Button>
        </div>

        {/* Menu mobile */}
        <div className="md:hidden flex mx-2">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu />
          </button>
        </div>
      </div>

      {/* Menu mobile hiển thị khi click vào nút menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isMenuOpen ? "auto" : 0, opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden md:hidden"
      >
        <div className="flex flex-col gap-1 px-4 pb-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-all hover:bg-white/10 text-sm font-medium",
                pathname?.startsWith(item.href) ? "bg-white/20 shadow-sm" : "bg-transparent",
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
  )
}
