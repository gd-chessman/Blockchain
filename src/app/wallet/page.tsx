"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import {
  Copy,
  ExternalLink,
  CheckCircle,
  Circle,
  Plus,
  Download,
  Shield,
  ShieldOff,
  Trash,
  X,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Input } from "@/ui/input";
import { useLang } from "@/lang";
import { useQuery } from "@tanstack/react-query";
import {
  getInforWallet,
  getMyWallets,
  getPrivate,
  changeName,
  getListBuyToken,
} from "@/services/api/TelegramWalletService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/dialog";
import { Label } from "@/ui/label";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { TelegramWalletService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { ToastNotification } from "@/ui/toast";
import LogWarring from "@/ui/log-warring";
import { useRouter } from "next/navigation";
import WalletCards from "@/components/wallet/WalletCards";
import SolanaWalletSection from "@/components/wallet/SolanaWalletSection";
import AssetsSection from "@/components/wallet/AssetsSection";

export default function Wallet() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useLang();
  const { payloadToken, updateToken } = useAuth();
  const [isDerivingAddress, setIsDerivingAddress] = useState(false);
  const [walletName, setWalletName] = useState("-");
  const [isEditingWalletName, setIsEditingWalletName] = useState(false);
  const [editingWalletName, setEditingWalletName] = useState("");
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isImportWalletOpen, setIsImportWalletOpen] = useState(false);
  const [importWalletName, setImportWalletName] = useState("");
  const [importPrivateKey, setImportPrivateKey] = useState("");
  const [derivedSolanaAddress, setDerivedSolanaAddress] = useState<
    string | null
  >(null);
  const { data: walletInfor, refetch: refecthWalletInfor } = useQuery({
    queryKey: ["wallet-infor"],
    queryFn: getInforWallet,
  });
  const { data: myWallets, refetch: refetchInforWallets } = useQuery({
    queryKey: ["my-wallets"],
    queryFn: getMyWallets,
  });
  const { data: privateKeys } = useQuery({
    queryKey: ["private-keys"],
    queryFn: getPrivate,
  });
  const { data: tokenList, refetch: refetchTokenList } = useQuery({
    queryKey: ["token-buy-list"],
    queryFn: getListBuyToken,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Thêm state để quản lý popup
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [isPrivateKeyOpen, setIsPrivateKeyOpen] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Hàm xử lý sao chép địa chỉ
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage(t("notifications.addressCopied"));
    setShowToast(true);
  };

  // Thêm handlers
  const handleAddWallet = async () => {
    // Xử lý logic thêm ví ở đây
    const walletData = { name: newWalletName, type: "other" };
    const res = await TelegramWalletService.addWallet(walletData);
    setIsAddWalletOpen(false);
    setNewWalletName("");
    refetchInforWallets();
    setToastMessage("Wallet added successfully!");
    setShowToast(true);
  };

  const handleImportWallet = async () => {
    const walletData = {
      name: importWalletName,
      private_key: importPrivateKey,
      type: "import",
    };

    try {
      const res = await TelegramWalletService.addWallet(walletData);
      setIsImportWalletOpen(false);
      setImportWalletName("");
      setImportPrivateKey("");
      setDerivedSolanaAddress(null);
      refetchInforWallets();
      setToastMessage("Wallet imported successfully!");
      setShowToast(true);
    } catch (error) {
      setToastMessage(
        "Failed to import wallet. Please check your private key."
      );
      setShowToast(true);
    }
  };

  const handleDeleteWallet = async (id: string) => {
    const walletData = { wallet_id: id };
    const res = await TelegramWalletService.deleteWallet(walletData);
    refetchInforWallets();
    setToastMessage("Wallet deleted successfully!");
    setShowToast(true);
  };

  const handleImportPrivateKeyChange = async (value: string) => {
    setImportPrivateKey(value);

    // Reset derived address if input is empty
    if (!value.trim()) {
      setDerivedSolanaAddress(null);
      return;
    }

    // Only process if key looks like it could be valid
    if (value.length >= 32) {
      setIsDerivingAddress(true);

      try {
        // Slight delay to avoid UI freezing during processing
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Convert the private key string to a Uint8Array
        const privateKeyBytes = bs58.decode(value);

        // Create a keypair from the private key
        const keypair = Keypair.fromSecretKey(privateKeyBytes);

        // Get the public key (Solana address)
        const publicKey = keypair.publicKey.toString();

        // Update the state with the derived address
        setDerivedSolanaAddress(publicKey);
      } catch (error) {
        console.error("Error deriving Solana address:", error);
        setDerivedSolanaAddress(null);
      } finally {
        setIsDerivingAddress(false);
      }
    } else {
      setDerivedSolanaAddress(null);
      // If key is too short, don't show error yet
      if (value.length > 40) {
      }
    }
  };

  const handleChangeWallet = async (id: string) => {
    const res = await TelegramWalletService.useWallet({ wallet_id: id });
    updateToken(res.token);
    refecthWalletInfor();
    refetchTokenList();
  };

  const handleUpdateWalletName = async () => {
    try {
      const res = await TelegramWalletService.changeName({
        wallet_id: editingWalletId,
        name: editingWalletName || "-",
      });
      setIsEditingWalletName(false);
      setEditingWalletId(null);
      refecthWalletInfor();
      refetchInforWallets();
    } catch (error) {}
  };

  const formatBalance = (balance: number) => {
    if (balance >= 1) {
      return balance.toFixed(5);
    } else {
      const str = balance.toString();
      const decimalIndex = str.indexOf(".");
      if (decimalIndex === -1) return str;

      let firstNonZeroIndex = decimalIndex + 1;
      while (firstNonZeroIndex < str.length && str[firstNonZeroIndex] === "0") {
        firstNonZeroIndex++;
      }

      if (firstNonZeroIndex >= str.length) return str;

      // Ensure minimum of 5 decimal places
      const decimalPlaces = Math.max(firstNonZeroIndex - decimalIndex + 1, 5);
      return balance.toFixed(decimalPlaces);
    }
  };

  if(!isAuthenticated) return <LogWarring />;

  return (
    <div className="container mx-auto p-6">
      {showToast && (
        <ToastNotification
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
      {/* Wallet Info Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br bg-[#d8e8f7] text-black rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-orange-500/20 dark:shadow-orange-800/20 animate-float">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-wallet h-7 w-7"
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold font-comic bg-clip-text text-transparent bg-gradient-to-r bg-[#d8e8f7] uppercase">
            {t("wallet.title")}
          </h1>
        </div>

        <div className="mt-4 md:mt-0 flex items-center bg-white dark:bg-[#081e1b] px-3 py-1 shadow-sm border-2 border-dashed border-green-600 rounded-full">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              SOL Balance:
            </span>
            <Badge
              variant="outline"
              className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
            >
              {walletInfor?.solana_balance?.toFixed(5)} SOL
            </Badge>
          </div>
        </div>
      </div>

      {/* Wallet Cards */}
      <WalletCards payloadToken={payloadToken} />

      {/* Get Private Key Button */}
      <div className="flex justify-center mb-8">
        <Button
          className="bg-green-500 hover:bg-green-600 text-white font-medium"
          onClick={() => setIsPrivateKeyOpen(true)}
        >
          <Shield className="mr-2 h-5 w-5" />
          {t("wallet.getPrivateKey")}
        </Button>
      </div>

      {/* My Wallets Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-2xl font-bold">{t("wallet.solanaWallet")}</h2>
          <div className="flex gap-2">
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={() => setIsAddWalletOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("wallet.addWallet")}
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              onClick={() => setIsImportWalletOpen(true)}
            >
              <Download className="mr-2 h-4 w-4" />
              {t("wallet.importWallet")}
            </Button>
          </div>
        </div>

        <SolanaWalletSection
          myWallets={myWallets}
          walletInfor={walletInfor}
          isEditingWalletName={isEditingWalletName}
          editingWalletId={editingWalletId}
          editingWalletName={editingWalletName}
          setIsEditingWalletName={setIsEditingWalletName}
          setEditingWalletId={setEditingWalletId}
          setEditingWalletName={setEditingWalletName}
          handleUpdateWalletName={handleUpdateWalletName}
          handleCopy={handleCopy}
          handleChangeWallet={handleChangeWallet}
          handleDeleteWallet={handleDeleteWallet}
        />
      </div>

      {/* Dialog for adding new wallet */}
      <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t("wallet.dialog.addNewWallet")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="wallet-name">
                {t("wallet.dialog.walletName")}
              </Label>
              <Input
                id="wallet-name"
                placeholder={t("wallet.dialog.enterWalletName")}
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900/50"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddWalletOpen(false);
                setNewWalletName("");
              }}
            >
              {t("wallet.dialog.cancel")}
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleAddWallet}
              disabled={!newWalletName.trim()}
            >
              {t("wallet.dialog.addWallet")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isImportWalletOpen}
        onOpenChange={(isOpen) => {
          setIsImportWalletOpen(isOpen);
          if (!isOpen) {
            setImportWalletName("");
            setImportPrivateKey("");
            setDerivedSolanaAddress(null); // Xóa giá trị Derived Solana Address
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t("wallet.dialog.importWallet")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="import-wallet-name">
                {t("wallet.dialog.walletName")}
              </Label>
              <Input
                id="import-wallet-name"
                placeholder={t("wallet.dialog.enterWalletName")}
                value={importWalletName}
                onChange={(e) => setImportWalletName(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900/50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="solana-private-key">
                {t("wallet.dialog.solanaPrivateKey")}
              </Label>
              <div className="relative">
                <Input
                  id="solana-private-key"
                  placeholder={t("wallet.dialog.enterSolanaPrivateKey")}
                  value={importPrivateKey}
                  onChange={(e) => handleImportPrivateKeyChange(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-900/50 pr-20"
                  type={showPrivateKey ? "text" : "password"}
                />
                <div className="absolute right-0 top-0 h-full flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(importPrivateKey);
                    }}
                    disabled={!importPrivateKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-full"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                  >
                    {showPrivateKey ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <ShieldOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {t("wallet.dialog.privateKeySecurity")}
              </p>
              {derivedSolanaAddress && (
                <div className="mt-2">
                  <Label htmlFor="derived-solana-address">
                    {t("wallet.dialog.derivedSolanaAddress")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="derived-solana-address"
                      value={derivedSolanaAddress}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-900/50 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(derivedSolanaAddress);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("wallet.dialog.derivedAddressInfo")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsImportWalletOpen(false);
                setImportWalletName("");
                setImportPrivateKey("");
              }}
            >
              {t("wallet.dialog.cancel")}
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleImportWallet}
              disabled={!importWalletName.trim() || !importPrivateKey.trim()}
            >
              {t("wallet.dialog.importWallet")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Private Keys Modal */}
      <Dialog open={isPrivateKeyOpen} onOpenChange={setIsPrivateKeyOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t("wallet.dialog.privateKeys")}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="text-sm"
              >
                {showPrivateKey
                  ? t("wallet.dialog.hideKeys")
                  : t("wallet.dialog.showKeys")}
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="solana-key">
                {t("wallet.dialog.solanaPrivateKey")}
              </Label>
              <div className="relative">
                <Input
                  id="solana-key"
                  value={
                    showPrivateKey
                      ? privateKeys?.sol_private_key
                      : "••••••••••••••••••••••••••••••••"
                  }
                  readOnly
                  className="pr-10 bg-gray-50 dark:bg-gray-900/50 truncate"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(privateKeys?.sol_private_key);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="eth-key">
                {t("wallet.dialog.ethereumPrivateKey")}
              </Label>
              <div className="relative">
                <Input
                  id="eth-key"
                  value={
                    showPrivateKey
                      ? privateKeys?.eth_private_key
                      : "••••••••••••••••••••••••••••••••"
                  }
                  readOnly
                  className="pr-10 bg-gray-50 dark:bg-gray-900/50 truncate"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(privateKeys?.eth_private_key);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bnb-key">
                {t("wallet.dialog.bnbPrivateKey")}
              </Label>
              <div className="relative">
                <Input
                  id="bnb-key"
                  value={
                    showPrivateKey
                      ? privateKeys?.bnb_private_key
                      : "••••••••••••••••••••••••••••••••"
                  }
                  readOnly
                  className="pr-10 bg-gray-50 dark:bg-gray-900/50 truncate"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(privateKeys?.bnb_private_key);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPrivateKeyOpen(false);
                setShowPrivateKey(false);
              }}
            >
              {t("wallet.dialog.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assets Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t("wallet.asset")}</h2>
      </div>

      <AssetsSection tokens={tokenList?.tokens} />
    </div>
  );
}
