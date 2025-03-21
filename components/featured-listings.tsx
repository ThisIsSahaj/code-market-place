"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star } from "lucide-react"
import { useMarketplace } from "@/lib/context/marketplace-context"

export default function FeaturedListings() {
  const { featuredListings } = useMarketplace()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredListings.map((listing) => (
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
                <span className="flex items-center">
                  <Star className="mr-1 h-3.5 w-3.5 fill-primary text-primary" />
                  {listing.rating}
                </span>
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
  )
}

