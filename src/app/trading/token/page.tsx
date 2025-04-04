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
import { Pencil, TrendingUp, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lang";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";
import TradingChart, {
  generateChartData,
} from "@/components/chart/trading-chart";
import usePercent from "@/hooks/usePercent";
import { useRouter, useSearchParams } from "next/navigation";
import { getTokenInforByAddress } from "@/services/api/SolonaTokenService";
import { useQuery } from "@tanstack/react-query";
import { useWsSubscribeTokens } from "@/hooks/useWsSubscribeTokens";
import Link from "next/link";
import { getOrders, getTokenAmount, createTrading } from "@/services/api/TradingService";
import { getInforWallet, getMyTokens } from "@/services/api/TelegramWalletService";
import { useWsGetOrders } from "@/hooks/useWsGetOrders";
import { getMyConnects } from "@/services/api/MasterTradingService";
import { Checkbox } from "@/components/ui/checkbox";

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

export default function Trading() {
  const { t } = useLang();
  const { tokenMessages } = useWsSubscribeTokens();
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
    refetchInterval: 5000,
  });
  const { data: connects = [] } = useQuery({
    queryKey: ["connects"],
    queryFn: getMyConnects,
  });
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedAction, setSelectedAction] = useState<"buy" | "sell">("buy");
  const { data: tokenAmount, refetch: refetchTokenAmount } = useQuery({
    queryKey: ["tokenAmount", address, activeTab, selectedAction],
    queryFn: () => getTokenAmount(selectedAction === "buy" ? "So11111111111111111111111111111111111111112" : address),
  });
  const [checkedConnections, setCheckedConnections] = useState<Record<number, boolean>>({});

  // console.log("orderMessages", orderMessages);
  const marks = [0, 25, 50, 75, 100];
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address).then(() => {
        setCopySuccess(true);
        toast.success("Address copied to clipboard!"); // Hiển thị thông báo thành công
      });
    } else {
      toast.error("Address is not available to copy!");
    }
  };

  useEffect(() => {
    refetchTokenAmount();
  }, [activeTab, selectedAction, refetchTokenAmount]);

  const handleActionClick = (action: "buy" | "sell") => {
    setSelectedAction(action);
    setValue(0); // Reset percentage when switching actions
  };

  useEffect(() => {
    // Initialize checked state to false for all connections
    const initialCheckedState = connects.reduce((acc: Record<number, boolean>, connect: Connect) => {
      acc[connect.connection_id] = false;
      return acc;
    }, {});
    setCheckedConnections(initialCheckedState);
  }, [connects]);

  const handleCheckboxChange = (connectionId: number) => {
    setCheckedConnections(prev => ({
      ...prev,
      [connectionId]: !prev[connectionId]
    }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAmount(newValue);
    
    // Tính toán phần trăm dựa trên số lượng nhập vào
    if (tokenAmount?.data?.token_balance) {
      let percentage = (Number(newValue) / tokenAmount.data.token_balance) * 100;
      // Nếu là bán và đang ở 100%, giữ lại 0.1% làm phí
      if (selectedAction === "sell" && percentage >= 99.9) {
        percentage = 99.9;
        setAmount((tokenAmount.data.token_balance * 0.999).toFixed(5));
      }
      setValue(Math.min(100, Math.max(0, percentage)));
    }
  };

  const handleValueChange = (newValue: number) => {
    setValue(newValue);
    // Tính toán số lượng dựa trên phần trăm
    if (tokenAmount?.data?.token_balance) {
      let calculatedAmount = tokenAmount.data.token_balance * (newValue / 100);
      // Nếu là bán và đang ở 100%, giữ lại 0.1% làm phí
      if (selectedAction === "sell" && newValue >= 99.9) {
        calculatedAmount = tokenAmount.data.token_balance * 0.999;
        setValue(99.9);
      }
      setAmount(calculatedAmount.toFixed(5));
    }
  };

  const handleTrading = async () => {
    try {
      const selectedMembers = Object.entries(checkedConnections)
        .filter(([_, isChecked]) => isChecked)
        .map(([connectionId]) => {
          const connect = connects.find((c: Connect) => c.connection_id === Number(connectionId));
          return connect?.member_id;
        })
        .filter(Boolean);

      const response = await createTrading({
        order_trade_type: selectedAction,
        order_type: "market",
        order_token_name: tokenInfor?.name || "No name",
        order_token_address: address || "",
        order_price: 1.05,
        order_qlty: Number(amount),
        member_list: selectedMembers
      });

      if (response.status === 201) {
        // Reset form
        setValue(0);
        setAmount("");
        setCheckedConnections({});
        
        // Fetch lại tất cả dữ liệu
        refetchOrders(); // Cập nhật lịch sử giao dịch
        refetchTokenAmount(); // Cập nhật số dư
        refetch(); // Cập nhật thông tin token
      } else {
        toast.error("Failed to create trading order");
      }
    } catch (error) {
      console.error("Trading error:", error);
      toast.error("An error occurred while creating the trading order");
    }
  };

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
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 max-h-[64vh] overflow-auto">
                  <div className="space-y-4">
                    {tokens.map((token, index) => (
                      <Link
                        key={index} // Assuming token has an 'id' field
                        className={`flex text-sm gap-6 cursor-pointer ${
                          index < tokens.length - 1 ? "border-b-2 pb-2" : ""
                        }`}
                        href={`/trading/token?address=${token.slt_address}`}
                      >
                        <img
                          src={token.slt_logo_url}
                          alt=""
                          className="size-10 rounded-full"
                        />
                        <div>
                          <p>{token.slt_name}</p>{" "}
                          <p className="text-muted-foreground text-xs">
                            {token.slt_symbol}
                          </p>{" "}
                        </div>
                        <small className="text-green-600 text-xl ml-auto block">
                          {token.slt_is_verified ? " ✓" : "x"}
                        </small>
                      </Link>
                    ))}
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
                    <CardTitle>BTC/USDT</CardTitle>
                    <CardDescription>Bitcoin to Tether</CardDescription>
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
              <CardTitle>My Coins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 max-h-[26rem] overflow-auto">
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
                      className={`${selectedAction === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}`}
                      onClick={() => handleActionClick("buy")}
                    >
                      {t("trading.buy")}
                    </Button>
                    <Button
                      variant="outline"
                      className={`${selectedAction === "sell" ? "text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" : "text-gray-500 border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-950/30"}`}
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
                        Balance: {tokenAmount?.data?.token_balance?.toFixed(5) || 0} {selectedAction === "buy" ? "SOL" : tokenInfor?.symbol}
                        {selectedAction === "sell" && value >= 99.9 && (
                          <span className="text-yellow-500 ml-2">(0.1% reserved for network fee)</span>
                        )}
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
                      <div className="bg-muted px-3 py-2 text-sm rounded-r-md border border-l-0 border-input">
                        {value}%
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
                      {value}%
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

                  <div>
                    <label className="text-sm font-medium">
                      {t("trading.total")}
                    </label>
                    <div className="flex mt-1">
                      <Input
                        type="number"
                        placeholder="0.00"
                        disabled
                        className="rounded-r-none"
                      />
                      <div className="bg-muted px-3 py-2 text-sm rounded-r-md border border-l-0 border-input">
                        USDT
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={handleTrading}
                  >
                    {selectedAction === "buy" ? t("trading.buyNow") : t("trading.sellNow")}
                  </Button>
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
                              </div>
                              <Checkbox 
                                checked={checkedConnections[connect.connection_id]}
                                onCheckedChange={() => handleCheckboxChange(connect.connection_id)}
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
                    {orders?.map((order: Order, index: number) => (
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
                        <td className="py-3 uppercase text-blue-600">
                          {t(`trading.${order.status}`)}
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
    </div>
  );
}
