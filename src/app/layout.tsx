"use client";
import type React from "react";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/globals.scss";
import Navigation from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { LangProvider } from "@/lang/LangProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Khởi tạo QueryClient trong component để nó không bị chia sẻ giữa các yêu cầu
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  }));

  return (
    <html lang="kr" suppressHydrationWarning>
      <head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <LangProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                <Navigation />
                <main className="min-h-[calc(100vh-64px)]">{children}</main>
              </div>
            </ThemeProvider>
            <ToastContainer theme="dark" />
          </LangProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}