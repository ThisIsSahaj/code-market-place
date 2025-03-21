"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Check, Code, Download, FileCode, Loader2, Star } from "lucide-react"
import { useWallet } from "@/lib/hooks/use-wallet"
import { useMarketplace } from "@/lib/context/marketplace-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected, connectWallet, address } = useWallet()
  const { getListingById, purchaseListing } = useMarketplace()
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")
  const [listing, setListing] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const id = params.id as string

  // Fetch listing data
  useEffect(() => {
    if (id) {
      const fetchedListing = getListingById(id)
      setListing(fetchedListing)
      setIsLoading(false)
    }
  }, [id, getListingById])

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading listing details...</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Listing Not Found</h1>
        <p className="mt-2 text-muted-foreground">The listing you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-6" onClick={() => router.push("/marketplace")}>
          Back to Marketplace
        </Button>
      </div>
    )
  }

  const isOwner = isConnected && listing.seller === address
  const hasPurchased = isConnected && listing.purchasedBy?.includes(address)

  const handlePurchase = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive",
      })
      return
    }

    setIsPurchasing(true)

    try {
      const success = await purchaseListing(id)
      if (success) {
        // In a real app, this would be the actual transaction hash from the blockchain
        setTransactionHash("0x" + Math.random().toString(16).substring(2, 10) + "...")
      }
    } catch (error) {
      console.error("Purchase error:", error)
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to complete the transaction",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your code is being downloaded",
    })

    // In a real app, this would trigger an actual download
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Your code has been downloaded successfully",
      })
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" size="sm" onClick={() => router.push("/marketplace")}>
        ← Back to Marketplace
      </Button>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline">{listing.category}</Badge>
              <Badge variant="outline">{listing.language}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>
                  {listing.rating} ({listing.sales} sales)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{listing.sellerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{listing.sellerName}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({listing.reviews?.length || 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 space-y-4">
              <p className="leading-7">{listing.longDescription}</p>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">What's included:</h3>
                <ul className="space-y-2">
                  {listing.includes?.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-medium">Features:</h3>
                <ul className="space-y-2">
                  {listing.features?.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-6">
                {listing.reviews?.length > 0 ? (
                  listing.reviews.map((review) => (
                    <div key={review.id} className="space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{review.user}</span>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex h-[100px] flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No reviews yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{listing.price} ETH</CardTitle>
              <CardDescription>One-time purchase, lifetime access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                <span>{listing.language} Source Code</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <span>Includes all features listed</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <span>Instant download after purchase</span>
              </div>

              {hasPurchased && (
                <Alert className="mt-4 bg-primary/10">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Already purchased</AlertTitle>
                  <AlertDescription>You already own this code. You can download it anytime.</AlertDescription>
                </Alert>
              )}

              {isOwner && (
                <Alert className="mt-4 bg-primary/10">
                  <AlertTitle>You are the seller</AlertTitle>
                  <AlertDescription>
                    This is your listing. You can edit or remove it from your dashboard.
                  </AlertDescription>
                </Alert>
              )}

              {transactionHash && (
                <Alert className="mt-4 bg-green-500/10">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertTitle>Purchase successful!</AlertTitle>
                  <AlertDescription>Transaction hash: {transactionHash}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {!isConnected ? (
                <Button className="w-full" size="lg" onClick={connectWallet}>
                  Connect Wallet to Purchase
                </Button>
              ) : isOwner ? (
                <Button className="w-full" size="lg" variant="outline" onClick={() => router.push("/dashboard")}>
                  Manage Listing
                </Button>
              ) : hasPurchased ? (
                <Button className="w-full" size="lg" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Code
                </Button>
              ) : (
                <Button className="w-full" size="lg" onClick={handlePurchase} disabled={isPurchasing}>
                  {isPurchasing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Purchase Now"
                  )}
                </Button>
              )}
              <p className="text-center text-xs text-muted-foreground">
                By purchasing, you agree to our terms of service and code license agreement.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

