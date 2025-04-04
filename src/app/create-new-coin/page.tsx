"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy } from 'lucide-react'
import { Avatar } from "@/components/ui/avatar"
import { useForm } from "react-hook-form"
import { TelegramWalletService } from "@/services/api"
import { useQuery } from "@tanstack/react-query"
import { getMyTokens } from "@/services/api/TelegramWalletService"
import { useLang } from "@/lang"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { truncateString } from "@/utils/format"
import { ToastNotification } from "@/components/ui/toast"

// Dữ liệu mẫu cho danh sách coin

// Define form data type
type FormData = {
  name: string;
  symbol: string;
  amount: string;
  description: string;
  image: File | null;
  telegram?: string;
  website?: string;
  twitter?: string;
  showName: boolean;
}

export default function CreateCoin() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [isAmountEnabled, setIsAmountEnabled] = useState(false);
  const [amountValue, setAmountValue] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const { data: memeCoins = [] , refetch} = useQuery({
    queryKey: ['my-tokens'],
    queryFn: getMyTokens,
  });
  const { t } = useLang();
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset, 
    watch 
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      symbol: "",
      amount: "",
      description: "",
      showName: true,
    }
  });

  // Watch form values for preview
  const watchedValues = watch();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await TelegramWalletService.createToken(data);
      setToastMessage(t('createCoin.success'));
      setShowToast(true);
      refetch();
    } catch (error) {
      console.error("Error creating meme coin:", error);
      setToastMessage(t('createCoin.error'));
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setToastMessage(t('createCoin.copySuccess'));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileImage(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {showToast && (
        <ToastNotification 
          message={toastMessage}
          onClose={() => setShowToast(false)} 
        />
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">{t('createCoin.title')}</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">{t('createCoin.subtitle')}</div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-6">
          <TabsTrigger value="create">{t('createCoin.tabs.create')}</TabsTrigger>
          <TabsTrigger value="my-coins" className="relative">
            {t('createCoin.tabs.myCoins')}
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {memeCoins?.length || 0}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-md dark:shadow-blue-900/5">
              <CardHeader>
                <CardTitle>{t('createCoin.tabs.create')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      {t('createCoin.form.name')}
                    </label>
                    <Input
                      id="name"
                      {...register("name", { required: t('createCoin.form.nameRequired') })}
                      placeholder={t('createCoin.form.namePlaceholder')}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="symbol" className="block text-sm font-medium mb-1">
                      {t('createCoin.form.symbol')}
                    </label>
                    <Input
                      id="symbol"
                      {...register("symbol", { required: t('createCoin.form.symbolRequired') })}
                      placeholder={t('createCoin.form.symbolPlaceholder')}
                    />
                    {errors.symbol && (
                      <p className="text-red-500 text-xs mt-1">{errors.symbol.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium mb-1">
                      {t('createCoin.form.amount')}
                    </label>
                    <div className="relative">
                      <Input
                        id="amount"
                        {...register("amount", { 
                          required: t('createCoin.form.amountRequired'),
                          disabled: !isAmountEnabled
                        })}
                        type="number"
                        placeholder={t('createCoin.form.amountPlaceholder')}
                        value={!isAmountEnabled ? "0" : amountValue}
                        onChange={(e) => {
                          setAmountValue(e.target.value);
                          register("amount").onChange(e);
                        }}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setIsAmountEnabled(!isAmountEnabled);
                            if (!isAmountEnabled) {
                              setAmountValue("");
                            } else {
                              setAmountValue("0");
                            }
                          }}
                        >
                          {isAmountEnabled ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6 6 18"/>
                              <path d="m6 6 12 12"/>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14"/>
                            </svg>
                          )}
                        </Button>
                        <span className="text-xs text-muted-foreground">(SOL)</span>
                      </div>
                    </div>
                    {errors.amount && (
                      <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                        {t('createCoin.form.description')}
                      </label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        placeholder={t('createCoin.form.descriptionPlaceholder')}
                        className="h-[200px]"
                      />
                    </div>

                    <div>
                      <label htmlFor="image" className="block text-sm font-medium mb-1">
                        {t('createCoin.form.logo')} <span className="text-muted-foreground">*</span>
                      </label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 h-[200px]">
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
                            <span className="text-xs text-muted-foreground mt-2">{t('createCoin.form.logoUpload')}</span>
                            <Input
                              id="logo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              {...register("image", { required: t('createCoin.form.logoRequired') })}
                              onChange={handleLogoChange}
                            />
                          </label>
                        )}
                      </div>
                      {errors.image && (
                        <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-blue-500"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      {showAdvanced ? t('createCoin.form.hideOptions') : t('createCoin.form.showOptions')}
                    </Button>
                  </div>

                  {showAdvanced && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label htmlFor="telegram" className="block text-sm font-medium mb-1">
                          {t('createCoin.form.telegram')}
                        </label>
                        <Input
                          id="telegram"
                          {...register("telegram")}
                          placeholder={t('createCoin.form.telegramPlaceholder')}
                        />
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium mb-1">
                          {t('createCoin.form.website')}
                        </label>
                        <Input
                          id="website"
                          {...register("website")}
                          placeholder={t('createCoin.form.websitePlaceholder')}
                        />
                      </div>

                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium mb-1">
                          {t('createCoin.form.twitter')}
                        </label>
                        <Input
                          id="twitter"
                          {...register("twitter")}
                          placeholder={t('createCoin.form.twitterPlaceholder')}
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600 mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {t('createCoin.form.creating')}
                      </div>
                    ) : (
                      t('createCoin.form.createButton')
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="hidden md:block space-y-4">
              <Card className="border-none shadow-md dark:shadow-blue-900/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('createCoin.latestTokens.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 h-[calc(100%-3rem)] overflow-y-auto">
                  <div className="flex gap-2">
                    {memeCoins?.slice(0, 3).map((coin: any) => (
                      <div key={coin.token_id} className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <Avatar className="h-10 w-10" src={coin.logo_url} alt={coin.name} />
                        <div className="text-center">
                          <h4 className="font-medium text-sm truncate w-full">{coin.name}</h4>
                          <span className="text-xs text-muted-foreground">{coin.symbol}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                            {truncateString(coin.address, 10)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-3 w-6"
                            onClick={() => handleCopyAddress(coin.address)}
                          >
                            <Copy className="h-2 w-2" />
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600 text-white h-7 text-xs w-full"
                          onClick={() => router.push(`/trading/token?address=${coin.address}`)}
                        >
                          {t('createCoin.myCoins.tradeButton')}
                        </Button>
                      </div>
                    ))}
                    {(!memeCoins || memeCoins.length === 0) && (
                      <div className="text-center text-muted-foreground py-2 text-sm w-full">
                        {t('createCoin.latestTokens.noTokens')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md dark:shadow-blue-900/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('createCoin.preview.title')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-center text-muted-foreground">
                    {logoPreview ? (
                      <div className="mb-2">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="size-48 object-contain mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="size-48 rounded-full bg-muted flex items-center justify-center mb-2 mx-auto">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-muted-foreground"
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
                    <h3 className="text-lg font-bold">{watchedValues.name || t('createCoin.preview.defaultName')}</h3>
                    <p className="text-xs mt-0.5">{watchedValues.symbol ? watchedValues.symbol.toUpperCase() : t('createCoin.preview.defaultSymbol')}</p>
                    <p className="mt-2 text-xs">{watchedValues.description || t('createCoin.preview.defaultDescription')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-coins">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('createCoin.myCoins.title')}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {memeCoins?.length || 0} {t('createCoin.myCoins.count')}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>{t('createCoin.myCoins.columns.coin')}</TableHead>
                      <TableHead>{t('createCoin.myCoins.columns.symbol')}</TableHead>
                      <TableHead>{t('createCoin.myCoins.columns.address')}</TableHead>
                      <TableHead>{t('createCoin.myCoins.columns.decimals')}</TableHead>
                      <TableHead>{t('createCoin.myCoins.columns.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(memeCoins) && memeCoins?.map((coin: any) => (
                      <TableRow key={coin.token_id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2" src={coin.logo_url} alt={coin.name} >
                              <p>{coin.symbol.substring(0, 2).toUpperCase()}</p>
                            </Avatar>
                            <span>{coin.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{coin.symbol}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-[200px]">{truncateString(coin.address, 14)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-2 w-2"
                              onClick={() => handleCopyAddress(coin.address)}
                            >
                              <Copy className="h-1.5 w-1.5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{coin.decimals}</TableCell>
                        <TableCell>
                          <Button  className="bg-green-500 hover:bg-green-600 text-white h-8" onClick={()=> router.push(`/trading/token?address=${coin.address}`)}>{t('createCoin.myCoins.tradeButton')}</Button>
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
