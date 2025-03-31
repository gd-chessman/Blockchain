"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TrendingUp, Users, Award, Check } from "lucide-react"

export default function MasterTrade() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Master Trade</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">Share your expertise and earn commissions</div>
      </div>

      <Tabs defaultValue="become">
        <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex mb-6">
          <TabsTrigger value="become">Become a Master Trader</TabsTrigger>
          <TabsTrigger value="dashboard">Master Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="become">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6 border-none shadow-md dark:shadow-blue-900/5">
                <CardHeader>
                  <CardTitle>Become a Master Trader</CardTitle>
                  <CardDescription>Share your trading expertise and earn commissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Display Name</Label>
                      <Input id="name" placeholder="Your trading name" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="experience">Trading Experience (years)</Label>
                      <Input id="experience" type="number" placeholder="5" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell followers about your trading strategy and experience"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="strategy">Trading Strategy</Label>
                    <Textarea id="strategy" placeholder="Describe your trading approach" className="mt-1" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="public" />
                      <Label htmlFor="public">Make profile public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications">Allow follower notifications</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">Submit Application</Button>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-md dark:shadow-blue-900/5">
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>Criteria to become a Master Trader</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>Minimum of 6 months trading history on our platform</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>Positive ROI over the last 3 months</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>At least $5,000 in trading volume</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>Complete KYC verification</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mb-6 border-none shadow-md dark:shadow-blue-900/5">
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                  <CardDescription>Why become a Master Trader</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-3">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Earn Commissions</div>
                        <div className="text-sm text-muted-foreground">
                          Get up to 20% of trading fees from your followers
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-3">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Build a Following</div>
                        <div className="text-sm text-muted-foreground">
                          Grow your reputation in the trading community
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-3">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Advanced Analytics</div>
                        <div className="text-sm text-muted-foreground">
                          Access to premium trading tools and insights
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md dark:shadow-blue-900/5">
                <CardHeader>
                  <CardTitle>Commission Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-900/50 rounded-md">
                      <span>1-10 followers</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-900/50 rounded-md">
                      <span>11-50 followers</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-900/50 rounded-md">
                      <span>51+ followers</span>
                      <span className="font-medium">20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dashboard">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Master Trader Dashboard</CardTitle>
              <CardDescription>Manage your followers and analyze performance</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
              <div className="text-center">
                <div className="mb-2">You are not a Master Trader yet</div>
                <Button
                  // onClick={() => document.querySelector('[value="become"]')?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>Trading Analytics</CardTitle>
              <CardDescription>Detailed insights into your trading performance</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
              <div className="text-center">
                <div className="mb-2">Analytics are available for Master Traders</div>
                <Button
                  // onClick={() => document.querySelector('[value="become"]')?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

