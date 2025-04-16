import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Loader2, Search, Star } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lang";
import { Button } from "@/ui/button";
import { formatNumberWithSuffix } from "@/utils/format";


export default function OtherCoins({
  historyTransactionsHeight,
  tokens,
  searchQuery,
  isSearching,
  onSearchChange,
  onStarClick,
  favoriteTokens = [],
}: any) {
  const { t } = useLang();

  return (
    <Card className="shadow-md dark:shadow-blue-900/5 border">
      <CardHeader>
        <CardTitle>{t("trading.otherCoins")}</CardTitle>
      </CardHeader>
      <CardHeader className="pt-0">
        <div className="relative w-full">
          {isSearching ? (
            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" />
          )}
          <Input
            type="text"
            placeholder={t("trading.searchCoinsPlaceholder")}
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardHeader>
      {favoriteTokens && favoriteTokens.length > 0 && (
        <CardContent>
          <div className="">
            <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50">
              <div className="space-y-4 max-h-[11.25rem] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent">
                {favoriteTokens.map((token: any, index: any ) => (
                  <Link
                    key={index}
                    className={`flex text-sm gap-6 cursor-pointer ${
                      index < favoriteTokens.length - 1 ? "border-b-2 pb-2" : ""
                    }`}
                    href={`/trading/token?address=${token.address}`}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0 text-yellow-500 hover:text-yellow-600"
                      onClick={(e) => {
                        e.preventDefault();
                        onStarClick?.(token);
                      }}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <img
                      src={token.logoUrl || token.logo_uri || "/placeholder.png"}
                      alt=""
                      className="size-10 rounded-full"
                    />
                    <div>
                      <p className="flex items-center gap-2">
                        <span className="max-w-[10rem] truncate">
                          {token.name}
                        </span>
                        {token.program === "pumpfun" && (
                          <img
                            src="/pump.webp"
                            alt="pump"
                            className="h-4 w-4"
                          />
                        )}
                      </p>{" "}
                      <p className="text-muted-foreground text-xs">
                        {token.symbol}
                      </p>{" "}
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                      {/* <span className="text-xs font-medium">${formatNumberWithSuffix(token.price || 0)}</span> */}
                      <small
                        className={`text-sm ${
                          token.isVerified ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {token.isVerified ? " ✓" : "x"}
                      </small>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50">
            <div className="overflow-auto h-80 lg:h-full max-h-[60rem] md:h-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent">
              {!tokens || (tokens.length === 0 && !searchQuery) ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {tokens.map((token: any, index: any) => (
                    <Link
                      key={index}
                      className={`flex text-sm gap-6 cursor-pointer ${
                        index < tokens.length - 1 ? "border-b-2 pb-2" : ""
                      }`}
                      href={`/trading/token?address=${token.address}`}
                    >
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 p-0 ${
                          token.isFavorite ? "text-yellow-500" : ""
                        } hover:text-yellow-500`}
                        onClick={(e) => {
                          e.preventDefault();
                          onStarClick?.(token);
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button> */}
                      <img
                        src={token.logoUrl || token.logo_uri || "/placeholder.png"}
                        alt=""
                        className="size-10 rounded-full"
                      />
                      <div>
                        <p className="flex items-center gap-2">
                          <span className="max-w-[10rem] truncate">
                            {token.name}
                          </span>
                          {token.program === "pumpfun" && (
                            <img
                              src="/pump.webp"
                              alt="pump"
                              className="h-4 w-4"
                            />
                          )}
                        </p>{" "}
                        <p className="text-muted-foreground text-xs">
                          {token.symbol}
                        </p>{" "}
                      </div>
                      <div className="ml-auto flex items-center gap-4">
                        <span className="text-xs font-medium">${formatNumberWithSuffix(token.price || 0)}</span>
                        <small
                          className={`text-sm ${
                            token.isVerified ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {token.isVerified ? " ✓" : "x"}
                        </small>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
