import './globals.css'
import { Inter } from 'next/font/google'
import { TopNav } from '@/components/top-nav'

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
      <body>
        {children}
      </body>
    </html>
  )
}

