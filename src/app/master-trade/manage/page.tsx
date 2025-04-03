"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy } from "lucide-react"

// Dữ liệu mẫu cho các nhóm
const groups = [
  { id: 1, name: "Group 02", status: "ON" },
  { id: 2, name: "Trading Group", status: "ON" },
  { id: 3, name: "Crypto Signals", status: "OFF" },
  { id: 4, name: "Bitcoin Traders", status: "ON" },
  { id: 5, name: "Altcoin Hunters", status: "OFF" },
  { id: 6, name: "DeFi Masters", status: "ON" },
  { id: 7, name: "NFT Collectors", status: "OFF" },
  { id: 8, name: "Whale Watchers", status: "ON" },
]

// Dữ liệu mẫu cho các kết nối
const connections = [
  {
    id: 1,
    walletAddress: "2Exba5...KTyP",
    fullAddress: "2Exba57zoxmHZQmkhVwkNw3chuNyNvX9viWR3LKTyP",
    joinedGroups: ["Group 02", "Trading Group"],
    status: "connected",
  },
  {
    id: 2,
    walletAddress: "8D5A62...E131",
    fullAddress: "8D5A62fbc40f262EEa07D2F6Fe8805F9c7C7E131",
    joinedGroups: ["Crypto Signals"],
    status: "paused",
  },
  {
    id: 3,
    walletAddress: "C8eKC6...SHP8",
    fullAddress: "C8eKC6SHP8fbc40f262EEa07D2F6Fe8805F9c7C7",
    joinedGroups: ["Bitcoin Traders", "Altcoin Hunters"],
    status: "connected",
  },
  {
    id: 4,
    walletAddress: "DH6zw6...HMWT",
    fullAddress: "DH6zw6HMWT40f262EEa07D2F6Fe8805F9c7C7E131",
    joinedGroups: [],
    status: "pending",
  },
  {
    id: 5,
    walletAddress: "4SHrFe...5Xgf",
    fullAddress: "4SHrFe5Xgf40f262EEa07D2F6Fe8805F9c7C7E131",
    joinedGroups: ["DeFi Masters"],
    status: "blocked",
  },
]

export default function ManageMasterTrade() {
  const [activeTab, setActiveTab] = useState("connected")
  const [groupName, setGroupName] = useState("")
  const [selectedConnections, setSelectedConnections] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<number[]>([])

  // Lọc kết nối dựa trên tab đang active
  const filteredConnections = connections.filter((connection) => {
    switch (activeTab) {
      case "pending":
        return connection.status === "pending"
      case "connected":
        return connection.status === "connected"
      case "paused":
        return connection.status === "paused"
      case "blocked":
        return connection.status === "blocked"
      default:
        return true
    }
  })

  // Xử lý tạo nhóm mới
  const handleCreateGroup = () => {
    if (groupName.trim()) {
      console.log("Creating new group:", groupName)
      // Xử lý tạo nhóm ở đây
      setGroupName("")
    }
  }

  // Xử lý chọn/bỏ chọn tất cả kết nối
  const handleSelectAllConnections = (checked: boolean) => {
    if (checked) {
      setSelectedConnections(filteredConnections.map((c) => c.id.toString()))
    } else {
      setSelectedConnections([])
    }
  }

  // Xử lý chọn/bỏ chọn một kết nối
  const handleSelectConnection = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedConnections((prev) => [...prev, id])
    } else {
      setSelectedConnections((prev) => prev.filter((connId) => connId !== id))
    }
  }

  // Xử lý chọn/bỏ chọn một nhóm
  const handleSelectGroup = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedGroups((prev) => [...prev, id])
    } else {
      setSelectedGroups((prev) => prev.filter((groupId) => groupId !== id))
    }
  }

  // Xử lý bật/tắt nhóm
  const handleToggleGroup = (id: number, newStatus: string) => {
    console.log(`Changing group ${id} status to ${newStatus}`)
    // Xử lý thay đổi trạng thái nhóm ở đây
  }

  // Xử lý xóa nhóm
  const handleDeleteGroup = (id: number) => {
    console.log(`Deleting group ${id}`)
    // Xử lý xóa nhóm ở đây
  }

  // Xử lý kết nối/ngắt kết nối
  const handleToggleConnection = (id: number, action: string) => {
    console.log(`${action} connection ${id}`)
    // Xử lý thay đổi trạng thái kết nối ở đây
  }

  // Xử lý chặn/bỏ chặn kết nối
  const handleBlockConnection = (id: number, block: boolean) => {
    console.log(`${block ? "Blocking" : "Unblocking"} connection ${id}`)
    // Xử lý chặn/bỏ chặn kết nối ở đây
  }

  // Xử lý sao chép địa chỉ
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    // Có thể thêm thông báo toast ở đây
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Master Trade</h1>
        <Button className="mt-4 md:mt-0 bg-green-500 hover:bg-green-600">Connect With Other Master</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create New Group */}
        <Card className="border-none shadow-md dark:shadow-blue-900/5 flex flex-col justify-center gap-8">
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-4">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium mb-1">
                  Group Name
                </label>
                <Input
                  id="groupName"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-gray-500 hover:bg-gray-600"
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
              >
                Create Group
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Group Management */}
        <Card className="border-none shadow-md dark:shadow-blue-900/5 lg:col-span-2">
          <CardContent className="p-4 !pb-0">
            <div className="flex gap-2 mb-4">
              <Button
                variant={selectedGroups.length > 0 ? "default" : "outline"}
                size="sm"
                className={selectedGroups.length > 0 ? "bg-green-500 hover:bg-green-600" : ""}
              >
                On{" "}
                <Badge variant="outline" className="ml-1 bg-white text-green-600">
                  {groups.filter((g) => g.status === "ON").length}
                </Badge>
              </Button>
              <Button variant="outline" size="sm">
                Off{" "}
                <Badge variant="outline" className="ml-1">
                  {groups.filter((g) => g.status === "OFF").length}
                </Badge>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={selectedGroups.length > 0 ? "text-red-500 border-red-200" : ""}
              >
                Delete{" "}
                <Badge variant="outline" className="ml-1">
                  {selectedGroups.length}
                </Badge>
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background">
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[200px]">Group Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((group) => (
                      <TableRow key={group.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium !py-2">
                          <div className="flex items-center">
                            <Checkbox
                              id={`group-${group.id}`}
                              checked={selectedGroups.includes(group.id)}
                              onCheckedChange={(checked) => handleSelectGroup(group.id, checked as boolean)}
                              className="mr-2"
                            />
                            <label htmlFor={`group-${group.id}`}>{group.name}</label>
                          </div>
                        </TableCell>
                        <TableCell className="!py-2">
                          <Badge
                            variant="outline"
                            className={
                              group.status === "ON"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                            }
                          >
                            {group.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right !py-2">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={
                                group.status === "OFF"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                                  : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                              }
                              onClick={() => handleToggleGroup(group.id, group.status === "ON" ? "OFF" : "ON")}
                            >
                              {group.status === "ON" ? "OFF" : "ON"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {groups.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                          No groups found. Create a new group to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {groups.length > 0 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button variant="outline" size="sm" disabled={true}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={false}>
                    Next
                  </Button>
                </div>
              )}
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
                    Pending{" "}
                    <Badge variant="outline" className="ml-1">
                      {connections.filter((c) => c.status === "pending").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="connected">
                    Connected{" "}
                    <Badge variant="outline" className="ml-1">
                      {connections.filter((c) => c.status === "connected").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="paused">
                    Paused{" "}
                    <Badge variant="outline" className="ml-1">
                      {connections.filter((c) => c.status === "paused").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="blocked">
                    Blocked{" "}
                    <Badge variant="outline" className="ml-1">
                      {connections.filter((c) => c.status === "blocked").length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <Button className="bg-green-500 hover:bg-green-600">Join</Button>
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
  )
}

// Component cho bảng kết nối
interface ConnectionsTableProps {
  connections: typeof connections
  selectedConnections: string[]
  onSelectAll: (checked: boolean) => void
  onSelectConnection: (id: string, checked: boolean) => void
  onToggleConnection: (id: number, action: string) => void
  onBlockConnection: (id: number, block: boolean) => void
  onCopyAddress: (address: string) => void
}

function ConnectionsTable({
  connections,
  selectedConnections,
  onSelectAll,
  onSelectConnection,
  onToggleConnection,
  onBlockConnection,
  onCopyAddress,
}: ConnectionsTableProps) {
  return (
    <div className="rounded-lg overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={connections.length > 0 && selectedConnections.length === connections.length}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[250px]">Wallet Address</TableHead>
              <TableHead>Joined Groups</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((connection) => (
              <TableRow key={connection.id} className="hover:bg-muted/30">
                <TableCell>
                  <Checkbox
                    checked={selectedConnections.includes(connection.id.toString())}
                    onCheckedChange={(checked) => onSelectConnection(connection.id.toString(), checked as boolean)}
                    aria-label={`Select connection ${connection.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span>{connection.walletAddress}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => onCopyAddress(connection.fullAddress)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {connection.joinedGroups.map((group, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                      >
                        {group}
                      </Badge>
                    ))}
                    {connection.joinedGroups.length === 0 && (
                      <span className="text-muted-foreground text-sm">No groups</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      connection.status === "connected"
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
                  {connection.status === "connected" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30"
                      onClick={() => onToggleConnection(connection.id, "disconnect")}
                    >
                      connect
                    </Button>
                  ) : connection.status === "blocked" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => onBlockConnection(connection.id, false)}
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => onBlockConnection(connection.id, true)}
                    >
                      Block
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {connections.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No connections found in this category.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {connections.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" disabled={true}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={false}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

