"use client"

import { Card, CardContent } from "@/ui/card"
import { Button } from "@/ui/button"
import { CheckCircle2, ExternalLink, Copy, X } from "lucide-react"
import { cn } from "@/libs/utils"
import { truncateString } from "@/utils/format"
import { ToastNotification } from "@/ui/toast"
import { useState } from "react"
import { useLang } from "@/lang"

// Meme class mapping
const memeClasses = [
  "meme-card-yellow",
  "meme-card-purple",
  "meme-card-yellow",
  "meme-card-purple",
  "meme-card-blue",
  "meme-card-yellow",
  "meme-card-orange",
  "meme-card-green",
]

// Get meme class for a token
const getMemeClass = (address: string) => {
  // Convert address to a number by summing character codes
  const addressSum = address.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return memeClasses[addressSum % memeClasses.length];
}

interface TokenCardProps {
  token: {
    id: number
    name: string
    symbol: string
    address: string
    decimals: number
    logoUrl: string
    isVerified: boolean
  }
  index: number
  isHovered?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onTradeClick: () => void
}

export default function TokenCard({
  token,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onTradeClick,
}: TokenCardProps) {
  const [showToast, setShowToast] = useState(false)
  const { t } = useLang();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(token.address)
    setShowToast(true)
  }

  return (
    <>
      {showToast && (
        <ToastNotification
          message={t('createCoin.copySuccess')}
          duration={2000}
          onClose={() => setShowToast(false)}
        />
      )}
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 rounded-2xl",
          getMemeClass(token.address),
          isHovered
            ? "scale-[1.02] shadow-xl dark:shadow-purple-900/20 z-10 animate-wiggle"
            : "shadow-lg dark:shadow-purple-900/10",
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/5 to-purple-600/10 dark:from-purple-400/10 dark:to-purple-600/20 rounded-bl-full -z-10"></div>

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-800 opacity-30 blur-[2px] scale-110"></div>
                <div className="absolute inset-0 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-purple-300 dark:border-purple-700">
                  <img
                    src={token.logoUrl || "/placeholder.png"}
                    alt={token.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.png"
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="font-bold flex items-center">
                  {token.name}
                  {token.isVerified ? (
                    <CheckCircle2 className="ml-1 size-4 text-green-500" />
                  ) : (
                    <X className="ml-1 size-4 text-red-500" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{token.symbol}</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">{t('trading.tokenInfo.address')}:</div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-mono bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded overflow-hidden text-ellipsis flex-1">
                {truncateString(token.address, 20)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopyAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">{t('trading.tokenInfo.decimals')}</div>
              <div className="text-sm font-medium">{token.decimals}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">{t('trading.tokenInfo.symbol')}</div>
              <div className="text-sm font-medium">{token.symbol}</div>
            </div>
          </div>

          <div className="flex justify-end items-center">
            <Button
              variant="outline"
              size="sm"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 border-purple-300 dark:border-purple-700 rounded-full"
              onClick={onTradeClick}
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              {t('trading.trade')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
