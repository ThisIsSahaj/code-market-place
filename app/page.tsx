import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Code, Sparkles, ShieldCheck } from "lucide-react"
import FeaturedListings from "@/components/featured-listings"

export default function Home() {
  return (
    <div className="space-y-12 py-6">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Badge className="px-4 py-2 text-sm" variant="outline">
            The Marketplace for Developers
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Buy and Sell Code <span className="text-primary">Securely</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            A decentralized marketplace for developers to buy and sell code snippets, components, and full projects with
            secure blockchain transactions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/marketplace">
              <Button size="lg" className="gap-2">
                Browse Marketplace
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sell">
              <Button size="lg" variant="outline" className="gap-2">
                Sell Your Code
                <Code className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Features</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Our platform offers a secure and user-friendly way to buy and sell code.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card>
            <CardHeader>
              <Code className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Code Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse and purchase high-quality code snippets, components, and full projects from verified developers.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Secure Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All transactions are secured through blockchain technology, ensuring safe and transparent payments.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Developer Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join a thriving community of developers sharing knowledge and high-quality code solutions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Featured Listings</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Check out some of our top code listings from verified developers.
          </p>
        </div>
        <div className="mt-8">
          <FeaturedListings />
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/marketplace">
            <Button variant="outline" size="lg">
              View All Listings
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

