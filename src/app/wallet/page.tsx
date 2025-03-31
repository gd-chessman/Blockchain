import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp, Copy, QrCode, RefreshCw, ChevronRight } from "lucide-react"

export default function Wallet() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <Button variant="outline" size="sm" className="mt-2 md:mt-0">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Balance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden border-none shadow-md dark:shadow-blue-900/5 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <p className="text-xs text-green-500 mt-1">+2.5% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md dark:shadow-blue-900/5 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">BTC Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.2345 BTC</div>
            <p className="text-xs text-muted-foreground mt-1">≈ $10,152.34</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md dark:shadow-blue-900/5 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">USDT Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,193.33 USDT</div>
            <p className="text-xs text-muted-foreground mt-1">≈ $2,193.33</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6 border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Assets</CardTitle>
              <CardDescription>Your cryptocurrency holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Asset</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Value (USD)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3 text-orange-600 dark:text-orange-300 font-medium">
                            BTC
                          </div>
                          <div>
                            <div className="font-medium">Bitcoin</div>
                            <div className="text-sm text-muted-foreground">BTC</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>0.2345 BTC</TableCell>
                      <TableCell>$10,152.34</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          >
                            <ArrowDown className="h-4 w-4 mr-1" />
                            Deposit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          >
                            <ArrowUp className="h-4 w-4 mr-1" />
                            Withdraw
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 text-green-600 dark:text-green-300 font-medium">
                            USDT
                          </div>
                          <div>
                            <div className="font-medium">Tether</div>
                            <div className="text-sm text-muted-foreground">USDT</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>2,193.33 USDT</TableCell>
                      <TableCell>$2,193.33</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          >
                            <ArrowDown className="h-4 w-4 mr-1" />
                            Deposit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          >
                            <ArrowUp className="h-4 w-4 mr-1" />
                            Withdraw
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent wallet activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Type</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center justify-center mr-2">
                            <ArrowDown className="h-4 w-4" />
                          </div>
                          <span>Deposit</span>
                        </div>
                      </TableCell>
                      <TableCell>BTC</TableCell>
                      <TableCell>0.05 BTC</TableCell>
                      <TableCell>Mar 15, 2023</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          Completed
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 flex items-center justify-center mr-2">
                            <ArrowUp className="h-4 w-4" />
                          </div>
                          <span>Withdraw</span>
                        </div>
                      </TableCell>
                      <TableCell>USDT</TableCell>
                      <TableCell>500 USDT</TableCell>
                      <TableCell>Mar 12, 2023</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          Completed
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 flex items-center justify-center mr-2">
                            <RefreshCw className="h-4 w-4" />
                          </div>
                          <span>Trade</span>
                        </div>
                      </TableCell>
                      <TableCell>BTC/USDT</TableCell>
                      <TableCell>0.02 BTC</TableCell>
                      <TableCell>Mar 10, 2023</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          Completed
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  View All Transactions
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="deposit">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="mt-4">
              <Card className="border-none shadow-md dark:shadow-blue-900/5">
                <CardHeader>
                  <CardTitle>Deposit Crypto</CardTitle>
                  <CardDescription>Add funds to your wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Asset</label>
                    <Select defaultValue="btc">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="usdt">Tether (USDT)</SelectItem>
                        <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Network</label>
                    <Select defaultValue="btc">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">Bitcoin</SelectItem>
                        <SelectItem value="eth">Ethereum</SelectItem>
                        <SelectItem value="bsc">BSC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 border rounded-md bg-white/50 dark:bg-gray-900/50">
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32 bg-muted flex items-center justify-center rounded-md">
                        <QrCode className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Deposit Address</label>
                      <div className="flex">
                        <Input value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" readOnly className="rounded-r-none" />
                        <Button variant="ghost" size="icon" className="rounded-l-none border border-l-0 border-input">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Only send BTC to this address. Sending any other asset may result in permanent loss.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="withdraw" className="mt-4">
              <Card className="border-none shadow-md dark:shadow-blue-900/5">
                <CardHeader>
                  <CardTitle>Withdraw Crypto</CardTitle>
                  <CardDescription>Send funds to external wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Asset</label>
                    <Select defaultValue="btc">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="usdt">Tether (USDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Network</label>
                    <Select defaultValue="btc">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">Bitcoin</SelectItem>
                        <SelectItem value="eth">Ethereum</SelectItem>
                        <SelectItem value="bsc">BSC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Recipient Address</label>
                    <Input placeholder="Enter wallet address" className="mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <div className="flex mt-1">
                      <Input placeholder="0.00" className="rounded-r-none" />
                      <Button variant="outline" size="sm" className="rounded-l-none border border-l-0 border-input">
                        Max
                      </Button>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Available: 0.2345 BTC</span>
                      <span className="text-xs text-muted-foreground">≈ $10,152.34</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Withdraw</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

