"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart, PieChart, ArrowUp, Loader2 } from "lucide-react"
import { useWsSubscribeTokens } from "@/hooks/useWsSubscribeTokens";
import { useState, useEffect } from "react";
import { SolonaTokenService } from "@/services/api";
import { truncateString } from "@/utils/format";
import { useLang } from "@/lang/useLang";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { t } = useLang();
  const router = useRouter();
  const { tokenMessages } = useWsSubscribeTokens({limit: 12});
  console.log("Raw tokenMessages:", tokenMessages);
  
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

  // Parse messages and extract tokens
  useEffect(() => {
    console.log("Token messages received:", tokenMessages);
    if (Array.isArray(tokenMessages) && tokenMessages.length > 0) {
      const lastMessage = tokenMessages[tokenMessages.length - 1];
      console.log("Processing last message:", lastMessage);
      
      try {
        const parsedMessage = JSON.parse(lastMessage);
        console.log("Parsed message structure:", parsedMessage);
        
        if (parsedMessage.data && parsedMessage.data.tokens) {
          console.log("Found tokens in message:", parsedMessage.data.tokens);
          const convertedTokens = parsedMessage.data.tokens.map((token: any) => {
            console.log("Processing token:", token);
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
          console.log("Converted tokens:", convertedTokens);
          setTokens(convertedTokens);
          setIsLoading(false);
        } else {
          console.log("No tokens found in message data");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.log("No messages received or messages is not an array");
    }
  }, [tokenMessages]);

  // Fetch initial tokens if WebSocket is not providing data
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        console.log("Fetching tokens from API...");
        const response = await SolonaTokenService.getSearchTokenInfor("");
        console.log("API response:", response);
        if (response && response.tokens) {
          console.log("Setting tokens from API:", response.tokens);
          setTokens(response.tokens);
        } else {
          console.log("No tokens in API response");
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (tokens.length === 0) {
      console.log("No tokens in state, fetching from API");
      fetchTokens();
    }
  }, [tokens.length]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          {t('dashboard.last_updated')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden border-none shadow-md dark:shadow-blue-900/5 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.summary.total_balance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>{t('dashboard.summary.from_yesterday')}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md dark:shadow-blue-900/5 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.summary.active_trades')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>{t('dashboard.summary.profitable')}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md dark:shadow-blue-900/5 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.summary.total_profit')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234.56</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>{t('dashboard.summary.this_week')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">{t('dashboard.cryptocurrencies.title')}</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : tokens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {tokens.map((token, index) => (
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
                        {token.isVerified ? t('dashboard.cryptocurrencies.token.verified') : t('dashboard.cryptocurrencies.token.unverified')}
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
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {t('dashboard.cryptocurrencies.no_tokens')}
          </div>
        )}
      </div>

      <Tabs defaultValue="market" className="mb-8">
        <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="market">{t('dashboard.tabs.market.title')}</TabsTrigger>
          <TabsTrigger value="portfolio">{t('dashboard.tabs.portfolio.title')}</TabsTrigger>
          <TabsTrigger value="activity">{t('dashboard.tabs.activity.title')}</TabsTrigger>
        </TabsList>
        <TabsContent value="market" className="mt-4">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>{t('dashboard.tabs.market.title')}</CardTitle>
              <CardDescription>{t('dashboard.tabs.market.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-white/50 dark:bg-gray-900/50">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">{t('dashboard.tabs.market.placeholder')}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="portfolio" className="mt-4">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>{t('dashboard.tabs.portfolio.title')}</CardTitle>
              <CardDescription>{t('dashboard.tabs.portfolio.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-white/50 dark:bg-gray-900/50">
                <PieChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">{t('dashboard.tabs.portfolio.placeholder')}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>{t('dashboard.tabs.activity.title')}</CardTitle>
              <CardDescription>{t('dashboard.tabs.activity.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-white/50 dark:bg-gray-900/50">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">{t('dashboard.tabs.activity.placeholder')}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

