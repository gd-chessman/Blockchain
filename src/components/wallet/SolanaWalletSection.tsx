import { TableCell } from '@/ui/table';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Input } from '@/ui/input';
import { Table, TableRow, TableBody, TableHead, TableHeader } from '@/ui/table';
import { Circle, Copy, Trash, CheckCircle, X } from 'lucide-react';
import React, { useState } from 'react'
import { useLang } from '@/lang';
import { Badge } from '@/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui/dialog";

interface Wallet {
  wallet_id: string;
  wallet_name: string;
  wallet_type: string;
  solana_address: string;
  eth_address: string;
  wallet_auth: string;
}

interface SolanaWalletSectionProps {
  myWallets: Wallet[];
  walletInfor: {
    solana_address: string;
  };
  isEditingWalletName: boolean;
  editingWalletId: string | null;
  editingWalletName: string;
  setIsEditingWalletName: (value: boolean) => void;
  setEditingWalletId: (id: string | null) => void;
  setEditingWalletName: (name: string) => void;
  handleUpdateWalletName: () => void;
  handleCopy: (text: string) => void;
  handleChangeWallet: (id: string) => void;
  handleDeleteWallet: (id: string) => void;
}

export default function SolanaWalletSection({
  myWallets,
  walletInfor,
  isEditingWalletName,
  editingWalletId,
  editingWalletName,
  setIsEditingWalletName,
  setEditingWalletId,
  setEditingWalletName,
  handleUpdateWalletName,
  handleCopy,
  handleChangeWallet,
  handleDeleteWallet,
}: SolanaWalletSectionProps) {
  const { t } = useLang();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<string | null>(null);

  const handleDeleteClick = (walletId: string) => {
    setWalletToDelete(walletId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (walletToDelete) {
      handleDeleteWallet(walletToDelete);
      setDeleteDialogOpen(false);
      setWalletToDelete(null);
    }
  };

  return (
    <>
      <Card className="border-none dark:shadow-blue-900/5">
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className='bg-background'>
                <TableRow className="bg-muted/50">
                  <TableHead>{t("wallet.table.walletName")}</TableHead>
                  <TableHead>{t("wallet.table.type")}</TableHead>
                  <TableHead>{t("wallet.table.solanaAddress")}</TableHead>
                  <TableHead>{t("wallet.table.ethBnbAddress")}</TableHead>
                  <TableHead>{t("wallet.table.keyWallet")}</TableHead>
                  <TableHead>{t("wallet.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(myWallets) &&
                  myWallets?.map((wallet: Wallet, index: number) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center">
                          {isEditingWalletName &&
                          editingWalletId === wallet.wallet_id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingWalletName}
                                onChange={(e) =>
                                  setEditingWalletName(e.target.value)
                                }
                                className="h-7 w-40"
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={handleUpdateWalletName}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => {
                                  setIsEditingWalletName(false);
                                  setEditingWalletId(null);
                                }}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ) : (
                            <span
                              className="cursor-pointer hover:text-blue-500"
                              onClick={() => {
                                setIsEditingWalletName(true);
                                setEditingWalletId(wallet.wallet_id);
                                setEditingWalletName(
                                  wallet.wallet_name || "-"
                                );
                              }}
                            >
                              {wallet.wallet_name || "-"}
                            </span>
                          )}
                          {!isEditingWalletName && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 ml-1 hover:text-blue-500"
                              onClick={() => {
                                setIsEditingWalletName(true);
                                setEditingWalletId(wallet.wallet_id);
                                setEditingWalletName(
                                  wallet.wallet_name || "-"
                                );
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-edit"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                        {t(`navigation.selectWallet.walletType.${wallet.wallet_type?.toLowerCase() || 'primary'}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>
                            {wallet.solana_address.slice(0, 6)}...
                            {wallet.solana_address.slice(-4)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(wallet.solana_address);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>
                            {wallet.eth_address
                              ? `${wallet.eth_address.slice(
                                  0,
                                  6
                                )}...${wallet.eth_address.slice(-4)}`
                              : "N/A"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(wallet.eth_address);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                        >
                          {t(`navigation.selectWallet.walletAuth.${wallet.wallet_auth?.toLowerCase() || 'owner'}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-blue-600"
                            onClick={() =>
                              handleChangeWallet(wallet.wallet_id)
                            }
                          >
                            {walletInfor?.solana_address ===
                            wallet.solana_address ? (
                              <CheckCircle
                                className="h-4 w-4"
                                color="green"
                              />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                          </Button>

                          {walletInfor?.solana_address !==
                            wallet.solana_address &&
                          wallet.wallet_type !== "main" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-blue-600"
                              onClick={() => handleDeleteClick(wallet.wallet_id)}
                            >
                              <Trash size={24} color="red" />
                            </Button>
                          ) : (
                            ""
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("wallet.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("wallet.delete.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("wallet.delete.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              {t("wallet.delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
