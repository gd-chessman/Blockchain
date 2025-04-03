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
  const [isAmountEnabled, setIsAmountEnabled] = useState(true);
  const [amountValue, setAmountValue] = useState("");
  const { data: memeCoins = [] , refetch} = useQuery({
    queryKey: ['private-keys'],
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

  const onSubmit = async (data: FormData) => {
    // Sau khi tạo thành công, reset form và logo preview
    data.image = fileImage;
    // const res = await TelegramWalletService.createToken(data)
    reset()
    setLogoPreview(null);
    refetch()
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    // Có thể thêm thông báo toast ở đây
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">{t('createCoin.title')}</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">{t('createCoin.subtitle')}</div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-6">
          <TabsTrigger value="create">{t('createCoin.tabs.create')}</TabsTrigger>
          <TabsTrigger value="my-coins">{t('createCoin.tabs.myCoins')}</TabsTrigger>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                        {t('createCoin.form.description')}
                      </label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        placeholder={t('createCoin.form.descriptionPlaceholder')}
                        className="h-32"
                      />
                    </div>

                    <div>
                      <label htmlFor="image" className="block text-sm font-medium mb-1">
                        {t('createCoin.form.logo')} <span className="text-muted-foreground">*</span>
                      </label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 h-32">
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

                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 mt-6">
                    {t('createCoin.form.createButton')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="hidden md:block">
              <Card className="border-none shadow-md dark:shadow-blue-900/5 h-full">
                <CardHeader>
                  <CardTitle>{t('createCoin.preview.title')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    {logoPreview ? (
                      <div className="mb-4">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="size-64 object-contain mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="size-64 rounded-full bg-muted flex items-center justify-center mb-4 mx-auto">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-muted-foreground"
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
                    <h3 className="text-xl font-bold">{watchedValues.name || t('createCoin.preview.defaultName')}</h3>
                    <p className="text-sm mt-1">{watchedValues.symbol ? watchedValues.symbol.toUpperCase() : t('createCoin.preview.defaultSymbol')}</p>
                    <p className="mt-4 text-sm">{watchedValues.description || t('createCoin.preview.defaultDescription')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-coins">
          <Card className="border-none shadow-md dark:shadow-blue-900/5">
            <CardHeader>
              <CardTitle>{t('createCoin.myCoins.title')}</CardTitle>
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
                          <div className="flex items-center">
                            <span>{coin.address}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => handleCopyAddress(coin.address)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{coin.decimals}</TableCell>
                        <TableCell>
                          <Button className="bg-green-500 hover:bg-green-600 text-white h-8">{t('createCoin.myCoins.tradeButton')}</Button>
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
