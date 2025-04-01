import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart, PieChart, ArrowUp } from "lucide-react"

export default function Dashboard() {
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

