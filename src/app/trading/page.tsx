"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { t } from "@/lang";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { SolonaTokenService } from "@/services/api";

export default function Trading() {
  const [searchQuery, setSearchQuery] = useState("");
  const { messages } = useWebSocket();
  const [tokens, setTokens] = useState<
    {
      name: string;
      address: string;
      symbol: string;
      decimals: number;
      isVerified: boolean;
    }[]
  >([]);
  const router = useRouter();

  // Parse messages and extract tokens
  useEffect(() => {
    if (Array.isArray(messages)) {
      messages.forEach((message) => {
        try {
          const parsedMessage = JSON.parse(message);
          setTokens(parsedMessage.data.data.tokens);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    } else {
      console.error("messages is not an array:", messages);
    }
  }, [messages]); // Runs every time messages change

  const searchData = async()=>{
    const res = await SolonaTokenService.getSearchTokenInfor(searchQuery)
    console.log(res)
  }


  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6 border-none shadow-md dark:shadow-blue-900/5">
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle>{t("trading.list_token_title")}</CardTitle>
          <div className="relative w-full md:w-auto mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" onClick={()=> searchData()}/>
            <Input
              placeholder={"Search by token name or address"}
              className="pl-10 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        {tokens && (
          <CardContent>
            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{t("trading.token")}</TableHead>
                    <TableHead>{t("trading.symbol")}</TableHead>
                    <TableHead>{t("trading.address")}</TableHead>
                    <TableHead>{t("trading.decimals")}</TableHead>
                    <TableHead>{t("trading.verified")}</TableHead>
                    <TableHead>{t("trading.action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-muted/30 cursor-pointer"
                      onClick={() =>
                        router.push(`trading/token?address=${token.address}`)
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src="https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045-2.jpg"
                            alt="token logo"
                            className="size-10 rounded-full"
                          />
                          <p>{token.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{token.symbol}</TableCell>
                      <TableCell>{token.address}</TableCell>
                      <TableCell>{token.decimals}</TableCell>
                      <TableCell>{token.isVerified ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 dark:bg-blue-900/20 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30"
                          >
                            {t("trading.buy")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
