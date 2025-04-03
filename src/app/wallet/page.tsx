"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, ExternalLink, Plus, Download, Shield, ShieldOff, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { t } from "@/lang"
import { useQuery } from "@tanstack/react-query"
import { getInforWallets, getMyWallets, getPrivate } from "@/services/api/TelegramWalletService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import bs58 from 'bs58';
import { Keypair } from '@solana/web3.js';
import { TelegramWalletService } from "@/services/api"

export default function Wallet() {
  const [isDerivingAddress, setIsDerivingAddress] = useState(false);
  const [walletName, setWalletName] = useState("-")
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isImportWalletOpen, setIsImportWalletOpen] = useState(false)
const [importWalletName, setImportWalletName] = useState("")
const [importPrivateKey, setImportPrivateKey] = useState("")
const [derivedSolanaAddress, setDerivedSolanaAddress] = useState<string | null>(null);
  const { data: inforWallets, refetch: refetchInforWallets } = useQuery({
    queryKey: ['infor-wallet'],
    queryFn: getMyWallets,
  });
  const { data: privateKeys } = useQuery({
    queryKey: ['private-keys'],
    queryFn: getPrivate,
  });

  // Thêm state để quản lý popup
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false)
  const [newWalletName, setNewWalletName] = useState("")
  const [isPrivateKeyOpen, setIsPrivateKeyOpen] = useState(false);

  // Hàm xử lý sao chép địa chỉ
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!") 
    // Có thể thêm thông báo toast ở đây
  }

  // Thêm handlers
  const handleAddWallet = async() => {
    // Xử lý logic thêm ví ở đây
    const walletData = {name: newWalletName, type: "other"}
    const res = await TelegramWalletService.addWallet(walletData)
    setIsAddWalletOpen(false)
    setNewWalletName("")
    refetchInforWallets()
    toast.success("Wallet added successfully!") // Thông báo thành công
  }
  const handleImportWallet = async () => {
    const walletData = {
      name: importWalletName, 
      private_key: importPrivateKey,
      type: "import"
    }
    
    try {
      const res = await TelegramWalletService.addWallet(walletData)
      setIsImportWalletOpen(false)
      setImportWalletName("")
      setImportPrivateKey("")
      setDerivedSolanaAddress(null) // Xóa giá trị Derived Solana Address
      refetchInforWallets()
      toast.success("Wallet imported successfully!")
    } catch (error) {
      toast.error("Failed to import wallet. Please check your private key.")
    }
  }

  const handleDeleteWallet = async(id: string) => {
      // Xử lý logic xóa ví ở đây
      const walletData = {wallet_id: id}
      const res = await TelegramWalletService.deleteWallet(walletData)
      refetchInforWallets()
      toast.success("Wallet deleted successfully!") // Thông báo thành công
  }

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
            await new Promise(resolve => setTimeout(resolve, 100));

            // Convert the private key string to a Uint8Array
            const privateKeyBytes = bs58.decode(value);

            // Create a keypair from the private key
            const keypair = Keypair.fromSecretKey(privateKeyBytes);

            // Get the public key (Solana address)
            const publicKey = keypair.publicKey.toString();

            // Update the state with the derived address
            setDerivedSolanaAddress(publicKey);
        } catch (error) {
            console.error('Error deriving Solana address:', error);
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




  return (
    <div className="container mx-auto p-6">
      {/* Wallet Info Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M22 10h-4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">{t('wallet.title')}</h1>
        </div>

        <div className="mt-4 md:mt-0 flex items-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
          <div className="mr-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">Wallet Name:</span>
            <span className="ml-2 font-medium">{walletName}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">SOL Balance:</span>
            <Badge
              variant="outline"
              className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
            >
              0.0000 SOL
            </Badge>
          </div>
        </div>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Solana Wallet */}
        <Card className="border-none shadow-md dark:shadow-blue-900/5">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 397.7 311.7"
                  fill="currentColor"
                  className="text-purple-500"
                >
                  <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8zM333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">{t('wallet.solanaWallet')}</h2>
            </div>

            <div className="relative mb-4">
              <Input value="2Exba5...KTyP" readOnly className="pr-10 bg-gray-50 dark:bg-gray-900/50" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => handleCopy("2Exba57zoxmHZQmkhVwkNw3chuNyNvX9viWR3LKTyP")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 break-all">
              2Exba57zoxmHZQmkhVwkNw3chuNyNvX9viWR3LKTyP
            </div>
          </CardContent>
        </Card>

        {/* ETH Wallet */}
        <Card className="border-none shadow-md dark:shadow-blue-900/5">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 784.37 1277.39"
                  fill="currentColor"
                  className="text-blue-500"
                >
                  <path d="M392.07 0l-8.57 29.11v844.63l8.57 8.55 392.06-231.75Z" />
                  <path d="M392.07 0L0 650.54l392.07 231.75V472.33Z" />
                  <path d="M392.07 956.52l-4.83 5.89v300.87l4.83 14.1 392.3-552.49Z" />
                  <path d="M392.07 1277.38V956.52L0 724.89Z" />
                  <path d="M392.07 882.29l392.06-231.75-392.06-178.21Z" />
                  <path d="M0 650.54l392.07 231.75V472.33Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">{t('wallet.ethWallet')}</h2>
            </div>

            <div className="relative mb-4">
              <Input value="0x8D5A...E131" readOnly className="pr-10 bg-gray-50 dark:bg-gray-900/50" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => handleCopy("0x8D5A62fbc40f262EEa07D2F6Fe8805F9c7C7E131")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 break-all">
              0x8D5A62fbc40f262EEa07D2F6Fe8805F9c7C7E131
            </div>
          </CardContent>
        </Card>

        {/* BNB Wallet */}
        <Card className="border-none shadow-md dark:shadow-blue-900/5">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 2500 2500"
                  fill="currentColor"
                  className="text-yellow-500"
                >
                  <path d="M764.48,1050.52,1250,565l485.75,485.73,282.5-282.5L1250,0,482,768l282.49,282.5M0,1250,282.51,967.45,565,1249.94,282.49,1532.45Zm764.48,199.51L1250,1935l485.74-485.72,282.65,282.35-.14.15L1250,2500,482,1732l-.4-.4,282.91-282.12M1935,1250.12l282.51-282.51L2500,1250.1l-282.5,282.51Z" />
                  <path d="M1536.52,1249.85h.12L1250,963.19,1038.13,1175h0l-24.34,24.35-50.2,50.21-.4.39.4.41L1250,1536.81l286.66-286.66.14-.16-.26-.14" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">{t('wallet.bnbWallet')}</h2>
            </div>

            <div className="relative mb-4">
              <Input value="0x8D5A...E131" readOnly className="pr-10 bg-gray-50 dark:bg-gray-900/50" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => handleCopy("0x8D5A62fbc40f262EEa07D2F6Fe8805F9c7C7E131")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 break-all">
              0x8D5A62fbc40f262EEa07D2F6Fe8805F9c7C7E131
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Get Private Key Button */}
      <div className="flex justify-center mb-8">
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white font-medium"
          onClick={() => setIsPrivateKeyOpen(true)}
        >
          <Shield className="mr-2 h-5 w-5" />
          {t('wallet.getPrivateKey')}
        </Button>
      </div>

      {/* My Wallets Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t('wallet.solanaWallet')}</h2>
          <div className="flex gap-2">
            <Button 
              className="bg-green-500 hover:bg-green-600" 
              onClick={() => setIsAddWalletOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Wallet
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              onClick={() => setIsImportWalletOpen(true)}
            >
              <Download className="mr-2 h-4 w-4" />
              Import Wallet
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-md dark:shadow-blue-900/5">
          <CardContent className="p-0">
            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Wallet Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Solana Address</TableHead>
                    <TableHead>ETH/BNB Address</TableHead>
                    <TableHead>key/wallet.a...</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inforWallets?.map((wallet:any, index: string) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center">
                          <span>{wallet.wallet_name}</span>
                          <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                          {wallet.type || "Primary"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="truncate w-64">{wallet.solana_address}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-6 w-6"
                            onClick={() => handleCopy(wallet.solana_address)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>{wallet.eth_address || "N/A"}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-6 w-6"
                            onClick={() => handleCopy(wallet.eth_address)}
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
                          {wallet.wallet_auth}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600" onClick={()=> handleDeleteWallet(wallet.wallet_id)}>
                            <Trash size={24} color="red" />
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
      </div>

      {/* Dialog for adding new wallet */}
      <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Wallet</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="wallet-name">Wallet Name</Label>
              <Input
                id="wallet-name"
                placeholder="Enter wallet name"
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
                setIsAddWalletOpen(false)
                setNewWalletName("")
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleAddWallet}
              disabled={!newWalletName.trim()}
            >
              Add Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportWalletOpen} onOpenChange={(isOpen) => {
  setIsImportWalletOpen(isOpen)
  if (!isOpen) {
    setImportWalletName("")
    setImportPrivateKey("")
    setDerivedSolanaAddress(null) // Xóa giá trị Derived Solana Address
  }
}}>
  <DialogContent className="sm:max-w-[425px] bg-card">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold">Import Wallet</DialogTitle>
    </DialogHeader>
    
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="import-wallet-name">Wallet Name</Label>
        <Input
          id="import-wallet-name"
          placeholder="Enter wallet name"
          value={importWalletName}
          onChange={(e) => setImportWalletName(e.target.value)}
          className="bg-gray-50 dark:bg-gray-900/50"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="solana-private-key">Solana Private Key</Label>
        <div className="relative">
          <Input
            id="solana-private-key"
            placeholder="Enter your Solana private key"
            value={importPrivateKey}
            onChange={(e) => handleImportPrivateKeyChange(e.target.value)}
            className="bg-gray-50 dark:bg-gray-900/50 pr-10"
            type={showPrivateKey ? "text" : "password"}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowPrivateKey(!showPrivateKey)}
          >
            {showPrivateKey ? (
              <Shield className="h-4 w-4" />
            ) : (
              <ShieldOff className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Your private key is stored securely and never shared.
        </p>
        {derivedSolanaAddress && (
          <div className="mt-2">
            <Label htmlFor="derived-solana-address">Derived Solana Address</Label>
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
                onClick={() => handleCopy(derivedSolanaAddress)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This is the Solana address derived from your private key.
            </p>
          </div>
        )}
      </div>
    </div>
    
    <DialogFooter className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => {
          setIsImportWalletOpen(false)
          setImportWalletName("")
          setImportPrivateKey("")
        }}
      >
        Cancel
      </Button>
      <Button 
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleImportWallet}
        disabled={!importWalletName.trim() || !importPrivateKey.trim()}
      >
        Import Wallet
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Private Keys Modal */}
      <Dialog open={isPrivateKeyOpen} onOpenChange={setIsPrivateKeyOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Private Keys</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="text-sm"
              >
                {showPrivateKey ? "Hide Keys" : "Show Keys"}
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="solana-key">Solana Private Key</Label>
              <div className="relative">
                <Input
                  id="solana-key"
                  value={showPrivateKey ? privateKeys?.sol_private_key : "••••••••••••••••••••••••••••••••"}
                  readOnly
                  className="pr-10 bg-gray-50 dark:bg-gray-900/50 truncate"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => handleCopy(privateKeys?.sol_private_key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="eth-key">Ethereum Private Key</Label>
              <div className="relative">
                <Input
                  id="eth-key"
                  value={showPrivateKey ? privateKeys?.eth_private_key : "••••••••••••••••••••••••••••••••"}
                  readOnly
                  className="pr-10 bg-gray-50 dark:bg-gray-900/50 truncate"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => handleCopy(privateKeys?.eth_private_key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bnb-key">BNB Private Key</Label>
              <div className="relative">
                <Input
                  id="bnb-key"
                  value={showPrivateKey ? privateKeys?.bnb_private_key : "••••••••••••••••••••••••••••••••"}
                  readOnly
                  className="pr-10 bg-gray-50 dark:bg-gray-900/50 truncate"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => handleCopy(privateKeys?.bnb_private_key)}
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
                setIsPrivateKeyOpen(false)
                setShowPrivateKey(false)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

