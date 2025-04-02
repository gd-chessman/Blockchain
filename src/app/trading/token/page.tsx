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
import { Pencil, TrendingUp } from "lucide-react";
import { useState } from "react";
import { t } from "@/lang";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";
import TradingChart, {
  generateChartData,
} from "@/components/chart/trading-chart";
import usePercent from "@/hooks/usePercent";

const chartData = generateChartData();

export default function Trading() {
  const [value, setValue] = useState(0);
  const marks = [0, 25, 50, 75, 100];
  const [copySuccess, setCopySuccess] = useState(false);
  const address = "G5XYVieHj6s1aCMjWxwy1iTj4Ek8E8mjSK32Ctk7pump";

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
    navigator.clipboard.writeText(address).then(() => {
      setCopySuccess(true);
      toast.success("Address copied to clipboard!"); // Hiển thị thông báo thành công
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">{t("trading.title")}</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          Market is open • 24h Volume: $1.2B
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
                      Attributes
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-blue-500 hover:text-blue-700"
                    >
                      Value
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-right">Footls Take Over</span>
                    <span className="text-muted-foreground">Symbol:</span>
                    <span className="text-right">FTO</span>
                    <span className="text-muted-foreground">Address:</span>
                    <div className="flex items-center justify-between">
                      <span className="text-right truncate">{address}</span>
                      <button
                        onClick={handleCopy}
                        className="ml-2 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                        title="Copy address"
                      >
                        <Copy className="h-4 w-4 text-blue-500 hover:text-blue-700" />
                      </button>
                    </div>
                    <span className="text-muted-foreground">Decimals:</span>
                    <span className="text-right">9</span>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-right">✓ Verified</span>
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                      (i) => (
                        <div
                          key={i}
                          className={`flex text-sm gap-6 cursor-pointer ${
                            i < 15 ? "border-b-2 pb-2" : ""
                          }`}
                        >
                          <img
                            src="https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045-2.jpg"
                            alt=""
                            className="size-10 rounded-full"
                          />
                          <div>
                            <p>YUP Dog</p>
                            <span>YUP Dog</span>
                          </div>
                          <small className="text-green-600 text-xl ml-auto block">
                            ✓
                          </small>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="mb-6 border-none shadow-md dark:shadow-blue-900/5">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="mb-6 border-none shadow-md dark:shadow-blue-900/5 lg:col-span-2">
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="limit">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="limit">Limit</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="stop">Stop</TabsTrigger>
                  </TabsList>

                  <TabsContent value="limit" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="bg-green-500 hover:bg-green-600">
                        Buy
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        Sell
                      </Button>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Price</label>
                      <div className="flex mt-1">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="rounded-r-none"
                        />
                        <div className="bg-muted px-3 py-2 text-sm rounded-r-md border border-l-0 border-input">
                          USDT
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Amount</label>
                      <div className="flex mt-1">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="rounded-r-none"
                        />
                        <div className="bg-muted px-3 py-2 text-sm rounded-r-md border border-l-0 border-input">
                          BTC
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Percentage</label>
                      <div className="relative mt-2">
                        {/* Thanh trượt */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={value}
                          onChange={(e) => setValue(Number(e.target.value))}
                          className="w-full h-2 cursor-pointer accent-blue-500 bg-transparent appearance-none"
                          style={{
                            WebkitAppearance: "none",
                            borderRadius: "8px" /* Làm tròn thanh */,
                            background: `linear-gradient(to right, #3b82f6 ${value}%, #e5e7eb ${value}%)` /* Màu sắc thanh trượt */,
                          }}
                        />

                        {/* Dấu mốc */}
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

                      {/* Hiển thị giá trị */}
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
                            <Button variant="outline" size="sm" className="w-24">
                              {percent}%
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            // size="xs"
                            className="p-1"
                            onClick={() => handleEditClick(index)}
                          >
                            <Pencil size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Total</label>
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

                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      Buy Now
                    </Button>
                  </TabsContent>

                  <TabsContent value="market" className="space-y-4">
                    {/* Similar structure to limit tab */}
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                      Market order form would appear here
                    </div>
                  </TabsContent>

                  <TabsContent value="stop" className="space-y-4">
                    {/* Similar structure to limit tab */}
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                      Stop order form would appear here
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md dark:shadow-blue-900/5 ">
              <CardHeader>
                <CardTitle>{t("trading.listConnect")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 max-h-svh overflow-auto">
                    <div className="space-y-4">
                      {t("trading.noConnections")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
