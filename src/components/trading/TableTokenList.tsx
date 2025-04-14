import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import { Copy, ExternalLink, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lang";
import { truncateString } from "@/utils/format";
import { Card, CardContent } from "@/ui/card";

interface Token {
  id: number;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoUrl: string;
  coingeckoId: string | null;
  tradingviewSymbol: string | null;
  isVerified: boolean;
  marketCap: number;
  liquidity: any;
}

interface TableTokenListProps {
  tokens: Token[];
  onCopyAddress: (address: string, e: React.MouseEvent) => void;
  onStarClick?: (token: Token) => void;
  isFavoritesTab?: boolean;
}

export function TableTokenList({ tokens, onCopyAddress, onStarClick, isFavoritesTab = false }: TableTokenListProps) {
  const router = useRouter();
  const { t } = useLang();

  return (
    <Card className="border-none dark:shadow-blue-900/5">
      <CardContent className="p-0">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("trading.token")}</TableHead>
                <TableHead>{t("trading.symbol")}</TableHead>
                <TableHead>{t("trading.address")}</TableHead>
                <TableHead>{t("trading.liquidity")}</TableHead>
                <TableHead>{t("trading.marketCap")}</TableHead>
                <TableHead>{t("trading.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-muted/30 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  onClick={() =>
                    router.push(`trading/token?address=${token.address}`)
                  }
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 p-0 hover:text-yellow-500 ${isFavoritesTab ? 'text-yellow-500' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onStarClick?.(token);
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <img
                        src={token.logoUrl || "/placeholder.png"}
                        alt="token logo"
                        className="size-12 rounded-full"
                      />
                      <p>{token.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{token.symbol}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[200px]">
                        {truncateString(token.address, 14)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
                        onClick={(e) => onCopyAddress(token.address, e)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{Number(token.liquidity)?.toFixed(1)}</TableCell>
                  <TableCell>
                    {/* <span className={token.isVerified ? "text-green-500" : "text-red-500"}> */}
                      {Number(token.marketCap)?.toFixed(1)}
                    {/* </span> */}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 border-purple-300 dark:border-purple-700 rounded-full"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        {t("trading.trade")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
