import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/hooks/use-auth"
import { QueryProvider } from "@/lib/providers"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Driver Application Admin Dashboard',
  description: 'Admin dashboard for managing driver applications for Neighborly ride-sharing service',
}

// Force dynamic rendering to prevent SSR issues with client-side providers
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <TooltipProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  )
}