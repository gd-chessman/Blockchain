"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { t } from "@/lang"
import { useQuery } from "@tanstack/react-query"
import { getMasters } from "@/services/api/MasterTradingService"

export default function MasterTrade() {
  const { data: masterTraders } = useQuery({
    queryKey: ['master-trading/masters'],
    queryFn: getMasters,
  });
  const [activeTab, setActiveTab] = useState("not-connected")
  const [searchQuery, setSearchQuery] = useState("")
  // Lọc master traders dựa trên tab đang active và từ khóa tìm kiếm
  // const filteredTraders = masterTraders.filter((trader: any) => {
  //   const matchesSearch = trader.eth_address.toLowerCase().includes(searchQuery.toLowerCase())

  //   switch (activeTab) {
  //     case "not-connected":
  //       return matchesSearch && trader.status === "Not Connected"
  //     case "connected":
  //       return matchesSearch && trader.status === "Connected"
  //     case "disconnected":
  //       return matchesSearch && trader.status === "Disconnected"
  //     case "pending":
  //       return matchesSearch && trader.status === "Pending"
  //     default:
  //       return matchesSearch
  //   }
  // })

  const handleConnect = (traderId: number) => {
    console.log(`Connecting to trader with ID: ${traderId}`)
    // Xử lý logic kết nối ở đây
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    // Có thể thêm thông báo toast ở đây
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">{t('masterTrade.availableMasters')}</h1>
        <div className="relative w-full md:w-auto mt-4 md:mt-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('masterTrade.searchPlaceholder')}
            className="pl-10 w-full md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="not-connected" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="not-connected">Not Connected (5)</TabsTrigger>
          <TabsTrigger value="connected">Connected (0)</TabsTrigger>
          <TabsTrigger value="disconnected">Disconnected (0)</TabsTrigger>
          <TabsTrigger value="pending">Pending (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="not-connected">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[300px]">Wallet Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {masterTraders?.map((trader: any) => (
                      <TableRow key={trader.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          <div className=" w-64 truncate">
                            {trader.solana_address}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 ml-2"
                              onClick={() => handleCopyAddress(trader.eth_address)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={trader.type === "VIP" ? "default" : "outline"}
                            className={trader.type === "VIP" ? "bg-purple-500 hover:bg-purple-600" : ""}
                          >
                            {trader.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">{trader.connection_status}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            className="border-primary border-solid border-2 text-white"
                            onClick={() => handleConnect(trader.id)}
                          >
                            Connect
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connected">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Connected Masters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                No connected masters found
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disconnected">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Disconnected Masters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                No disconnected masters found
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Pending Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                No pending connections found
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

