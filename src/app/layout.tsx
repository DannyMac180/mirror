import './globals.css'
import { IBM_Plex_Mono } from 'next/font/google'
import { TopNav } from '../components/top-nav'

const mono = IBM_Plex_Mono({ 
  subsets: ['latin'],
  weight: ['400', '500'],
})

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
      <body className={`${mono.className} bg-background text-foreground`}>
        <TopNav />
        <main className="container mx-auto px-4 py-12">
          {children}
        </main>
      </body>
    </html>
  )
}

