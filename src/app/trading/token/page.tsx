"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, TrendingUp, Check, X, Loader2, Search } from "lucide-react";
import { useEffect, useState, useRef, Suspense } from "react";
import { useLang } from "@/lang";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";
import TradingChart, {
  generateChartData,
} from "@/components/chart/trading-chart";
import usePercent from "@/hooks/usePercent";
import { useRouter, useSearchParams } from "next/navigation";
import { getTokenInforByAddress } from "@/services/api/SolonaTokenService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWsSubscribeTokens } from "@/hooks/useWsSubscribeTokens";
import Link from "next/link";
import { getOrders, getTokenAmount, createTrading } from "@/services/api/TradingService";
import { getInforWallet, getMyTokens } from "@/services/api/TelegramWalletService";
import { useWsGetOrders } from "@/hooks/useWsGetOrders";
import { getMyConnects, getMyGroups } from "@/services/api/MasterTradingService";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounce } from "@/hooks/useDebounce";
import { SolonaTokenService } from "@/services/api";
import Select from 'react-select';
import LogWarring from "@/components/ui/log-warring";
import { useAuth } from "@/hooks/useAuth";
import { ToastNotification } from "@/components/ui/toast";

interface Order {
  created_at: string;
  trade_type: "buy" | "sell";
  price: number;
  quantity: number;
  status: "pending" | "completed" | "cancelled";
}

interface Connect {
  connection_id: number;
  member_id: number;
  member_address: string;
  status: string;
  option_limit: string;
  price_limit: string;
  ratio_limit: number;
  joined_groups: Array<{
    group_id: number;
    group_name: string;
  }>;
}

const chartData = generateChartData();

function TradingContent() {
  const { t } = useLang();
  const { isAuthenticated } = useAuth();
  const { tokenMessages } = useWsSubscribeTokens();
  const queryClient = useQueryClient();
  const [tokens, setTokens] = useState<
    {
      slt_name: string;
      slt_address: string;
      slt_symbol: string;
      slt_decimals: number;
      slt_is_verified: boolean;
      slt_logo_url: string;
    }[]
  >([]);
  const [value, setValue] = useState(0);
  const [amount, setAmount] = useState<string>("");

  const searchParams = useSearchParams();
  const address = searchParams?.get("address");
  const { data: tokenInfor, refetch } = useQuery({
    queryKey: ["token-infor", address],
    queryFn: () => getTokenInforByAddress(address),
  });
  const { data: memeCoins = [] , } = useQuery({
    queryKey: ['my-tokens'],
    queryFn: getMyTokens,
  });
  const { data: orders, refetch: refetchOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: ()=> getOrders(address),
    // refetchInterval: 5000,
  });
  const { data: connects = [] } = useQuery({
    queryKey: ["connects"],
    queryFn: getMyConnects,
  });
  const { data: groupsResponse } = useQuery({
    queryKey: ["groups"],
    queryFn: getMyGroups,
  });
  const { data: walletInfor, refetch: refetchWalletInfor } = useQuery({
    queryKey: ["wallet-infor"],
    queryFn: getInforWallet,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedAction, setSelectedAction] = useState<"buy" | "sell">("buy");
  const { data: tokenAmount, refetch: refetchTokenAmount } = useQuery({
    queryKey: ["tokenAmount", address, activeTab, selectedAction],
    queryFn: () => getTokenAmount(address),
  });
  const [checkedConnections, setCheckedConnections] = useState<Record<number, boolean>>({});
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  // console.log("orderMessages", orderMessages);
  const marks = [0, 25, 50, 75, 100];
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 100); // 2 seconds delay
  const [isSearching, setIsSearching] = useState(false);
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
  const displayTokens = debouncedSearchQuery.trim() ? searchResults : tokens.map(token => ({
    id: 0,
    name: token.slt_name,
    symbol: token.slt_symbol,
    address: token.slt_address,
    decimals: token.slt_decimals,
    logoUrl: token.slt_logo_url,
    coingeckoId: null,
    tradingviewSymbol: null,
    isVerified: token.slt_is_verified,
    marketCap: 0
  }));

  useEffect(() => {
    if (Array.isArray(tokenMessages)) {
      tokenMessages.forEach((message) => {
        try {
          const parsedMessage = JSON.parse(message);
          setTokens(parsedMessage.data.tokens);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    } else {
      console.error("messages is not an array:", tokenMessages);
    }
  }, [tokenMessages]);

  const handleTimeframeChange = (timeframe: string) => {
    console.log(`Timeframe changed to: ${timeframe}`);
    // Trong ứng dụng thực tế, bạn sẽ tải dữ liệu mới dựa trên khung thời gian
  };
  const { percentages, setPercentage } = usePercent();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setTempValue(percentages[index]);
  };

  const handleSave = (index: number) => {
    if (tempValue.trim()) {
      setPercentage(index, tempValue);
    }
    setEditingIndex(null);
  };

  const [showToast, setShowToast] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address).then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
    }
  };

  useEffect(() => {
    refetchTokenAmount();
  }, [activeTab, selectedAction, refetchTokenAmount]);

  const handleActionClick = (action: "buy" | "sell") => {
    if (selectedAction !== action) {
      setSelectedAction(action);
      setValue(0); // Reset percentage when switching actions
      setAmount(""); // Reset amount when switching actions
      // Reset all checkboxes to false using the same pattern as initialization
      const resetCheckedState = connects.reduce((acc: Record<number, boolean>, connect: Connect) => {
        acc[connect.connection_id] = false;
        return acc;
      }, {});
      setCheckedConnections(resetCheckedState);
      setSelectedMembers([]); // Reset selected members list
    }
  };

  useEffect(() => {
    // Initialize checked state to false for all connections
    const initialCheckedState = connects.reduce((acc: Record<number, boolean>, connect: Connect) => {
      acc[connect.connection_id] = false;
      return acc;
    }, {});
    setCheckedConnections(initialCheckedState);
  }, [connects]);

  const handleCheckboxChange = (connectionId: number, memberId: number) => {
    setCheckedConnections(prev => ({
      ...prev,
      [connectionId]: !prev[connectionId]
    }));

    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAmount(newValue);
    
    // Tính toán phần trăm dựa trên số lượng nhập vào
    if (tokenAmount?.data?.token_balance) {
      let percentage = (Number(newValue) / tokenAmount.data.token_balance) * 100;
      // Nếu là bán và đang ở 100%, giữ lại 0.1% làm phí
      if (selectedAction === "sell" && percentage >= 99.999) {
        percentage = 99.999;
        setAmount((tokenAmount.data.token_balance * 0.99999).toFixed(5));
      }
      setValue(Math.min(100, Math.max(0, percentage)));
    }
  };

  const handleValueChange = (newValue: number) => {
    setValue(newValue);
    // Tính toán số lượng dựa trên phần trăm và action hiện tại
    if (selectedAction === "buy" && tokenAmount?.data?.sol_balance) {
      const calculatedAmount = (tokenAmount.data.sol_balance * newValue) / 100;
      setAmount(calculatedAmount.toFixed(5));
    } else if (selectedAction === "sell" && tokenAmount?.data?.token_balance) {
      let calculatedAmount = (tokenAmount.data.token_balance * newValue) / 100;
      // Nếu là bán và đang ở 100%, giữ lại 0.1% làm phí
      if (newValue >= 99.999) {
        calculatedAmount = tokenAmount.data.token_balance * 0.99999;
        setValue(99.999);
      }
      setAmount(calculatedAmount.toFixed(5));
    }
  };

  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const currentPendingOrderRef = useRef<Order | null>(null);

  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (tokenAmount?.data) {
      setBalance(selectedAction === "buy" ? tokenAmount.data.sol_balance : tokenAmount.data.token_balance);
    }
  }, [tokenAmount, selectedAction]);

  const handleTrading = async () => {
    try {
      // Reset form and member list immediately when button is clicked
      setSelectedMembers([]);
      // Reset all checkboxes to false using the same pattern as initialization
      const resetCheckedState = connects.reduce((acc: Record<number, boolean>, connect: Connect) => {
        acc[connect.connection_id] = false;
        return acc;
      }, {});
      setCheckedConnections(resetCheckedState);
      setValue(0);
      setAmount("");
      setSelectedGroups([]); // Reset selected groups

      // Add pending order to local state
      const newPendingOrder: Order = {
        created_at: new Date().toISOString(),
        trade_type: selectedAction,
        price: 0.005,
        quantity: Number(amount),
        status: "pending"
      };
      currentPendingOrderRef.current = newPendingOrder;
      setPendingOrders(prev => [...prev, newPendingOrder]);

      const response = await createTrading({
        order_trade_type: selectedAction,
        order_type: "market",
        order_token_name: tokenInfor?.name || "No name",
        order_token_address: address || "",
        order_price: 0.005,
        order_qlty: Number(amount),
        member_list: selectedMembers
      });

      if (response.status === 201) {
        // Fetch lại tất cả dữ liệu
        const [ordersResult, tokenAmountResult, tokenInforResult, walletResult] = await Promise.all([
          refetchOrders(), // Cập nhật lịch sử giao dịch
          refetchTokenAmount(), // Cập nhật số dư
          refetch(), // Cập nhật thông tin token
          refetchWalletInfor(), // Cập nhật số dư SOL ở header
        ]);

        // Force update UI with new data
        if (tokenAmountResult.data?.data) {
          queryClient.setQueryData(
            ["tokenAmount", address, activeTab, selectedAction],
            tokenAmountResult.data
          );
          
          // Lưu balance hiện tại để so sánh
          const currentBalance = selectedAction === "buy" ? tokenAmountResult.data.data.sol_balance : tokenAmountResult.data.data.token_balance;
          
          // Delay 3s trước khi bắt đầu polling
          setTimeout(() => {
            let pollingInterval: NodeJS.Timeout;
            
            const pollBalance = async () => {
              try {
                const newTokenAmountResult = await refetchTokenAmount();
                
                if (newTokenAmountResult.data) {
                  const newBalance = selectedAction === "buy" ? newTokenAmountResult.data.data.sol_balance : newTokenAmountResult.data.data.token_balance;
                  
                  // Nếu balance thay đổi, cập nhật và dừng polling
                  if (newBalance !== currentBalance) {
                    setBalance(newBalance);
                    clearInterval(pollingInterval);
                  }
                }
              } catch (error) {
                console.error("Error during polling:", error);
              }
            };
            
            // Thực hiện polling ngay lập tức
            pollBalance();
            
            // Sau đó set interval để polling mỗi 2 giây
            pollingInterval = setInterval(pollBalance, 2000);
            
            // Cleanup interval on component unmount
            return () => {
              if (pollingInterval) {
                clearInterval(pollingInterval);
              }
            };
          }, 3000);
        }

        if (walletResult.data?.data) {
          queryClient.setQueryData(
            ["wallet-infor"],
            walletResult.data
          );
        }

        // Remove pending order after successful API call
        if (currentPendingOrderRef.current) {
          setPendingOrders(prev => prev.filter(order => order.created_at !== currentPendingOrderRef.current?.created_at));
          currentPendingOrderRef.current = null;
        }
      } else {
        toast.error("Failed to create trading order");
        // Remove pending order on error
        if (currentPendingOrderRef.current) {
          setPendingOrders(prev => prev.filter(order => order.created_at !== currentPendingOrderRef.current?.created_at));
          currentPendingOrderRef.current = null;
        }
      }
    } catch (error) {
      console.error("Trading error:", error);
      toast.error("An error occurred while creating the trading order");
      // Remove pending order on error
      if (currentPendingOrderRef.current) {
        setPendingOrders(prev => prev.filter(order => order.created_at !== currentPendingOrderRef.current?.created_at));
        currentPendingOrderRef.current = null;
      }
    }
  };

  // Add useEffect to refetch data when address changes
  useEffect(() => {
    if (address) {
      refetch();
      refetchOrders();
      refetchTokenAmount();
    }
  }, [address, refetch, refetchOrders, refetchTokenAmount]);

  const [selectedGroups, setSelectedGroups] = useState<{ value: number; label: string }[]>([]);

  const groupOptions = ((groupsResponse as any)?.data || [])
    .filter((group: any) => group.mg_status === "on")
    .map((group: any) => ({
      value: group.mg_id,
      label: group.mg_name
    }));

  const handleGroupChange = (selectedOptions: any) => {
    setSelectedGroups(selectedOptions);
    
    // Get all member IDs from selected groups
    const newSelectedMembers: number[] = [];
    const newCheckedConnections: Record<number, boolean> = { ...checkedConnections };
    
    // Reset all checkboxes to false
    Object.keys(newCheckedConnections).forEach(key => {
      newCheckedConnections[Number(key)] = false;
    });
    
    // For each selected group, find and select its members
    selectedOptions.forEach((option: any) => {
      const group = ((groupsResponse as any)?.data || []).find((g: any) => g.mg_id === option.value);
      if (group) {
        // Find all connects that belong to this group
        const groupConnects = connects.filter((connect: Connect) => 
          connect.joined_groups.some(g => g.group_id === group.mg_id)
        );
        
        // Add these members to selected members and check their checkboxes
        groupConnects.forEach((connect: Connect) => {
          newSelectedMembers.push(connect.member_id);
          newCheckedConnections[connect.connection_id] = true;
        });
      }
    });
    
    setSelectedMembers(newSelectedMembers);
    setCheckedConnections(newCheckedConnections);
  };

    if(!isAuthenticated) return <LogWarring />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">{t("trading.title")}</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          {t("trading.marketIsOpen")} • 24h Volume: $1.2B
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>{t("trading.tokenInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-md bg-white/50 dark:bg-gray-900/50">
                  <div className="flex justify-between mb-6">
                    <span className={`text-sm font-medium text-green-500`}>
                      {t("trading.attributes")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-blue-500 hover:text-blue-700"
                    >
                      {t("trading.value")}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {t("trading.name")}:
                    </span>
                    <span className="text-right">{tokenInfor?.name}</span>
                    <span className="text-muted-foreground">
                      {t("trading.symbol")}:
                    </span>
                    <span className="text-right">{tokenInfor?.symbol}</span>
                    <span className="text-muted-foreground">
                      {t("trading.address")}:
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-right truncate">{address}</span>
                      <button
                        onClick={handleCopy}
                        className="ml-2 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                        title={t("trading.copyAddress")}
                      >
                        <Copy className="h-4 w-4 text-blue-500 hover:text-blue-700" />
                      </button>
                    </div>
                    <span className="text-muted-foreground">
                      {t("trading.decimals")}:
                    </span>
                    <span className="text-right">{tokenInfor?.decimals}</span>
                    <span className="text-muted-foreground">
                      {t("trading.verified")}:
                    </span>
                    <span className="text-right text-green-600">
                      {tokenInfor?.isVerified ? "✓" : "x"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md dark:shadow-blue-900/5">
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
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50">
                  <div className="max-h-[64vh] overflow-auto">
                    <div className="space-y-4">
                      {displayTokens.map((token, index) => (
                        <Link
                          key={index}
                          className={`flex text-sm gap-6 cursor-pointer ${
                            index < displayTokens.length - 1 ? "border-b-2 pb-2" : ""
                          }`}
                          href={`/trading/token?address=${token.address}`}
                        >
                          <img
                            src={token.logoUrl}
                            alt=""
                            className="size-10 rounded-full"
                          />
                          <div>
                            <p>{token.name}</p>{" "}
                            <p className="text-muted-foreground text-xs">
                              {token.symbol}
                            </p>{" "}
                          </div>
                          <small className="text-green-600 text-xl ml-auto block">
                            {token.isVerified ? " ✓" : "x"}
                          </small>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="mb-6 border-none shadow-md dark:shadow-blue-900/5 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{tokenInfor?.symbol}/SOL</CardTitle>
                    <CardDescription>{tokenInfor?.name}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$43,256.78</div>
                    <div className="text-sm text-green-500">+3.2% (24h)</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TradingChart
                  data={chartData}
                  symbol="BTC/USDT"
                  onTimeframeChange={handleTimeframeChange}
                />
              </CardContent>
            </Card>
            <Card className="border-none shadow-md dark:shadow-blue-900/5 mb-6">
            <CardHeader>
              <CardTitle>{t("trading.myCoins")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 max-h-[26rem] overflow-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent">
                  <div className="space-y-4">
                    {memeCoins.map((token: any, index: any) => (
                      <Link
                        key={index} // Assuming token has an 'id' field
                        className={`flex text-sm gap-6 cursor-pointer ${
                          index < tokens.length - 1 ? "border-b-2 pb-2" : ""
                        }`}
                        href={`/trading/token?address=${token.address}`}
                      >
                        <img
                          src={token.logo_url}
                          alt=""
                          className="size-10 rounded-full"
                        />
                        <div>
                          <p>{token.name}</p>{" "}
                          <p className="text-muted-foreground text-xs">
                            {token.symbol}
                          </p>{" "}
                        </div>
                        <small className="text-green-600 text-xl ml-auto block">
                          {token.is_verified ? " ✓" : "x"}
                        </small>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-md dark:shadow-blue-900/5 lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("trading.placeOrder")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className={`${selectedAction === "buy" ? "bg-green-100 text-green-600 hover:bg-green-200 border border-green-500 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 dark:border-green-500 dark:hover:shadow-lg dark:hover:shadow-green-500/20 dark:hover:-translate-y-0.5 transition-all duration-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`}
                      onClick={() => handleActionClick("buy")}
                    >
                      {t("trading.buy")}
                    </Button>
                    <Button
                      className={`${selectedAction === "sell" ? "bg-red-100 text-red-600 hover:bg-red-200 border border-red-500 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 dark:border-red-500 dark:hover:shadow-lg dark:hover:shadow-red-500/20 dark:hover:-translate-y-0.5 transition-all duration-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`}
                      onClick={() => handleActionClick("sell")}
                    >
                      {t("trading.sell")}
                    </Button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        {t("trading.amount")}
                      </label>
                      <span className="text-sm text-muted-foreground">
                        Balance: {balance.toFixed(5)} {selectedAction === "buy" ? "SOL" : tokenInfor?.symbol}
                      </span>
                    </div>
                    <div className="flex mt-1">
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="rounded-r-none"
                        value={amount}
                        onChange={handleAmountChange}
                        min={0}
                        max={tokenAmount?.data?.token_balance}
                      />
                      <div className="bg-muted px-3 py-2 text-sm rounded-r-md border border-l-0 border-input min-w-20">
                        {value.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      {t("trading.percentage")}
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={value}
                        onChange={(e) => handleValueChange(Number(e.target.value))}
                        className="w-full h-2 cursor-pointer accent-blue-500 bg-transparent appearance-none"
                        style={{
                          WebkitAppearance: "none",
                          borderRadius: "8px",
                          background: `linear-gradient(to right, #3b82f6 ${value}%, #e5e7eb ${value}%)`,
                        }}
                      />

                      <div className="relative flex justify-between text-xs text-muted-foreground mt-2 px-1">
                        {marks.map((mark) => (
                          <div
                            key={mark}
                            className="relative flex flex-col items-center w-0"
                          >
                            <span>{mark}</span>
                            <span className="absolute top-[-6px] w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center text-sm mt-2 font-semibold text-blue-600">
                      {value.toFixed(2)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {percentages.map((percent, index) => (
                      <div
                        key={index}
                        className="relative flex items-center gap-1"
                      >
                        {editingIndex === index ? (
                          <Input
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={() => handleSave(index)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSave(index)
                            }
                            autoFocus
                            type="number"
                            min={0}
                            max={100}
                            className="w-24"
                          />
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-24"
                            onClick={() => handleValueChange(Number(percent))}
                          >
                            {percent}%
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="p-1"
                          onClick={() => handleEditClick(index)}
                        >
                          <Pencil size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50">
                      <h3 className="text-sm font-medium mb-2">{t("trading.selectGroups")}</h3>
                      <Select
                        isMulti
                        options={groupOptions}
                        value={selectedGroups}
                        onChange={handleGroupChange}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder={t("trading.selectGroupsPlaceholder")}
                        noOptionsMessage={() => t("trading.noGroupsAvailable")}
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--input))',
                            color: 'hsl(var(--foreground))',
                            '&:hover': {
                              borderColor: 'hsl(var(--input))',
                            },
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: 'hsl(var(--background))',
                            color: 'hsl(var(--foreground))',
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected 
                              ? 'hsl(var(--primary))' 
                              : state.isFocused 
                                ? 'hsl(var(--accent))' 
                                : 'transparent',
                            color: state.isSelected 
                              ? document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                              : 'hsl(var(--foreground))',
                            '&:hover': {
                              backgroundColor: 'hsl(var(--accent))',
                              color: 'hsl(var(--foreground))',
                            },
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: 'hsl(var(--primary))',
                            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                            borderRadius: '0.375rem',
                            padding: '0.125rem 0.25rem',
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            padding: '0.125rem 0.25rem',
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                            padding: '0.125rem 0.25rem',
                            ':hover': {
                              backgroundColor: 'hsl(var(--destructive))',
                              color: 'white',
                            },
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: 'hsl(var(--foreground))',
                            fontSize: '0.875rem',
                          }),
                          input: (base) => ({
                            ...base,
                            color: 'hsl(var(--foreground))',
                            fontSize: '0.875rem',
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: 'hsl(var(--muted-foreground))',
                            fontSize: '0.875rem',
                          }),
                          menuList: (base) => ({
                            ...base,
                            color: 'hsl(var(--foreground))',
                          }),
                          noOptionsMessage: (base) => ({
                            ...base,
                            color: 'hsl(var(--muted-foreground))',
                          }),
                        }}
                      />
                    </div>

                    <Button 
                      className={`w-full ${
                        selectedAction === "buy" 
                          ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 dark:hover:shadow-lg dark:hover:shadow-green-500/20 dark:hover:-translate-y-0.5 transition-all duration-200" 
                          : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 dark:hover:shadow-lg dark:hover:shadow-red-500/20 dark:hover:-translate-y-0.5 transition-all duration-200"
                      }`}
                      onClick={handleTrading}
                      disabled={!amount || Number(amount) <= 0}
                    >
                      {selectedAction === "buy" ? t("trading.buyNow") : t("trading.sellNow")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md dark:shadow-blue-900/5">
              <CardHeader>
                <CardTitle>{t("trading.listConnect")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 max-h-svh overflow-auto">
                    <div className="space-y-4">
                      {connects.filter((connect: Connect) => connect.status === "connect").length > 0 ? (
                        connects
                          .filter((connect: Connect) => connect.status === "connect")
                          .map((connect: Connect, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 border-b">
                              <div className="flex items-center gap-2">
                                <div>
                                  <p className="text-sm font-medium">
                                    {connect.member_address.slice(0, 4)}...{connect.member_address.slice(-4)}
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(connect.member_address).then(() => {
                                      setShowToast(true);
                                      setTimeout(() => setShowToast(false), 3000);
                                    });
                                  }}
                                  className="ml-2 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                                  title="Copy address"
                                >
                                  <Copy className="h-4 w-4 text-blue-500 hover:text-blue-700" />
                                </button>
                              </div>
                              <Checkbox 
                                checked={checkedConnections[connect.connection_id]}
                                onCheckedChange={() => handleCheckboxChange(connect.connection_id, connect.member_id)}
                                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                              />
                            </div>
                          ))
                      ) : (
                        <div className="text-center text-muted-foreground">
                          {t("trading.noConnections")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>{t("trading.historyTransactions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-muted-foreground border-b">
                      <th className="text-left py-3">{t("trading.time")}</th>
                      <th className="text-left py-3">{t("trading.type")}</th>
                      <th className="text-left py-3">{t("trading.price")}</th>
                      <th className="text-left py-3">{t("trading.amount")}</th>
                      <th className="text-left py-3">{t("trading.total")}</th>
                      <th className="text-left py-3">{t("trading.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...pendingOrders, ...(orders || [])].map((order: Order, index: number) => (
                      <tr key={index} className="text-sm border-b">
                        <td className="py-3">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span
                            className={
                              order.trade_type === "buy"
                                ? "text-green-500 uppercase"
                                : "text-red-500 uppercase"
                            }
                          >
                            {t(`trading.${order.trade_type}`)}
                          </span>
                        </td>
                        <td className="py-3">${order.price}</td>
                        <td className="py-3">{order.quantity}</td>
                        <td className="py-3">
                          ${(order.price * order.quantity).toFixed(8) || ""}
                        </td>
                        <td className="py-3 uppercase">
                          <span className={order.status === "pending" ? "text-yellow-500" : "text-blue-600"}>
                            {t(`trading.${order.status}`)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showToast && (
        <ToastNotification 
          message={t("notifications.addressCopied")}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

export default function Trading() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TradingContent />
    </Suspense>
  );
}
