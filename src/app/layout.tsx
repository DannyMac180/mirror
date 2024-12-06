import './globals.css'
import { Inter } from 'next/font/google'
import { TopNav } from './components/top-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mirror Dashboard',
  description: 'Your personal reflection and growth companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNav />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}

