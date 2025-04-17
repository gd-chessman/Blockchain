import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Loader2, Search, Star, ArrowUpDown, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lang";
import { Button } from "@/ui/button";
import { formatNumberWithSuffix } from "@/utils/format";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { SolonaTokenService } from "@/services/api";
import { getTopCoins } from "@/services/api/OnChainService";

export default function OtherCoins() {
  const { t } = useLang();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: topCoins, isLoading: isLoadingTopCoins, refetch: refetchTopCoins } = useQuery({
    queryKey: ["topCoins", sortBy, sortDirection],
    queryFn: () => getTopCoins({ 
      sort_by: sortBy, 
      sort_type: sortDirection, 
      offset: 0, 
      limit: 18 
    }),
  });

  const { data: myWishlist, refetch: refetchMyWishlist } = useQuery({
    queryKey: ["myWishlist"],
    queryFn: () => SolonaTokenService.getMyWishlist(),
    refetchOnMount: true,
  });

  useEffect(() => {
    refetchTopCoins();
  }, [sortBy, sortDirection, refetchTopCoins]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Effect to handle search when debounced value changes
  useEffect(() => {
    const searchData = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const res = await SolonaTokenService.getSearchTokenInfor(debouncedSearchQuery);
        setSearchResults(res.tokens || []);
      } catch (error) {
        console.error("Error searching tokens:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchData();
  }, [debouncedSearchQuery]);

  const handleStarClick = async (token: any) => {
    try {
      const isFavorite = myWishlist?.tokens?.some((t: any) => t.id === token.id);
      const data = {
        token_address: token.address,
        status: isFavorite ? "off" : "on",
      };
      await SolonaTokenService.toggleWishlist(data);
      refetchMyWishlist();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  // Use search results if available, otherwise use topCoins data
  const displayTokens = debouncedSearchQuery.trim()
    ? searchResults
    : topCoins?.map((token: any) => ({
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        address: token.address,
        decimals: token.decimals,
        logoUrl: token.logoUrl || token.logo_uri || "/placeholder.png",
        coingeckoId: null,
        tradingviewSymbol: null,
        isVerified: token.isVerified,
        marketCap: token.market_cap || 0,
        program: token.program,
        price: token.price || 0,
        liquidity: token.liquidity || 0,
        volume_1h_usd: token.volume_1h_usd || 0,
        volume_1h_change_percent: token.volume_1h_change_percent || 0,
        volume_24h_usd: token.volume_24h_usd || 0,
        volume_24h_change_percent: token.volume_24h_change_percent || 0,
      })) || [];

  // Sort tokens based on selected criteria
  const sortedTokens = [...displayTokens].sort((a, b) => {
    if (!sortBy) return 0;
    const aValue = a[sortBy] || 0;
    const bValue = b[sortBy] || 0;
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const sortOptions = [
    { value: "market_cap", label: "MC" },
    { value: "", label: "None" },
    { value: "liquidity", label: "Liq" },
    { value: "volume_1h_usd", label: "1h Vol" },
    { value: "volume_1h_change_percent", label: "1h%" },
    { value: "volume_24h_usd", label: "24h Vol" },
    { value: "volume_24h_change_percent", label: "24h%" },
  ];

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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      {myWishlist?.tokens && myWishlist.tokens.length > 0 && (
        <CardContent>
          <div className="">
            <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50">
              <div className="space-y-4 max-h-[11.25rem] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent">
                {myWishlist.tokens.map((token: any, index: any) => (
                  <Link
                    key={index}
                    className={`flex text-sm gap-6 cursor-pointer ${
                      index < myWishlist.tokens.length - 1 ? "border-b-2 pb-2" : ""
                    }`}
                    href={`/trading/token?address=${token.address}`}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0 text-yellow-500 hover:text-yellow-600"
                      onClick={(e) => {
                        e.preventDefault();
                        handleStarClick(token);
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
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1" ref={dropdownRef}>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {sortOptions.find(option => option.value === sortBy)?.label || "Sort by"}
                <ChevronDown className="h-4 w-4" />
              </Button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border rounded-md shadow-lg">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        sortBy === option.value ? "bg-gray-100 dark:bg-gray-800" : ""
                      }`}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              className={sortDirection === "asc" ? "text-green-500" : "text-red-500"}
            >
              {sortDirection === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50">
            <div className="overflow-auto h-80 lg:h-full max-h-[60rem] md:h-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent">
              {isLoadingTopCoins ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedTokens.map((token: any, index: any) => (
                    <Link
                      key={index}
                      className={`flex text-sm gap-6 cursor-pointer ${
                        index < sortedTokens.length - 1 ? "border-b-2 pb-2" : ""
                      }`}
                      href={`/trading/token?address=${token.address}`}
                    >
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
