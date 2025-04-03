"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lang";
import { useQuery } from "@tanstack/react-query";
import { getMasters } from "@/services/api/MasterTradingService";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { MasterTradingService } from "@/services/api";

export default function MasterTrade() {
  const { data: masterTraders } = useQuery({
    queryKey: ["master-trading/masters"],
    queryFn: getMasters,
  });
  const [activeTab, setActiveTab] = useState("not-connected");
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<any>(null);
  const [maxCopyAmount, setMaxCopyAmount] = useState("0.1");
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");

  // Lọc master traders dựa trên tab đang active và từ khóa tìm kiếm
  const filteredTraders = masterTraders?.filter((trader: any) => {
    const matchesSearch = trader.eth_address
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    switch (activeTab) {
      case "not-connected":
        return matchesSearch && trader.status === "Not Connected";
      case "connect":
        return matchesSearch && trader.status === "Connected";
      case "disconnect":
        return matchesSearch && trader.status === "Disconnected";
      case "pending":
        return matchesSearch && trader.status === "Pending";
      default:
        return matchesSearch;
    }
  });

  const handleConnect = (trader: any) => {
    setSelectedTrader(trader);
    setIsConnectModalOpen(true);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // Có thể thêm thông báo toast ở đây
  };

  const handleAddWallet = () => {
    console.log(`Adding wallet: ${newWalletName}`);
    setIsAddWalletOpen(false);
    setNewWalletName("");
  };

  const handleConnectMaster = async (selectedTrader: any) => {
    const data = {
      master_wallet_address: selectedTrader.solana_address,
    };
    await MasterTradingService.connectMaster(data);
    console.log(data)
    setIsConnectModalOpen(false);
    setMaxCopyAmount("");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">
          {t("masterTrade.availableMasters")}
        </h1>
        <div className="relative w-full md:w-auto mt-4 md:mt-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("masterTrade.searchPlaceholder")}
            className="pl-10 w-full md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="not-connected" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="not-connected">Not Connected (5)</TabsTrigger>
          <TabsTrigger value="connect">Connected (0)</TabsTrigger>
          <TabsTrigger value="disconnect">Disconnected (0)</TabsTrigger>
          <TabsTrigger value="pending">Pending (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="not-connected">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[300px]">
                        Wallet Address
                      </TableHead>
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
                              onClick={() =>
                                handleCopyAddress(trader.eth_address)
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              trader.type === "VIP" ? "default" : "outline"
                            }
                            className={
                              trader.type === "VIP"
                                ? "bg-purple-500 hover:bg-purple-600"
                                : ""
                            }
                          >
                            {trader.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {trader.connection_status || "Not Connected"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            className="border-primary border-solid border-2 text-white"
                            onClick={() => handleConnect(trader)}
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
      <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <AlertDialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Add New Wallet
            </DialogTitle>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="wallet-name">Wallet Name</Label>
              <Input
                id="wallet-name"
                placeholder="Enter wallet name"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900/50"
              />
            </div>
          </div>

          <AlertDialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddWalletOpen(false);
                setNewWalletName("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleAddWallet}
              disabled={!newWalletName.trim()}
            >
              Add Wallet
            </Button>
          </AlertDialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Connect to <br />
              <small className="text-xs w-full truncate">
                {selectedTrader?.solana_address || "Trader"}
              </small>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="max-copy-amount">Maximum Copy Amount (SOL)</Label>
              <Input
                id="max-copy-amount"
                placeholder="Enter amount"
                value={maxCopyAmount}
                type="number"
                onChange={(e) => setMaxCopyAmount(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900/50"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsConnectModalOpen(false);
                setMaxCopyAmount("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleConnectMaster(selectedTrader)}
              disabled={!maxCopyAmount.trim()}
            >
              Connect Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
