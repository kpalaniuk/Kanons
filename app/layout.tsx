import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navigation from '@/components/Navigation'
// import CustomCursor from '@/components/CustomCursor' // Disabled for performance
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Kyle Palaniuk | Musician • Operator • Community Builder',
  description: 'Building businesses, bands, and community in San Diego. COO, trumpet player, soccer coach, and event curator.',
  keywords: ['Kyle Palaniuk', 'San Diego', 'StronGnome', 'Granada House', 'trumpet', 'music', 'community'],
  openGraph: {
    title: 'Kyle Palaniuk',
    description: 'Building businesses, bands, and community in San Diego',
    url: 'https://kyle.palaniuk.net',
    siteName: 'Kyle Palaniuk',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="grain-overlay">
          {/* <CustomCursor /> */}
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
