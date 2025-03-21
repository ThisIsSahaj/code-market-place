"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Code, Menu, Package, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useWallet } from "@/lib/hooks/use-wallet"

export default function Header() {
  const { isConnected, address, connectWallet, disconnectWallet, formatAddress } = useWallet()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Code className="h-6 w-6" />
          <span>CodeMarket</span>
        </Link>

        <nav className="hidden gap-6 md:flex md:ml-10">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/marketplace" className="text-sm font-medium transition-colors hover:text-primary">
            Marketplace
          </Link>
          {isConnected && (
            <Link href="/sell" className="text-sm font-medium transition-colors hover:text-primary">
              Sell
            </Link>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <ModeToggle />

          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  {formatAddress(address)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/purchases">My Purchases</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/listings">My Listings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet}>Disconnect Wallet</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={connectWallet}>Connect Wallet</Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <Link href="/" className="flex items-center gap-2 font-bold">
                <Package className="h-6 w-6" />
                <span>CodeMarket</span>
              </Link>
              <nav className="mt-8 flex flex-col gap-4">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/marketplace" className="text-sm font-medium transition-colors hover:text-primary">
                  Marketplace
                </Link>
                {isConnected && (
                  <Link href="/sell" className="text-sm font-medium transition-colors hover:text-primary">
                    Sell
                  </Link>
                )}
                {isConnected ? (
                  <>
                    <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                      Dashboard
                    </Link>
                    <Link href="/purchases" className="text-sm font-medium transition-colors hover:text-primary">
                      My Purchases
                    </Link>
                    <Link href="/listings" className="text-sm font-medium transition-colors hover:text-primary">
                      My Listings
                    </Link>
                    <Button variant="outline" onClick={disconnectWallet}>
                      Disconnect Wallet
                    </Button>
                  </>
                ) : (
                  <Button onClick={connectWallet}>Connect Wallet</Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

