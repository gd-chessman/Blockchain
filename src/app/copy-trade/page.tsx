import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Star } from "lucide-react"

export default function CopyTrade() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Copy Trade</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          Copy successful traders and earn passive income
        </div>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="traders">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
            <TabsTrigger value="traders">Top Traders</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="history">Copy History</TabsTrigger>
          </TabsList>

          <TabsContent value="traders" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-none shadow-md dark:shadow-blue-900/5 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3 border-2 border-blue-100 dark:border-blue-900">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                            T{i}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">Trader {i}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{1234 + i * 100} followers</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={i % 3 === 0 ? "default" : i % 3 === 1 ? "secondary" : "outline"}
                        className={i % 3 === 0 ? "bg-blue-500" : ""}
                      >
                        {i % 3 === 0 ? "Pro" : i % 3 === 1 ? "Expert" : "Verified"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-lg bg-white/50 dark:bg-gray-900/50">
                      <div>
                        <div className="text-sm text-muted-foreground">Profit (30d)</div>
                        <div className="text-lg font-bold text-green-500">+{12 + i * 2}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                        <div className="text-lg font-bold">{65 + i}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">AUM</div>
                        <div className="text-lg font-bold">${(50000 + i * 10000).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= (4 + (i % 2)) ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="h-[60px] mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-muted-foreground">Performance</div>
                        <div className="text-xs font-medium text-green-500">+{12 + i * 2}%</div>
                      </div>
                      <div className="h-[40px] bg-muted rounded-md overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Copy Trader</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="following" className="mt-6">
            <Card className="border-none shadow-md dark:shadow-blue-900/5">
              <CardHeader>
                <CardTitle>Traders You're Following</CardTitle>
                <CardDescription>Manage your copy trading settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-md bg-white/50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3 border-2 border-blue-100 dark:border-blue-900">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                            T{i}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Trader {i}</div>
                          <div className="text-sm text-green-500">+{15 + i * 3}% (30d)</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Copying with</div>
                        <div className="font-medium">${(1000 * i).toLocaleString()}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      >
                        Settings
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center justify-center p-8 border border-dashed rounded-md text-muted-foreground">
                    You're not following any other traders
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="border-none shadow-md dark:shadow-blue-900/5">
              <CardHeader>
                <CardTitle>Copy Trading History</CardTitle>
                <CardDescription>Your past copy trading performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 border border-dashed rounded-md text-muted-foreground">
                  No copy trading history available
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

