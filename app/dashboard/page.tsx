"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Code, Download, ExternalLink } from "lucide-react"
import { useWallet } from "@/lib/hooks/use-wallet"
import { useMarketplace } from "@/lib/context/marketplace-context"

export default function DashboardPage() {
  const router = useRouter()
  const { isConnected, connectWallet, formatAddress } = useWallet()
  const { userListings, userPurchases } = useMarketplace()

  if (!isConnected) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>You need to connect your wallet to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage your listings and purchases</p>
      </div>

      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="purchases">My Purchases</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Listings</h2>
            <Button onClick={() => router.push("/sell")}>
              <Code className="mr-2 h-4 w-4" />
              Add New Listing
            </Button>
          </div>

          {userListings.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userListings.map((listing) => (
                <Card key={listing.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-1 text-lg">{listing.title}</CardTitle>
                      <Badge variant="outline">{listing.category}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{listing.price} ETH</span>
                      <span className="text-sm text-muted-foreground">{listing.sales} sales</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/marketplace/${listing.id}`)}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-6 flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-lg font-medium">No listings yet</p>
              <p className="text-muted-foreground">Start selling your code by creating a new listing</p>
              <Button className="mt-4" onClick={() => router.push("/sell")}>
                Create Listing
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchases" className="mt-6">
          <h2 className="text-xl font-semibold">Your Purchases</h2>

          {userPurchases.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userPurchases.map((listing) => (
                <Card key={listing.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-1 text-lg">{listing.title}</CardTitle>
                      <Badge variant="outline">{listing.category}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{listing.price} ETH</span>
                      <span className="text-sm text-muted-foreground">{listing.language}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/marketplace/${listing.id}`)}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-6 flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-lg font-medium">No purchases yet</p>
              <p className="text-muted-foreground">Browse the marketplace to find code to purchase</p>
              <Button className="mt-4" onClick={() => router.push("/marketplace")}>
                Browse Marketplace
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

