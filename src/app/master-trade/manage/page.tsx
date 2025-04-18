"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Badge } from "@/ui/badge";
import { Checkbox } from "@/ui/checkbox";
import { Copy, Crown } from "lucide-react";
import { useLang } from "@/lang/useLang";
import { MasterTradingService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { getMyConnects, getMyGroups } from "@/services/api/MasterTradingService";
import { getInforWallet } from "@/services/api/TelegramWalletService";
import { useRouter } from "next/navigation";
import { ToastNotification } from "@/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import LogWarring from "@/ui/log-warring";

type Group = {
  mg_id: number;
  mg_name: string;
  mg_master_wallet: number;
  mg_option: string;
  mg_fixed_price: string;
  mg_fixed_ratio: number;
  mg_status: "on" | "off" | "delete";
  created_at: string;
};

type Connection = {
  connection_id: number;
  member_id: number;
  member_address: string;
  status: "connect" | "pending" | "pause" | "block";
  option_limit: string;
  price_limit: string;
  ratio_limit: number;
  joined_groups: {
    group_id: number;
    group_name: string;
  }[];
};

type WalletInfo = {
  role: string;
  // Add other wallet info properties if needed
};

export default function ManageMasterTrade() {
  const { isAuthenticated } = useAuth();
  const { data: myGroups = [] , refetch: refetchMyGroups} = useQuery<Group[]>({
    queryKey: ["my-groups-manage"],
    queryFn: async () => {
      const response = await getMyGroups();
      if (Array.isArray(response)) {
        return response;
      }
      return response.data || [];
    },
  });

  const { data: myConnects = [], refetch: refetchMyConnects } = useQuery<Connection[]>({
    queryKey: ["my-connects-manage"],
    queryFn: getMyConnects,
  });

  const { data: walletInfor, isLoading } = useQuery<WalletInfo>({
    queryKey: ["wallet-infor"],
    queryFn: getInforWallet,
  });

  const router = useRouter();
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("connected");
  const [groupName, setGroupName] = useState("");
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [activeGroupTab, setActiveGroupTab] = useState<"on" | "off" | "delete">("on");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && walletInfor?.role !== "master") {
      router.push("/master-trade");
    }
  }, [walletInfor, isLoading, router]);

  // Lọc kết nối dựa trên tab đang active
  const filteredConnections = myConnects.filter((connection) => {
    switch (activeTab) {
      case "pending":
        return connection.status === "pending";
      case "connected":
        return connection.status === "connect";
      case "paused":
        return connection.status === "pause";
      case "blocked":
        return connection.status === "block";
      default:
        return true;
    }
  });

  // Lọc nhóm dựa trên tab đang active
  const filteredGroups = myGroups.filter((group) => {
    switch (activeGroupTab) {
      case "on":
        return group.mg_status === "on";
      case "off":
        return group.mg_status === "off";
      case "delete":
        return group.mg_status === "delete";
      default:
        return true;
    }
  });

  // Xử lý tạo nhóm mới
  const handleCreateGroup = async () => {
    if (groupName.trim()) {
      try {
        await MasterTradingService.masterCreateGroup({ mg_name: groupName });
        setGroupName("");
        setToastMessage(t("masterTrade.manage.createNewGroup.success"));
        setShowToast(true);
        refetchMyGroups();
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        setToastMessage(t("masterTrade.manage.createNewGroup.error"));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  // Xử lý chọn/bỏ chọn tất cả kết nối
  const handleSelectAllConnections = (checked: boolean) => {
    if (checked) {
      setSelectedConnections(filteredConnections.map((c) => c.connection_id.toString()));
    } else {
      setSelectedConnections([]);
    }
  };

  // Xử lý chọn/bỏ chọn một kết nối
  const handleSelectConnection = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedConnections(prev => [...prev, id]);
    } else {
      setSelectedConnections(prev => prev.filter(item => item !== id));
    }
  };

  // Xử lý chọn/bỏ chọn một nhóm
  const handleSelectGroup = (groupId: number, checked: boolean) => {
    if (checked) {
      setSelectedGroup(groupId);
    } else {
      setSelectedGroup(null);
    }
  };

  // Xử lý bật/tắt nhóm
  const handleToggleGroup = async (id: number, newStatus: string) => {
    console.log(`Changing group ${id} status to ${newStatus}`);
    await MasterTradingService.changeStatusGroup(id, newStatus);
    refetchMyGroups();
    // Xử lý thay đổi trạng thái nhóm ở đây
  };

  // Xử lý xóa nhóm
  const handleDeleteGroup = async (id: number) => {
    await MasterTradingService.changeStatusGroup(id, "delete");
    refetchMyGroups();

    // Xử lý xóa nhóm ở đây
  };

  // Xử lý kết nối/ngắt kết nối
  const handleToggleConnection = async (id: number, action: string) => {
    try {
      if (action === "connect") {
        await MasterTradingService.masterSetConnect({ mc_id: id, status: "connect" });
      } else if (action === "block") {
        await MasterTradingService.masterSetConnect({ mc_id: id, status: "block" });
        refetchMyConnects()
      }
      // Refresh connections data
      const { refetch } = useQuery<Connection[]>({
        queryKey: ["my-connects-manage"],
        queryFn: getMyConnects,
      });
      refetch();
    } catch (error) {
      console.error("Error toggling connection:", error);
      setToastMessage(t("masterTrade.manage.connectionManagement.error"));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Xử lý chặn/bỏ chặn kết nối
  const handleBlockConnection = async (id: number, block: boolean) => {
    try {
      await MasterTradingService.masterSetConnect({ 
        mc_id: id, 
        status: block ? "block" : "pause" 
      });
      
      // Refresh connections data
      refetchMyConnects();

      // Show success message
      setToastMessage(t("masterTrade.manage.connectionManagement.blockSuccess"));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error blocking connection:", error);
      setToastMessage(t("masterTrade.manage.connectionManagement.blockError"));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Xử lý sao chép địa chỉ
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setToastMessage(t("notifications.addressCopied"));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleOpenJoinDialog = () => {
    if (selectedConnections.length > 0) {
      setIsJoinDialogOpen(true);
    } else {
      setToastMessage(t("masterTrade.manage.connectionManagement.selectConnection"));
      setShowToast(true);
    }
  };

  const handleJoin = async () => {
    if (selectedGroup && selectedConnections.length > 0) {
      try {
        // Lấy tất cả member_ids từ các kết nối đã chọn
        const memberIds = selectedConnections.map(connId => {
          const selectedConnection = myConnects.find(
            conn => conn.connection_id.toString() === connId
          );
          return selectedConnection?.member_id;
        }).filter(Boolean);

        if (memberIds.length > 0) {
          await MasterTradingService.masterSetGroup({
            mg_id: selectedGroup,
            member_ids: memberIds
          });
          setToastMessage(t("masterTrade.manage.connectionManagement.joinSuccess"));
          setShowToast(true);
          // Fetch lại dữ liệu sau khi join thành công
          refetchMyGroups();
          refetchMyConnects();
          setIsJoinDialogOpen(false);
          setSelectedGroup(null);
          setSelectedConnections([]);
        }
      } catch (error) {
        setToastMessage(t("masterTrade.manage.connectionManagement.joinError"));
        setShowToast(true);
      }
    }
  };

  if (!isAuthenticated) return <LogWarring />;

  return (
    <div className="container mx-auto p-6">
      {showToast && <ToastNotification message={toastMessage} />}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br bg-[#d8e8f7] text-black rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-500/20 dark:shadow-yellow-800/20 animate-float">
          <Crown className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold font-comic bg-clip-text text-transparent bg-gradient-to-r bg-[#d8e8f7] uppercase">
            {t("masterTrade.manage.title")}
          </h1>
        </div>
        <Button className="mt-4 md:mt-0 bg-[#d8e8f7] text-black" onClick={() => router.push("/master-trade")}>
          {t("masterTrade.manage.connectWithOtherMaster")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Create New Group */}
        <Card className="shadow-md dark:shadow-blue-900/5 flex flex-col justify-center gap-8">
          <CardHeader>
            <CardTitle>
              {t("masterTrade.manage.createNewGroup.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="groupName"
                  className="block text-sm font-medium mb-1"
                >
                  {t("masterTrade.manage.createNewGroup.groupName")}
                </label>
                <Input
                  id="groupName"
                  placeholder={t(
                    "masterTrade.manage.createNewGroup.groupNamePlaceholder"
                  )}
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-gray-500 hover:bg-gray-600"
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
              >
                {t("masterTrade.manage.createNewGroup.createButton")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Group Management */}
        <Card className="shadow-md dark:shadow-blue-900/5 lg:col-span-2">
          <CardContent className="p-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={activeGroupTab === "on" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveGroupTab("on")}
                className={
                  activeGroupTab === "on"
                    ? "bg-green-500 hover:bg-green-600"
                    : ""
                }
              >
                {t("masterTrade.manage.groupManagement.on")}{" "}
                <Badge
                  variant="outline"
                  className="ml-1 bg-white text-green-600"
                >
                  {myGroups.filter((g) => g.mg_status === "on").length}
                </Badge>
              </Button>
              <Button 
                variant={activeGroupTab === "off" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveGroupTab("off")}
                className={
                  activeGroupTab === "off"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : ""
                }
              >
                {t("masterTrade.manage.groupManagement.off")}{" "}
                <Badge variant="outline" className="ml-1">
                  {myGroups.filter((g) => g.mg_status === "off").length}
                </Badge>
              </Button>
              <Button 
                variant={activeGroupTab === "delete" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveGroupTab("delete")}
                className={
                  activeGroupTab === "delete"
                    ? "bg-red-500 hover:bg-red-600"
                    : ""
                }
              >
                {t("masterTrade.manage.groupManagement.delete")}{" "}
                <Badge variant="outline" className="ml-1">
                  {myGroups.filter((g) => g.mg_status === "delete").length}
                </Badge>
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden border">
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin ">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background">
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[200px]">
                        {t(
                          "masterTrade.manage.groupManagement.columns.groupName"
                        )}
                      </TableHead>
                      <TableHead>
                        {t("masterTrade.manage.groupManagement.columns.status")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("masterTrade.manage.groupManagement.columns.action")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups.map((group) => (
                      <TableRow key={group.mg_id} className="hover:bg-muted/30">
                        <TableCell className="font-medium !py-2">
                          <div className="flex items-center space-x-2">
                            {activeGroupTab === "on" && (
                              <Checkbox
                                id={`group-${group.mg_id}`}
                                checked={selectedGroup === group.mg_id}
                                onCheckedChange={(checked) => handleSelectGroup(group.mg_id, checked as boolean)}
                              />
                            )}
                            <label
                              htmlFor={`group-${group.mg_id}`}
                              className="cursor-pointer"
                            >
                              {group.mg_name}
                            </label>
                          </div>
                        </TableCell>
                        <TableCell className="!py-2">
                          <Badge
                            variant="outline"
                            className={
                              group.mg_status === "on"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                            }
                          >
                            {t(`masterTrade.manage.groupManagement.${group.mg_status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right !py-2">
                          {activeGroupTab !== "delete" && (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className={
                                  group.mg_status === "delete"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                                    : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                                }
                                onClick={() =>
                                  handleToggleGroup(
                                    group.mg_id,
                                    group.mg_status === "on" ? "off" : "on"
                                  )
                                }
                              >
                                {group.mg_status === "on"
                                  ? t("masterTrade.manage.groupManagement.off")
                                  : t("masterTrade.manage.groupManagement.on")}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                                onClick={() => handleDeleteGroup(group.mg_id)}
                              >
                                {t("masterTrade.manage.groupManagement.delete")}
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredGroups.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-4 text-muted-foreground"
                        >
                          {t("masterTrade.manage.groupManagement.noGroups")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Management */}
        <Card className="shadow-md dark:shadow-blue-900/5 lg:col-span-3">
          <CardContent className="p-6">
            <Tabs defaultValue="connected" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList className="overflow-x-auto md:overflow-x-visible whitespace-nowrap max-w-full">
                  <TabsTrigger value="pending">
                    {t("masterTrade.manage.connectionManagement.tabs.pending")}{" "}
                    <Badge variant="outline" className="ml-1">
                      {myConnects.filter((c) => c.status === "pending").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="connected">
                    {t(
                      "masterTrade.manage.connectionManagement.tabs.connected"
                    )}{" "}
                    <Badge variant="outline" className="ml-1">
                      {
                        myConnects.filter((c) => c.status === "connect")
                          .length
                      }
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="paused">
                    {t("masterTrade.manage.connectionManagement.tabs.paused")}{" "}
                    <Badge variant="outline" className="ml-1">
                      {myConnects.filter((c) => c.status === "pause").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="blocked">
                    {t("masterTrade.manage.connectionManagement.tabs.blocked")}{" "}
                    <Badge variant="outline" className="ml-1">
                      {myConnects.filter((c) => c.status === "block").length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                {selectedGroup && (
                  <Button 
                    className="bg-green-500 hover:bg-green-600"
                    onClick={handleOpenJoinDialog}
                  >
                    {t("masterTrade.manage.connectionManagement.join")}
                  </Button>
                )}
              </div>

              <TabsContent value="pending" className="mt-0">
                <ConnectionsTable
                  connections={filteredConnections}
                  selectedConnections={selectedConnections}
                  onSelectAll={handleSelectAllConnections}
                  onSelectConnection={handleSelectConnection}
                  onToggleConnection={handleToggleConnection}
                  onBlockConnection={handleBlockConnection}
                  onCopyAddress={handleCopyAddress}
                />
              </TabsContent>

              <TabsContent value="connected" className="mt-0">
                <ConnectionsTable
                  connections={filteredConnections}
                  selectedConnections={selectedConnections}
                  onSelectAll={handleSelectAllConnections}
                  onSelectConnection={handleSelectConnection}
                  onToggleConnection={handleToggleConnection}
                  onBlockConnection={handleBlockConnection}
                  onCopyAddress={handleCopyAddress}
                />
              </TabsContent>

              <TabsContent value="paused" className="mt-0">
                <ConnectionsTable
                  connections={filteredConnections}
                  selectedConnections={selectedConnections}
                  onSelectAll={handleSelectAllConnections}
                  onSelectConnection={handleSelectConnection}
                  onToggleConnection={handleToggleConnection}
                  onBlockConnection={handleBlockConnection}
                  onCopyAddress={handleCopyAddress}
                />
              </TabsContent>

              <TabsContent value="blocked" className="mt-0">
                <ConnectionsTable
                  connections={filteredConnections}
                  selectedConnections={selectedConnections}
                  onSelectAll={handleSelectAllConnections}
                  onSelectConnection={handleSelectConnection}
                  onToggleConnection={handleToggleConnection}
                  onBlockConnection={handleBlockConnection}
                  onCopyAddress={handleCopyAddress}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Join Group Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("masterTrade.manage.connectionManagement.joinGroup")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              {myGroups
                .filter(group => group.mg_id === selectedGroup)
                .map(group => (
                  <div key={group.mg_id} className="flex-1">
                    <p className="font-medium">{group.mg_name}</p>
                  </div>
                ))}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsJoinDialogOpen(false);
                    setSelectedGroup(null);
                  }}
                >
                  {t("masterTrade.manage.connectionManagement.cancel")}
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={handleJoin}
                >
                  {t("masterTrade.manage.connectionManagement.join")}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component cho bảng kết nối
function ConnectionsTable({
  connections,
  selectedConnections,
  onSelectAll,
  onSelectConnection,
  onToggleConnection,
  onBlockConnection,
  onCopyAddress,
}: {
  connections: Connection[];
  selectedConnections: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectConnection: (id: string, checked: boolean) => void;
  onToggleConnection: (id: number, action: string) => void;
  onBlockConnection: (id: number, block: boolean) => void;
  onCopyAddress: (address: string) => void;
}) {
  const { t } = useLang();
  const isConnectedTab = connections.some(conn => conn.status === "connect");

  return (
    <div className="rounded-lg overflow-hidden border">
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow className="bg-muted/50">
              {isConnectedTab && (
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      connections.length > 0 &&
                      selectedConnections.length === connections.length
                    }
                    onCheckedChange={onSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              <TableHead className="w-[250px]">
                {t(
                  "masterTrade.manage.connectionManagement.columns.walletAddress"
                )}
              </TableHead>
              <TableHead>
                {t(
                  "masterTrade.manage.connectionManagement.columns.joinedGroups"
                )}
              </TableHead>
              <TableHead>
                {t("masterTrade.manage.connectionManagement.columns.status")}
              </TableHead>
              <TableHead className="text-right">
                {t("masterTrade.manage.connectionManagement.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((connection) => (
              <TableRow key={connection.connection_id} className="hover:bg-muted/30">
                {isConnectedTab && (
                  <TableCell>
                    <Checkbox
                      checked={selectedConnections.includes(
                        connection.connection_id.toString()
                      )}
                      onCheckedChange={(checked) =>
                        onSelectConnection(
                          connection.connection_id.toString(),
                          checked as boolean
                        )
                      }
                      aria-label={`Select connection ${connection.connection_id}`}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center">
                    <span>{connection.member_address.slice(0, 6)}...{connection.member_address.slice(-4)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => onCopyAddress(connection.member_address)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {connection.joined_groups.map((group) => (
                      <Badge
                        key={group.group_id}
                        variant="outline"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                      >
                        {group.group_name}
                      </Badge>
                    ))}
                    {connection.joined_groups.length === 0 && (
                      <span className="text-muted-foreground text-sm">
                        {t("masterTrade.manage.connectionManagement.noGroups")}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      connection.status === "connect"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                        : connection.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                        : connection.status === "pause"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                    }
                  >
                    {connection.status === "block" 
                      ? t("masterTrade.manage.connectionManagement.actions.block")
                      : connection.status === "pause"
                      ? t("masterTrade.manage.connectionManagement.actions.pause")
                      : connection.status === "connect"
                      ? t("masterTrade.manage.connectionManagement.actions.connect")
                      : connection.status === "pending"
                      ? t("masterTrade.manage.connectionManagement.actions.pending")
                      : connection.status
                      }
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {connection.status === "connect" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => onBlockConnection(connection.connection_id, true)}
                    >
                      {t("masterTrade.manage.connectionManagement.actions.block")}
                    </Button>
                  ) : connection.status === "pending" ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30"
                        onClick={() =>
                          onToggleConnection(connection.connection_id, "connect")
                        }
                      >
                        {t("masterTrade.manage.connectionManagement.actions.connect")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => onBlockConnection(connection.connection_id, true)}
                      >
                        {t("masterTrade.manage.connectionManagement.actions.block")}
                      </Button>
                    </div>
                  ) : connection.status === "block" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => onBlockConnection(connection.connection_id, false)}
                    >
                      {t("masterTrade.manage.connectionManagement.actions.unblock")}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => onBlockConnection(connection.connection_id, true)}
                    >
                      {t("masterTrade.manage.connectionManagement.actions.block")}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {connections.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-4 text-muted-foreground"
                >
                  {t("masterTrade.manage.connectionManagement.noConnections")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* {connections.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" disabled={true}>
            {t("masterTrade.manage.connectionManagement.previous")}
          </Button>
          <Button variant="outline" size="sm" disabled={false}>
            {t("masterTrade.manage.connectionManagement.next")}
          </Button>
        </div>
      )} */}
    </div>
  );
}
