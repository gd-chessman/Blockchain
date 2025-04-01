import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import '@/styles/globals.scss'
import Navigation from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { LangProvider } from "@/lang/LangProvider"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'; 

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KCM",
  description: "Advanced blockchain trading and wallet platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <LangProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
              <Navigation />
              <main className="min-h-[calc(100vh-64px)]">{children}</main>
            </div>
          </ThemeProvider>
          <ToastContainer />
        </LangProvider>
      </body>
    </html>
  )
}
