"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart, PieChart, ArrowUp, Loader2 } from "lucide-react"
import { useWsSubscribeTokens } from "@/hooks/useWsSubscribeTokens";
import { useState, useEffect } from "react";
import { SolonaTokenService } from "@/services/api";
import { truncateString } from "@/utils/format";

export default function Dashboard() {
  const { tokenMessages } = useWsSubscribeTokens();
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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          Last updated: March 30, 2023 • Auto-refresh in 30s
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden border-none shadow-md dark:shadow-blue-900/5 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+2.5% from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md dark:shadow-blue-900/5 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>3 profitable</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md dark:shadow-blue-900/5 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234.56</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+5.2% this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Cryptocurrencies</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : tokens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {tokens.map((token, index) => (
              <Card key={index} className="group relative border-none shadow-md dark:shadow-blue-900/5 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <div className="relative w-full">
                  {/* Image container with 4:3 aspect ratio */}
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
                  
                  {/* Content below image */}
                  <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1.5 max-w-[70%]">
                        <CardTitle className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate">
                          {token.name}
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {token.symbol}
                        </CardDescription>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        token.isVerified 
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {token.isVerified ? 'Verified' : 'Unverified'}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="space-y-1">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Address</div>
                          <div className="font-medium text-gray-700 dark:text-gray-300 truncate">
                            {truncateString(token.address, 12)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Decimals</div>
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
          <div className="text-center py-8 text-muted-foreground">
            No tokens available
          </div>
        )}
      </div>

      <Tabs defaultValue="market" className="mb-8">
        <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="market">Market Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="market" className="mt-4">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
              <CardDescription>Top cryptocurrencies by market cap</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-white/50 dark:bg-gray-900/50">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Chart visualization would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="portfolio" className="mt-4">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Your Portfolio</CardTitle>
              <CardDescription>Asset distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-white/50 dark:bg-gray-900/50">
                <PieChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Portfolio distribution would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and trades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-white/50 dark:bg-gray-900/50">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Activity data would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-md dark:shadow-blue-900/5">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Best performing assets in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-300 font-medium">
                      BTC
                    </div>
                    <div>
                      <div className="font-medium">Bitcoin</div>
                      <div className="text-sm text-muted-foreground">BTC</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$43,256.78</div>
                    <div className="text-sm text-green-500">+3.2%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md dark:shadow-blue-900/5">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest wallet activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full ${i % 2 === 0 ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"} flex items-center justify-center mr-3`}
                    >
                      {i % 2 === 0 ? "+" : "-"}
                    </div>
                    <div>
                      <div className="font-medium">{i % 2 === 0 ? "Received" : "Sent"} BTC</div>
                      <div className="text-sm text-muted-foreground">Mar {10 + i}, 2023</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${i % 2 === 0 ? "text-green-500" : "text-red-500"}`}>
                      {i % 2 === 0 ? "+" : "-"}0.{i}5 BTC
                    </div>
                    <div className="text-sm text-muted-foreground">$1,{i}56.78</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

