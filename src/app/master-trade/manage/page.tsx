"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy } from "lucide-react";
import { useLang } from "@/lang/useLang";
import { MasterTradingService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { getMyConnects, getMyGroups } from "@/services/api/MasterTradingService";

type Group = {
  mg_id: number;
  mg_name: string;
  mg_master_wallet: number;
  mg_option: string;
  mg_fixed_price: string;
  mg_fixed_ratio: number;
  mg_status: "on" | "delete";
  created_at: string;
};

type Connection = {
  connection_id: number;
  member_id: number;
  member_address: string;
  status: "connect" | "pending" | "paused" | "blocked";
  option_limit: string;
  price_limit: string;
  ratio_limit: number;
  joined_groups: {
    group_id: number;
    group_name: string;
  }[];
};


export default function ManageMasterTrade() {
  const { data: myGroups = [] } = useQuery<Group[]>({
    queryKey: ["my-groups-manage"],
    queryFn: async () => {
      const response = await getMyGroups();
      if (Array.isArray(response)) {
        return response;
      }
      return response.data || [];
    },
  });

  const { data: myConnects = [] } = useQuery<Connection[]>({
    queryKey: ["my-connects-manage"],
    queryFn: getMyConnects,
  });

  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("connected");
  const [groupName, setGroupName] = useState("");
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [activeGroupTab, setActiveGroupTab] = useState<"on" | "delete">("on");

  // Lọc kết nối dựa trên tab đang active
  const filteredConnections = myConnects.filter((connection) => {
    switch (activeTab) {
      case "pending":
        return connection.status === "pending";
      case "connected":
        return connection.status === "connect";
      case "paused":
        return connection.status === "paused";
      case "blocked":
        return connection.status === "blocked";
      default:
        return true;
    }
  });

  // Lọc nhóm dựa trên tab đang active
  const filteredGroups = myGroups.filter((group) => {
    switch (activeGroupTab) {
      case "on":
        return group.mg_status === "on";
      case "delete":
        return group.mg_status === "delete";
      default:
        return true;
    }
  });

  // Xử lý tạo nhóm mới
  const handleCreateGroup = async () => {
    if (groupName.trim()) {
      console.log("Creating new group:", groupName);
      // Xử lý tạo nhóm ở đây
      await MasterTradingService.masterCreateGroup({ mg_name: groupName });
      setGroupName("");
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
      setSelectedConnections((prev) => [...prev, id]);
    } else {
      setSelectedConnections((prev) => prev.filter((connId) => connId !== id));
    }
  };

  // Xử lý chọn/bỏ chọn một nhóm
  const handleSelectGroup = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedGroups((prev) => [...prev, id]);
    } else {
      setSelectedGroups((prev) => prev.filter((groupId) => groupId !== id));
    }
  };

  // Xử lý bật/tắt nhóm
  const handleToggleGroup = (id: number, newStatus: string) => {
    console.log(`Changing group ${id} status to ${newStatus}`);
    // Xử lý thay đổi trạng thái nhóm ở đây
  };

  // Xử lý xóa nhóm
  const handleDeleteGroup = (id: number) => {
    console.log(`Deleting group ${id}`);
    // Xử lý xóa nhóm ở đây
  };

  // Xử lý kết nối/ngắt kết nối
  const handleToggleConnection = (id: number, action: string) => {
    console.log(`${action} connection ${id}`);
    // Xử lý thay đổi trạng thái kết nối ở đây
  };

  // Xử lý chặn/bỏ chặn kết nối
  const handleBlockConnection = (id: number, block: boolean) => {
    console.log(`${block ? "Blocking" : "Unblocking"} connection ${id}`);
    // Xử lý chặn/bỏ chặn kết nối ở đây
  };

  // Xử lý sao chép địa chỉ
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // Có thể thêm thông báo toast ở đây
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">{t("masterTrade.manage.title")}</h1>
        <Button className="mt-4 md:mt-0 bg-green-500 hover:bg-green-600">
          {t("masterTrade.manage.connectWithOtherMaster")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create New Group */}
        <Card className="border-none shadow-md dark:shadow-blue-900/5 flex flex-col justify-center gap-8">
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
        <Card className="border-none shadow-md dark:shadow-blue-900/5 lg:col-span-2">
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

            <div className="rounded-lg overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
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
                          <div className="flex items-center">
                            <Checkbox
                              id={`group-${group.mg_id}`}
                              checked={selectedGroups.includes(group.mg_id)}
                              onCheckedChange={(checked) =>
                                handleSelectGroup(group.mg_id, checked as boolean)
                              }
                              className="mr-2"
                            />
                            <label htmlFor={`group-${group.mg_id}`}>
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
                            {group.mg_status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right !py-2">
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
                                  group.mg_status === "on" ? "delete" : "on"
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
        <Card className="border-none shadow-md dark:shadow-blue-900/5 lg:col-span-3">
          <CardContent className="p-6">
            <Tabs defaultValue="connected" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
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
                      {myConnects.filter((c) => c.status === "paused").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="blocked">
                    {t("masterTrade.manage.connectionManagement.tabs.blocked")}{" "}
                    <Badge variant="outline" className="ml-1">
                      {myConnects.filter((c) => c.status === "blocked").length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <Button className="bg-green-500 hover:bg-green-600">
                  {t("masterTrade.manage.connectionManagement.join")}
                </Button>
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

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow className="bg-muted/50">
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
                        : connection.status === "paused"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                    }
                  >
                    {connection.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {connection.status === "connect" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30"
                      onClick={() =>
                        onToggleConnection(connection.connection_id, "disconnect")
                      }
                    >
                      {t(
                        "masterTrade.manage.connectionManagement.actions.connect"
                      )}
                    </Button>
                  ) : connection.status === "blocked" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => onBlockConnection(connection.connection_id, false)}
                    >
                      {t(
                        "masterTrade.manage.connectionManagement.actions.unblock"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => onBlockConnection(connection.connection_id, true)}
                    >
                      {t(
                        "masterTrade.manage.connectionManagement.actions.block"
                      )}
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
      {connections.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" disabled={true}>
            {t("masterTrade.manage.connectionManagement.previous")}
          </Button>
          <Button variant="outline" size="sm" disabled={false}>
            {t("masterTrade.manage.connectionManagement.next")}
          </Button>
        </div>
      )}
    </div>
  );
}
