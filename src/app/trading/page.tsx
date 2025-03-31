import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp } from "lucide-react"

export default function Trading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Trading</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">Market is open • 24h Volume: $1.2B</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
              <div className="h-[400px] border rounded-md flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
                <TrendingUp className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Trading chart would appear here</span>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-4">
                {["1H", "4H", "1D", "1W", "1M"].map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant="outline"
                    size="sm"
                    className={
                      timeframe === "1D"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        : ""
                    }
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Market Depth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50">
                  <h3 className="font-medium mb-2 text-green-500">Buy Orders</h3>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>${(43256 - i * 10).toLocaleString()}.78</span>
                        <span>0.{i}5 BTC</span>
                        <span>${(43256 - i * 10) * 0.15}.00</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50">
                  <h3 className="font-medium mb-2 text-red-500">Sell Orders</h3>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>${(43256 + i * 10).toLocaleString()}.78</span>
                        <span>0.{i}5 BTC</span>
                        <span>${(43256 + i * 10) * 0.15}.00</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6 border-none shadow-md dark:shadow-blue-900/5">
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
                    <Button className="bg-green-500 hover:bg-green-600">Buy</Button>
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
                      <Input type="number" placeholder="0.00" className="rounded-r-none" />
                      <div className="bg-muted px-3 py-2 text-sm rounded-r-md border border-l-0 border-input">USDT</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <div className="flex mt-1">
                      <Input type="number" placeholder="0.00" className="rounded-r-none" />
                      <div className="bg-muted px-3 py-2 text-sm rounded-r-md border border-l-0 border-input">BTC</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {["25%", "50%", "75%", "100%"].map((percent) => (
                      <Button key={percent} variant="outline" size="sm">
                        {percent}
                      </Button>
                    ))}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Total</label>
                    <div className="flex mt-1">
                      <Input type="number" placeholder="0.00" disabled className="rounded-r-none" />
                      <div className="bg-muted px-3 py-2 text-sm rounded-r-md border border-l-0 border-input">USDT</div>
                    </div>
                  </div>

                  <Button className="w-full bg-green-500 hover:bg-green-600">Buy BTC</Button>
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

          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Open Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-3 border rounded-md bg-white/50 dark:bg-gray-900/50">
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm font-medium ${i % 2 === 0 ? "text-green-500" : "text-red-500"}`}>
                        {i % 2 === 0 ? "Buy" : "Sell"} Limit
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 text-red-500 hover:text-red-700">
                        Cancel
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="text-right">${(43256 + i * 100).toLocaleString()}</span>
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="text-right">0.{i}5 BTC</span>
                      <span className="text-muted-foreground">Total:</span>
                      <span className="text-right">${(43256 + i * 100) * 0.15}</span>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-center p-4 border border-dashed rounded-md text-muted-foreground text-sm">
                  No more open orders
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

