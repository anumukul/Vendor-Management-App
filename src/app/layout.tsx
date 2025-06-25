import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '../components/providers/SessionProvider'
import { Toaster } from '../components/ui/sonner'
import NavBar from '../components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vendor Management System',
  description: 'Streamline your vendor operations with our modern management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main>{children}</main>
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}