"use client";
import {
  Loader2,
  Search,
} from "lucide-react";
import { useWsSubscribeTokens } from "@/hooks/useWsSubscribeTokens";
import { useState, useEffect } from "react";
import { SolonaTokenService } from "@/services/api";
import { useLang } from "@/lang/useLang";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ToastNotification } from "@/ui/toast";
import TokenCard from "@/components/dashboard/Card";

export default function Dashboard() {
  const { t } = useLang();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [screenSize, setScreenSize] = useState<number>(window.innerWidth);
  const { tokens: wsTokens } = useWsSubscribeTokens({ 
    limit: screenSize >= 1280 && screenSize < 1536 ? 16 : 18 
  });
  const [showNotification, setShowNotification] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
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
    }[]
  >([]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update tokens when WebSocket data changes
  useEffect(() => {
    if (wsTokens && wsTokens.length > 0) {
      setTokens(wsTokens);
      setIsLoading(false);
    }
  }, [wsTokens]);

  // Fetch initial tokens if WebSocket is not providing data
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await SolonaTokenService.getSearchTokenInfor("");
        if (response && response.tokens) {
          setTokens(response.tokens);
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
        const res = await SolonaTokenService.getSearchTokenInfor(
          debouncedSearchQuery,
          currentPage,
          18
        );
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
          message={t("createCoin.pleaseConnectWallet")}
          duration={3000}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="flex items-start md:items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-800 rounded-xl flex items-center justify-center mr-4 text-white shadow-lg shadow-yellow-500/20 dark:shadow-yellow-800/20 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-rocket h-7 w-7"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold font-comic bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-pink-500 dark:from-yellow-300 dark:to-pink-300 uppercase">
          {t("dashboard.title")}
        </h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          {/* {t('dashboard.last_updated')} */}
        </div>
      </div>

      <div className="mt-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold">
            {t("dashboard.cryptocurrencies.title")}
          </h2>
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
                if (e.key === "Enter" && searchQuery.trim()) {
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              {displayTokens.map((token, index) => (
                <TokenCard
                  key={index}
                  token={token}
                  index={index}
                  isHovered={hoveredCard === index}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onTradeClick={() =>
                    router.push(`/trading/token?address=${token.address}`)
                  }
                />
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
          </>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {t("dashboard.cryptocurrencies.no_tokens")}
          </div>
        )}
      </div>
    </div>
  );
}
