"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { useLang } from "@/lang";
import { useRouter } from "next/navigation";
import { Search, Loader2, Copy, Star, BarChart4 } from "lucide-react";
import { Input } from "@/ui/input";
import { useState, useEffect } from "react";
import { useWsSubscribeTokens } from "@/hooks/useWsSubscribeTokens";
import { SolonaTokenService } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { truncateString } from "@/utils/format";
import { ToastNotification } from "@/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { TableTokenList } from "@/components/trading/TableTokenList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import LogWarring from "@/ui/log-warring";
import { getMyWishlist } from "@/services/api/SolonaTokenService";
import { useQuery } from "@tanstack/react-query";

export default function Trading() {
  const router = useRouter();
  const { t } = useLang();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const { tokens: wsTokens } = useWsSubscribeTokens({ limit: 18 });
  const [tokens, setTokens] = useState<
    {
      id: number;
      name: string;
      symbol: string;
      address: string;
      decimals: number;
      logoUrl: string;
      coingeckoId: string | null;
      tradingviewSymbol: string | null;
      isVerified: boolean;
      marketCap: number;
      isFavorite?: boolean;
      liquidity: any;
    }[]
  >([]);
  const { data: myWishlist, refetch: refetchMyWishlist } = useQuery({
    queryKey: ["myWishlist"],
    queryFn: getMyWishlist,
    refetchOnMount: true,
  });
  const [searchResults, setSearchResults] = useState<
    {
      id: number;
      name: string;
      symbol: string;
      address: string;
      decimals: number;
      logoUrl: string;
      coingeckoId: string | null;
      tradingviewSymbol: string | null;
      isVerified: boolean;
      marketCap: number;
      isFavorite?: boolean;
      liquidity: any;
    }[]
  >([]);

  // Update tokens when WebSocket data changes
  useEffect(() => {
    if (wsTokens && wsTokens.length > 0) {
      setTokens(wsTokens);
    }
  }, [wsTokens]);

  // Effect to handle search when debounced value changes
  useEffect(() => {
    const searchData = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        setCurrentPage(1);
        setTotalPages(1);
        return;
      }
      setIsSearching(true);
      try {
        const res = await SolonaTokenService.getSearchTokenInfor(
          debouncedSearchQuery,
          currentPage,
          18
        );
        setActiveTab("all");
        setSearchResults(res.tokens || []);
        setTotalPages(Math.ceil(res.total / 18));
      } catch (error) {
        console.error("Error searching tokens:", error);
        setSearchResults([]);
        setTotalPages(1);
      } finally {
        setIsSearching(false);
      }
    };

    searchData();
  }, [debouncedSearchQuery, currentPage]);

  // Use search results if available, otherwise use WebSocket data
  const displayTokens = debouncedSearchQuery.trim() ? searchResults : tokens;

  const handleCopyAddress = (address: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setToastMessage(t("createCoin.copySuccess"));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStarClick = async (token: any) => {
    try {
      const data = {
        tokenId: token.id,
        status: activeTab === "favorites" ? "off" : "on",
      };
      const response = await SolonaTokenService.toggleWishlist(data);
      if (response) {
        setToastMessage(t("trading.wishlistUpdated"));
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
        // Refresh wishlist using refetch
        refetchMyWishlist();
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setToastMessage(t("trading.wishlistError"));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {showToast && (
        <ToastNotification
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
      <Card className="mb-6 border-none shadow-none bg-transparent">
        <CardHeader className="flex justify-between flex-row items-center !p-0 mb-6 flex-wrap">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br bg-[#d8e8f7] text-black rounded-xl flex items-center justify-center mr-4  shadow-lg shadow-purple-500/20 dark:shadow-purple-800/20 animate-bounce">
              <BarChart4 className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold font-comic bg-clip-text text-transparent bg-gradient-to-r bg-[#d8e8f7] uppercase">
              {t("trading.list_token_title")}
            </h1>
          </div>
          <div className="relative w-full md:w-auto mt-4 md:mt-0">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" />
            )}
            <Input
              placeholder={t("trading.search_placeholder")}
              className="pl-10 w-full md:w-[400px]"
              value={searchQuery}
              onChange={(e) => {
                if (!isAuthenticated) {
                  setShowToast(true);
                  setToastMessage(t("createCoin.pleaseConnectWallet"));
                  setTimeout(() => {
                    setShowToast(false);
                  }, 3000);
                  setSearchQuery("");
                  return;
                }
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setSearchResults([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  if (!isAuthenticated) {
                    setShowToast(true);
                    setToastMessage(t("createCoin.pleaseConnectWallet"));
                    setTimeout(() => {
                      setShowToast(false);
                    }, 3000);
                    setSearchQuery("");
                    return;
                  }
                  setSearchQuery(searchQuery.trim());
                }
              }}
            />
          </div>
        </CardHeader>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="all">{t("trading.tabs.allTokens")}</TabsTrigger>
            <TabsTrigger value="favorites">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                {t("trading.tabs.favorites")}
                <span className="ml-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {myWishlist?.total || 0}
                </span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {displayTokens && (
              <CardContent className="!p-0">
                <TableTokenList
                  tokens={displayTokens}
                  onCopyAddress={handleCopyAddress}
                  onStarClick={handleStarClick}
                  isFavoritesTab={false}
                  isLoading={!wsTokens || wsTokens.length === 0}
                />
              </CardContent>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {!isAuthenticated && <LogWarring />}
            {isAuthenticated && (
              <CardContent className="!p-0">
                <TableTokenList
                  tokens={myWishlist?.tokens || []}
                  onCopyAddress={handleCopyAddress}
                  onStarClick={handleStarClick}
                  isFavoritesTab={true}
                  isLoading={false}
                />
              </CardContent>
            )}
          </TabsContent>
        </Tabs>
        {debouncedSearchQuery.trim() &&
          totalPages > 1 &&
          activeTab === "all" && (
            <div className="flex justify-center mt-6 pb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  «
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                {currentPage > 2 && (
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80"
                  >
                    1
                  </button>
                )}
                {currentPage > 3 && <span className="px-2">...</span>}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return page;
                }).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {currentPage < totalPages - 2 && (
                  <span className="px-2">...</span>
                )}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80"
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ›
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  »
                </button>
              </div>
            </div>
          )}
      </Card>
    </div>
  );
}
