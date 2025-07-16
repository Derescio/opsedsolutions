import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ConditionalNavbar from "@/components/conditional-navbar"
import { ThemeProvider } from "@/components/theme-provider"
import ConditionalFooter from "@/components/conditional-footer"
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Opsed Solutions - Smarter Web Platforms | Full-Stack Development & Data Analytics",
  description:
    "Professional full-stack web development and data analytics services. Optimizing systems for enterprise development with modern web applications and data-driven insights.",
  keywords: ["full-stack developer", "data analyst", "web development", "data science", "enterprise solutions", "opsed solutions"],
  authors: [{ name: "Opsed Solutions" }],
  openGraph: {
    title: "Opsed Solutions - Smarter Web Platforms",
    description: "Professional full-stack development and data analytics services for enterprise solutions",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body className={`${inter.className} overflow-x-hidden`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ConditionalNavbar />
            {children}
            <ConditionalFooter />
          </ThemeProvider>
          <Toaster
            position="top-center"
            richColors
            duration={3000}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
