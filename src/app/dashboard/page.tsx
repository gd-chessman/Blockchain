"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart, PieChart, ArrowUp, Loader2, Search } from "lucide-react"
import { useWsSubscribeTokens } from "@/hooks/useWsSubscribeTokens";
import { useState, useEffect } from "react";
import { SolonaTokenService } from "@/services/api";
import { truncateString } from "@/utils/format";
import { useLang } from "@/lang/useLang";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ToastNotification } from "@/components/ui/toast";

export default function Dashboard() {
  const { t } = useLang();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 100);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { tokenMessages } = useWsSubscribeTokens({limit: 18});
  const [showNotification, setShowNotification] = useState(false);
  
  const [tokens, setTokens] = useState<{
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
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<{
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
  }[]>([]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Parse messages and extract tokens
  useEffect(() => {
    if (Array.isArray(tokenMessages) && tokenMessages.length > 0) {
      const lastMessage = tokenMessages[tokenMessages.length - 1];
      
      try {
        const parsedMessage = JSON.parse(lastMessage);

        
        if (parsedMessage.data && parsedMessage.data.tokens) {
          const convertedTokens = parsedMessage.data.tokens.map((token: any) => {
            return {
              id: 0,
              name: token.slt_name || token.name,
              symbol: token.slt_symbol || token.symbol,
              address: token.slt_address || token.address,
              decimals: token.slt_decimals || token.decimals,
              logoUrl: token.slt_logo_url || token.logoUrl,
              coingeckoId: null,
              tradingviewSymbol: null,
              isVerified: token.slt_is_verified || token.isVerified,
              marketCap: 0
            };
          });
          setTokens(convertedTokens);
          setIsLoading(false);
        } else {
          console.log("No tokens found in message data");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
    }

  }, [tokenMessages]);

  // Fetch initial tokens if WebSocket is not providing data
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await SolonaTokenService.getSearchTokenInfor("");
        if (response && response.tokens) {
          setTokens(response.tokens);
        } else {
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (tokens.length === 0) {
      fetchTokens();
    }
  }, [tokens.length]);

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
        const res = await SolonaTokenService.getSearchTokenInfor(debouncedSearchQuery, currentPage, 18);
        setSearchResults(res.tokens || []);
        setTotalPages(Math.ceil(res.total / 12));
      } catch (error) {
        console.error("Error searching tokens:", error);
        setSearchResults([]);
        setTotalPages(1);
      } finally {
        setIsSearching(false);
      }
    };

    searchData();
  }, [debouncedSearchQuery, currentPage, isAuthenticated]);

  // Use search results if available, otherwise use WebSocket data
  const displayTokens = debouncedSearchQuery.trim() ? searchResults : tokens;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6">
      {showNotification && (
        <ToastNotification 
          message="Vui lòng kết nối ví để thực hiện chức năng này"
          duration={3000}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          {/* {t('dashboard.last_updated')} */}
        </div>
      </div>


      <div className="mt-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold">{t('dashboard.cryptocurrencies.title')}</h2>
          <div className="relative w-full md:w-[400px] mt-4 md:mt-0">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" />
            )}
            <Input
              placeholder={t("trading.search_placeholder")}
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => {
                if (!isAuthenticated) {
                  setShowNotification(true);
                  setSearchQuery("");
                  return;
                }
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setSearchResults([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  if (!isAuthenticated) {
                    setShowNotification(true);
                    setSearchQuery("");
                    return;
                  }
                  setSearchQuery(searchQuery.trim());
                }
              }}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : displayTokens.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {displayTokens.map((token, index) => (
                <Card key={index} className="group relative shadow-md dark:shadow-blue-900/5 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border-2 hover:border-primary border-solid hover:border-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                  <div className="relative w-full cursor-pointer" onClick={() => router.push(`/trading/token?address=${token.address}`)}>
                    <div className="relative w-full aspect-[4/3]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-950/10 group-hover:from-blue-100/50 group-hover:to-blue-200/50 dark:group-hover:from-blue-800/20 dark:group-hover:to-blue-900/20 transition-colors duration-300">
                        <img 
                          src={token.logoUrl} 
                          alt={token.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="p-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 max-w-[70%]">
                          <CardTitle className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate">
                            {token.name}
                          </CardTitle>
                          <CardDescription className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                            {token.symbol}
                          </CardDescription>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                          token.isVerified 
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {token.isVerified ? '✓' : '✗'}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className="space-y-0.5">
                            <div className="text-gray-500 dark:text-gray-400 text-[10px]">{t('dashboard.cryptocurrencies.token.address')}</div>
                            <div className="font-medium text-gray-700 dark:text-gray-300 truncate">
                              {truncateString(token.address, 12)}
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-gray-500 dark:text-gray-400 text-[10px]">{t('dashboard.cryptocurrencies.token.decimals')}</div>
                            <div className="font-medium text-gray-700 dark:text-gray-300">
                              {token.decimals}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {debouncedSearchQuery.trim() && totalPages > 1 && (
              <div className="flex justify-center mt-6">
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
                  
                  {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, i) => {
                      let page;
                      if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return page;
                    }
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  {currentPage < totalPages - 2 && <span className="px-2">...</span>}
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
          </>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {t('dashboard.cryptocurrencies.no_tokens')}
          </div>
        )}
      </div>

    </div>
  )
}

