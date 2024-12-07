import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from 'lucide-react'

export function TopNav() {
  return (
    <nav className="border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-lg font-mono tracking-wider">MIRROR</Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/journal" className="text-sm tracking-wider hover:text-primary">JOURNAL</Link>
              <Link href="/library" className="text-sm tracking-wider hover:text-primary">LIBRARY</Link>
              <Link href="/goals" className="text-sm tracking-wider hover:text-primary">GOALS</Link>
              <Link href="/insights" className="text-sm tracking-wider hover:text-primary">INSIGHTS</Link>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-none">
                <User className="h-5 w-5" />
                <span className="sr-only">Open profile menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none">
              <DropdownMenuLabel className="font-mono">PROFILE</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-mono">SETTINGS</DropdownMenuItem>
              <DropdownMenuItem className="font-mono">LOG OUT</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

