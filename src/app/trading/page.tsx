"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLang } from "@/lang";
import { useRouter } from "next/navigation";
import { Search, Loader2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useWsSubscribeTokens } from "@/hooks/useWsSubscribeTokens";
import { SolonaTokenService } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { truncateString } from "@/utils/format";
import { ToastNotification } from "@/components/ui/toast";

export default function Trading() {
  const router = useRouter();
  const { t } = useLang();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 100); // 2 seconds delay
  const [isSearching, setIsSearching] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { tokenMessages } = useWsSubscribeTokens({limit: 18});
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

  // Parse messages and extract tokens
  useEffect(() => {
    if (Array.isArray(tokenMessages)) {
      tokenMessages.forEach((message) => {
        try {
          const parsedMessage = JSON.parse(message);
          // Convert WebSocket data format to match API format
          const convertedTokens = parsedMessage.data.tokens.map((token: any) => ({
            id: 0, // WebSocket data doesn't have ID
            name: token.slt_name,
            symbol: token.slt_symbol,
            address: token.slt_address,
            decimals: token.slt_decimals,
            logoUrl: token.slt_logo_url,
            coingeckoId: null,
            tradingviewSymbol: null,
            isVerified: token.slt_is_verified,
            marketCap: 0 // WebSocket data doesn't have marketCap
          }));
          setTokens(convertedTokens);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    } else {
      console.error("messages is not an array:", tokenMessages);
    }
  }, [tokenMessages]);

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

  // Use search results if available, otherwise use WebSocket data
  const displayTokens = debouncedSearchQuery.trim() ? searchResults : tokens;

  const handleCopyAddress = (address: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setToastMessage(t('createCoin.copySuccess'));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto p-6">
      {showToast && (
        <ToastNotification 
          message={toastMessage}
          onClose={() => setShowToast(false)} 
        />
      )}
      <Card className="mb-6 border-none shadow-md dark:shadow-blue-900/5">
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle>{t("trading.list_token_title")}</CardTitle>
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
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setSearchResults([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setSearchQuery(searchQuery.trim());
                }
              }}
            />
          </div>
        </CardHeader>
        {displayTokens && (
          <CardContent>
            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{t("trading.token")}</TableHead>
                    <TableHead>{t("trading.symbol")}</TableHead>
                    <TableHead>{t("trading.address")}</TableHead>
                    <TableHead>{t("trading.decimals")}</TableHead>
                    <TableHead>{t("trading.verified")}</TableHead>
                    <TableHead>{t("trading.action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayTokens.map((token, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-muted/30 cursor-pointer"
                      onClick={() =>
                        router.push(`trading/token?address=${token.address}`)
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={token.logoUrl}
                            alt="token logo"
                            className="size-10 rounded-full"
                          />
                          <p>{token.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{token.symbol}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">{truncateString(token.address, 14)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0"
                            onClick={(e) => handleCopyAddress(token.address, e)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{token.decimals}</TableCell>
                      <TableCell>{token.isVerified ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 dark:bg-blue-900/20 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30"
                          >
                            {t("createCoin.myCoins.tradeButton")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
