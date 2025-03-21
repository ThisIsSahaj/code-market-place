"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Code } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/lib/hooks/use-wallet"
import { useMarketplace } from "@/lib/context/marketplace-context"

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [language, setLanguage] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 0.2])
  const { isConnected } = useWallet()
  const { listings } = useMarketplace()

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === "all" || listing.category === category
    const matchesLanguage = language === "all" || listing.language === language
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1]

    return matchesSearch && matchesCategory && matchesLanguage && matchesPrice
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Marketplace</h1>
          <p className="text-muted-foreground">Browse and purchase high-quality code from verified developers</p>
        </div>
        {isConnected && (
          <Link href="/sell">
            <Button className="gap-2">
              <Code className="h-4 w-4" />
              Sell Your Code
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Component">Components</SelectItem>
                  <SelectItem value="Full System">Full Systems</SelectItem>
                  <SelectItem value="Utility">Utilities</SelectItem>
                  <SelectItem value="API">APIs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="C#">C#</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range (ETH)</label>
              <div className="pt-4">
                <Slider
                  defaultValue={[0, 0.2]}
                  max={0.2}
                  step={0.01}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>{priceRange[0]} ETH</span>
                  <span>{priceRange[1]} ETH</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for code, components, or projects..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredListings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <Link href={`/marketplace/${listing.id}`} key={listing.id}>
                  <Card className="h-full overflow-hidden transition-all hover:border-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-1 text-lg">{listing.title}</CardTitle>
                        <Badge variant="outline">{listing.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{listing.description}</p>
                      <div className="mt-4 flex items-center text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{listing.language}</span>
                        <span className="mx-2">•</span>
                        <span>{listing.sales} sales</span>
                        <span className="mx-2">•</span>
                        <span>★ {listing.rating}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 px-6 py-3">
                      <div className="flex w-full items-center justify-between">
                        <span className="text-lg font-bold">{listing.price} ETH</span>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-xl font-medium">No listings found</p>
              <p className="text-muted-foreground">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

