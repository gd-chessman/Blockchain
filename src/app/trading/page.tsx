'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { t } from "@/lang"


const tokens = [
  {
    name: 'ARCHIE',
    symbol: 'ENDIT',
    address: 'BBbk8Msyp8viNcZcWjSJc6rPGj1DKXaT72dktdtMpump',
    decimals: 18,
    verified: 'Yes',
    actions: ['Buy']
  },
  {
    name: 'ARCHIE',
    symbol: 'ENDIT',
    address: 'BBbk8Msyp8viNcZcWjSJc6rPGj1DKXaT72dktdtMpump',
    decimals: 18,
    verified: 'Yes',
    actions: ['Buy']
  },
  // Thêm các dữ liệu token khác nếu cần
];

export default function Trading() {

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6 border-none shadow-md dark:shadow-blue-900/5">
        <CardHeader>
          <CardTitle>{t("trading.list_token_title")}</CardTitle>
          {/* <CardDescription>Your cryptocurrency holdings</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Token</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Decimals</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map((token, index) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img src="https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045-2.jpg" alt="" className="size-10 rounded-full" />
                        <p>{token.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{token.symbol}</TableCell>
                    <TableCell>{token.address}</TableCell>
                    <TableCell>{token.decimals}</TableCell>
                    <TableCell>{token.verified}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {token.actions.map((action, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 dark:bg-blue-900/20 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
