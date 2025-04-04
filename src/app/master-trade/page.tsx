"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Copy, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lang";
import { useQuery } from "@tanstack/react-query";
import { getMasters } from "@/services/api/MasterTradingService";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader,} from "@/components/ui/dialog";
import { AlertDialogFooter, AlertDialogHeader,} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { MasterTradingService } from "@/services/api";
import { getInforWallet } from "@/services/api/TelegramWalletService";

export default function MasterTrade() {
  const { t } = useLang();
  const router = useRouter();
  const { data: masterTraders = [] , refetch: refetchMasterTraders } = useQuery({
    queryKey: ["master-trading/masters"],
    queryFn: getMasters,
  });
    const { data: walletInfor, refetch: refecthWalletInfor } = useQuery({
      queryKey: ["wallet-infor"],
      queryFn: getInforWallet,
    });
  const [activeTab, setActiveTab] = useState("not-connected");
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<any>(null);
  const [maxCopyAmount, setMaxCopyAmount] = useState("0.01");
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");

  // Count traders by connection status for tab indicators
  const notConnectedCount = masterTraders.filter((trader: any) => trader.connection_status === null || trader.connection_status === "block").length;
  const connectedCount = masterTraders.filter((trader: any) => trader.connection_status === "connect").length;
  const disconnectedCount = masterTraders.filter((trader: any) => trader.connection_status === "disconnect").length;
  const pendingCount = masterTraders.filter((trader: any) => trader.connection_status === "pending").length;

  // Fixed filter function to match the actual connection_status values
  const filteredTraders = masterTraders.filter((trader: any) => {
    const matchesSearch = trader.solana_address
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    switch (activeTab) {
      case "not-connected":
        return matchesSearch && (trader.connection_status === null || trader.connection_status === "block");
      case "connect":
        return matchesSearch && trader.connection_status === "connect";
      case "disconnect":
        return matchesSearch && trader.connection_status === "disconnect";
      case "pending":
        return matchesSearch && trader.connection_status === "pending";
      default:
        return matchesSearch;
    }
  });

  const handleConnect = (trader: any) => {
    if (trader.type === "normal") {
      setSelectedTrader(trader);
      setIsConnectModalOpen(true);
    } else {
      handleConnectMaster(trader);
    }
  };

  const handleCopyAddress = (address: any) => {
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
      option_limit: "price",
      price_limit: maxCopyAmount
    };
    await MasterTradingService.connectMaster(data);
    setIsConnectModalOpen(false);
    setMaxCopyAmount("0.1");
    refetchMasterTraders();
  };


  const handleDisconnect = async (disconnect: any)=>{
    const data = {
      master_wallet_id: disconnect.id,
      status: "disconnect"
    };
    await MasterTradingService.masterSetConnectGroup(data)
  }

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

      {walletInfor?.role === "master" && (
        <div className="flex justify-end mb-6">
          <Button
            variant="default"
            onClick={() => router.push("/master-trade/manage")}
            className="w-full md:w-[300px] bg-primary hover:bg-primary/90 text-black font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            {t("masterTrade.actions.manage")}
          </Button>
        </div>
      )}

      <Tabs defaultValue="not-connected" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="not-connected">{t("masterTrade.tabs.notConnected")} ({notConnectedCount})</TabsTrigger>
          <TabsTrigger value="connect">{t("masterTrade.tabs.connected")} ({connectedCount})</TabsTrigger>
          <TabsTrigger value="disconnect">{t("masterTrade.tabs.disconnected")} ({disconnectedCount})</TabsTrigger>
          <TabsTrigger value="pending">{t("masterTrade.tabs.pending")} ({pendingCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="not-connected">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[300px]">
                        {t("masterTrade.table.walletAddress")}
                      </TableHead>
                      <TableHead>{t("masterTrade.table.type")}</TableHead>
                      <TableHead>{t("masterTrade.table.status")}</TableHead>
                      <TableHead className="text-right">{t("masterTrade.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTraders.length > 0 ? (
                      filteredTraders.map((trader: any) => (
                        <TableRow key={trader.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div className="w-64 truncate">
                              {trader.solana_address}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-2"
                                onClick={() =>
                                  handleCopyAddress(trader.solana_address)
                                }
                                title={t("masterTrade.actions.copyAddress")}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                trader.type === "vip" ? "default" : "outline"
                              }
                              className={
                                trader.type === "vip"
                                  ? "bg-purple-500 hover:bg-purple-600 uppercase"
                                  : "uppercase"
                              }
                            >
                              {trader.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {t(`masterTrade.status.${trader.connection_status || "notConnected"}`)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              className="border-primary border-solid border-2 text-white"
                              onClick={() => handleConnect(trader)}
                            >
                              {t("masterTrade.actions.connect")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {t("masterTrade.noData.notConnected")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connect">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[300px]">
                        {t("masterTrade.table.walletAddress")}
                      </TableHead>
                      <TableHead>{t("masterTrade.table.type")}</TableHead>
                      <TableHead>{t("masterTrade.table.status")}</TableHead>
                      <TableHead className="text-right">{t("masterTrade.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTraders.length > 0 ? (
                      filteredTraders.map((trader: any) => (
                        <TableRow key={trader.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div className="w-64 truncate">
                              {trader.solana_address}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-2"
                                onClick={() =>
                                  handleCopyAddress(trader.solana_address)
                                }
                                title={t("masterTrade.actions.copyAddress")}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                trader.type === "vip" ? "default" : "outline"
                              }
                              className={
                                trader.type === "vip"
                                  ? "bg-purple-500 hover:bg-purple-600 uppercase"
                                  : "uppercase"
                              }
                            >
                              {trader.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {t(`masterTrade.status.${trader.connection_status}`)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDisconnect(trader)}
                            >
                              {t("masterTrade.actions.disconnect")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {t("masterTrade.noData.connected")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disconnect">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[300px]">
                        {t("masterTrade.table.walletAddress")}
                      </TableHead>
                      <TableHead>{t("masterTrade.table.type")}</TableHead>
                      <TableHead>{t("masterTrade.table.status")}</TableHead>
                      <TableHead className="text-right">{t("masterTrade.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTraders.length > 0 ? (
                      filteredTraders.map((trader: any) => (
                        <TableRow key={trader.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div className="w-64 truncate">
                              {trader.solana_address}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-2"
                                onClick={() =>
                                  handleCopyAddress(trader.solana_address)
                                }
                                title={t("masterTrade.actions.copyAddress")}
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
                              {t(`masterTrade.status.${trader.connection_status}`)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              className="border-primary border-solid border-2 text-white"
                              onClick={() => handleConnect(trader)}
                            >
                              {t("masterTrade.actions.reconnect")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {t("masterTrade.noData.disconnected")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[300px]">
                        {t("masterTrade.table.walletAddress")}
                      </TableHead>
                      <TableHead>{t("masterTrade.table.type")}</TableHead>
                      <TableHead>{t("masterTrade.table.status")}</TableHead>
                      <TableHead className="text-right">{t("masterTrade.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTraders.length > 0 ? (
                      filteredTraders.map((trader: any) => (
                        <TableRow key={trader.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div className="w-64 truncate">
                              {trader.solana_address}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-2"
                                onClick={() =>
                                  handleCopyAddress(trader.solana_address)
                                }
                                title={t("masterTrade.actions.copyAddress")}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                trader.type === "vip" ? "default" : "outline"
                              }
                              className={
                                trader.type === "vip"
                                  ? "bg-purple-500 hover:bg-purple-600 uppercase"
                                  : "uppercase"
                              }
                            >
                              {trader.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {t(`masterTrade.status.${trader.connection_status}`)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConnect(trader)}
                            >
                              {t("masterTrade.actions.cancel")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {t("masterTrade.noData.pending")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <AlertDialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t("masterTrade.dialog.addWallet.title")}
            </DialogTitle>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="wallet-name">{t("masterTrade.dialog.addWallet.walletName")}</Label>
              <Input
                id="wallet-name"
                placeholder={t("masterTrade.dialog.addWallet.walletNamePlaceholder")}
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
              {t("masterTrade.dialog.addWallet.cancel")}
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleAddWallet}
              disabled={!newWalletName.trim()}
            >
              {t("masterTrade.dialog.addWallet.add")}
            </Button>
          </AlertDialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t("masterTrade.dialog.connect.title")} <br />
              <small className="text-xs w-full truncate">
                {selectedTrader?.solana_address || "Trader"}
              </small>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="max-copy-amount">{t("masterTrade.dialog.connect.maxCopyAmount")}</Label>
              <Input
                id="max-copy-amount"
                placeholder={t("masterTrade.dialog.connect.amountPlaceholder")}
                value={maxCopyAmount}
                type="number"
                min="0.01"
                step="0.01"
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
                setMaxCopyAmount("0.1");
              }}
            >
              {t("masterTrade.dialog.connect.cancel")}
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleConnectMaster(selectedTrader)}
              disabled={!maxCopyAmount.trim() || parseFloat(maxCopyAmount) < 0.01}
            >
              {t("masterTrade.dialog.connect.connect")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}