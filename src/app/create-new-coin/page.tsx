"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"

// Dữ liệu mẫu cho danh sách coin
const memeCoins = [
  {
    id: 1,
    name: "A Phú",
    symbol: "apu",
    address: "EfUK5G...1J3t",
    decimals: 9,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Wao Wao",
    symbol: "wao",
    address: "C8eKC6...SHP8",
    decimals: 9,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Ba Khánh",
    symbol: "BK",
    address: "DH6zw6...HMWT",
    decimals: 9,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Phùng Khánh",
    symbol: "PK",
    address: "4SHrFe...5Xgf",
    decimals: 9,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "PULY",
    symbol: "puly",
    address: "AaYBq3...j4aw",
    decimals: 9,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Meme Funny",
    symbol: "mefun",
    address: "488WXn...rHc6",
    decimals: 9,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Phùng Khanh",
    symbol: "PBK",
    address: "6FdxeU...zk8Y",
    decimals: 9,
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function CreateCoin() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    amount: "",
    description: "",
    logo: null,
    telegram: "",
    website: "",
    twitter: "",
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev: any) => ({ ...prev, logo: file }))

      // Tạo URL preview cho hình ảnh
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Xử lý tạo coin ở đây
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    // Có thể thêm thông báo toast ở đây
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Coin</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">Create and manage your own meme coins</div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-6">
          <TabsTrigger value="create">Create New Coin</TabsTrigger>
          <TabsTrigger value="my-coins">My Coins</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-md dark:shadow-blue-900/5">
              <CardHeader>
                <CardTitle>Create New Coin</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder=""
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="symbol" className="block text-sm font-medium mb-1">
                      Symbol
                    </label>
                    <Input
                      id="symbol"
                      name="symbol"
                      placeholder=""
                      value={formData.symbol}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium mb-1">
                      Amount
                    </label>
                    <div className="relative">
                      <Input
                        id="amount"
                        name="amount"
                        placeholder="Enter initial liquidity amount in SOL"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        (SOL)
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder=""
                        value={formData.description}
                        onChange={handleInputChange}
                        className="h-32"
                      />
                    </div>

                    <div>
                      <label htmlFor="logo" className="block text-sm font-medium mb-1">
                        Logo <span className="text-muted-foreground">*</span>
                      </label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 h-32">
                        {logoPreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={logoPreview || "/placeholder.svg"}
                              alt="Logo preview"
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              onClick={() => {
                                setLogoPreview(null)
                                setFormData((prev) => ({ ...prev, logo: null }))
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 text-muted-foreground"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-xs text-muted-foreground mt-2">Click to upload</span>
                            <Input
                              id="logo"
                              name="logo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-blue-500"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      {showAdvanced ? "Hide Options" : "Show Options"}
                    </Button>
                  </div>

                  {showAdvanced && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label htmlFor="telegram" className="block text-sm font-medium mb-1">
                          Telegram
                        </label>
                        <Input
                          id="telegram"
                          name="telegram"
                          placeholder="Enter Telegram group link"
                          value={formData.telegram}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium mb-1">
                          Website
                        </label>
                        <Input
                          id="website"
                          name="website"
                          placeholder="Enter website URL"
                          value={formData.website}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium mb-1">
                          Twitter
                        </label>
                        <Input
                          id="twitter"
                          name="twitter"
                          placeholder="Enter Twitter username"
                          value={formData.twitter}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 mt-6">
                    Create Coin
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="hidden md:block">
              <Card className="border-none shadow-md dark:shadow-blue-900/5 h-full">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    {logoPreview ? (
                      <div className="mb-4">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="size-48 object-contain mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4 mx-auto">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <h3 className="text-xl font-bold">{formData.name || "Your Coin Name"}</h3>
                    <p className="text-sm mt-1">{formData.symbol ? formData.symbol.toUpperCase() : "SYMBOL"}</p>
                    <p className="mt-4 text-sm">{formData.description || "Your coin description will appear here"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-coins">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>My Coins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Meme Coin</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Decimals</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memeCoins.map((coin) => (
                      <TableRow key={coin.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <img src={coin.image} alt={coin.name} />
                              <p>{coin.symbol.substring(0, 2).toUpperCase()}</p>
                            </Avatar>
                            <span>{coin.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{coin.symbol}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span>{coin.address}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => handleCopyAddress(coin.address)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{coin.decimals}</TableCell>
                        <TableCell>
                          <Button className="bg-green-500 hover:bg-green-600 text-white h-8">Trade</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

