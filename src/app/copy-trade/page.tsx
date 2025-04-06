"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Star, CheckCircle2, XCircle } from "lucide-react";
import { useLang } from "@/lang";

export default function CopyTrade() {
  const { t } = useLang();

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">{t('copyTrade.title')}</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
        </div>
      </div>

      <Tabs defaultValue="success" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="success" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {t('copyTrade.success')}
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            {t('copyTrade.failed')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="success" className="mt-6">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </Avatar>
                    <div>
                      <CardTitle>BTC/USDT</CardTitle>
                      <CardDescription>Long Position</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-500"
                  >
                    +$250.00
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entry Price</p>
                    <p className="font-medium">$45,200.00</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Exit Price</p>
                    <p className="font-medium">$45,700.00</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Closed 2 hours ago
              </CardFooter>
            </Card>

            <TabsContent value="success" className="mt-6">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                        </Avatar>
                        <div>
                          <CardTitle>BTC/USDT</CardTitle>
                          <CardDescription>Long Position</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-500"
                      >
                        +$250.00
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Entry Price</p>
                        <p className="font-medium">$45,200.00</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Exit Price</p>
                        <p className="font-medium">$45,700.00</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Closed 2 hours ago
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                        </Avatar>
                        <div>
                          <CardTitle>SOL/USDT</CardTitle>
                          <CardDescription>Short Position</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-500"
                      >
                        +$180.00
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Entry Price</p>
                        <p className="font-medium">$98.50</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Exit Price</p>
                        <p className="font-medium">$96.70</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Closed 5 hours ago
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                        </Avatar>
                        <div>
                          <CardTitle>BNB/USDT</CardTitle>
                          <CardDescription>Long Position</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-500"
                      >
                        +$320.00
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Entry Price</p>
                        <p className="font-medium">$310.00</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Exit Price</p>
                        <p className="font-medium">$315.00</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Closed 1 day ago
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="failed" className="mt-6">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-destructive" />
                          </div>
                        </Avatar>
                        <div>
                          <CardTitle>ETH/USDT</CardTitle>
                          <CardDescription>Short Position</CardDescription>
                        </div>
                      </div>
                      <Badge variant="destructive">-$150.00</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Entry Price</p>
                        <p className="font-medium">$2,300.00</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Exit Price</p>
                        <p className="font-medium">$2,450.00</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Closed 5 hours ago
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-destructive" />
                          </div>
                        </Avatar>
                        <div>
                          <CardTitle>DOGE/USDT</CardTitle>
                          <CardDescription>Long Position</CardDescription>
                        </div>
                      </div>
                      <Badge variant="destructive">-$75.00</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Entry Price</p>
                        <p className="font-medium">$0.085</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Exit Price</p>
                        <p className="font-medium">$0.082</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Closed 1 day ago
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-destructive" />
                          </div>
                        </Avatar>
                        <div>
                          <CardTitle>XRP/USDT</CardTitle>
                          <CardDescription>Short Position</CardDescription>
                        </div>
                      </div>
                      <Badge variant="destructive">-$200.00</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Entry Price</p>
                        <p className="font-medium">$0.52</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Exit Price</p>
                        <p className="font-medium">$0.55</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Closed 2 days ago
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </div>
        </TabsContent>

        <TabsContent value="failed" className="mt-6">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-destructive" />
                      </div>
                    </Avatar>
                    <div>
                      <CardTitle>ETH/USDT</CardTitle>
                      <CardDescription>Short Position</CardDescription>
                    </div>
                  </div>
                  <Badge variant="destructive">-$150.00</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entry Price</p>
                    <p className="font-medium">$2,300.00</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Exit Price</p>
                    <p className="font-medium">$2,450.00</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Closed 5 hours ago
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
