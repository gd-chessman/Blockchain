"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, TrendingUp, Copy, Users, Wallet, Globe, BellIcon as BrandTelegram } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "./logo"

export default function Navigation() {
  const pathname = usePathname()
  const [language, setLanguage] = useState("US")

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
    },
    {
      name: "Trading",
      href: "/trading",
      icon: <TrendingUp className="mr-2 h-5 w-5" />,
    },
    {
      name: "Copy Trade",
      href: "/copy-trade",
      icon: <Copy className="mr-2 h-5 w-5" />,
    },
    {
      name: "Master Trade",
      href: "/master-trade",
      icon: <Users className="mr-2 h-5 w-5" />,
    },
    {
      name: "Wallet",
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
                  pathname === item.href ? "bg-white/20 shadow-sm" : "bg-transparent",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Các nút chức năng bên phải */}
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />

          <Button variant="ghost" className="text-white hover:bg-white/10 border-blue-500/30">
            <Globe className="mr-2 h-4 w-4" />
            {language}
          </Button>

          <Button className="bg-green-500 hover:bg-green-600 text-white font-medium">
            <BrandTelegram className="mr-2 h-4 w-4" />
            Connect Telegram
          </Button>
        </div>

        {/* Menu mobile */}
        <div className="md:hidden">{/* Hiển thị menu dạng dropdown cho mobile */}</div>
      </div>

      {/* Menu mobile hiển thị khi click vào nút menu */}
      <div className="md:hidden">
        <div className="flex flex-col gap-1 px-4 pb-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-all hover:bg-white/10 text-sm font-medium",
                pathname === item.href ? "bg-white/20 shadow-sm" : "bg-transparent",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

