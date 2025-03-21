"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@/lib/hooks/use-wallet"

// Types
export type Listing = {
  id: string
  title: string
  description: string
  longDescription?: string
  price: number
  category: string
  language: string
  seller: string
  sellerName: string
  rating: number
  sales: number
  features?: string[]
  includes?: string[]
  reviews?: {
    id: number
    user: string
    rating: number
    comment: string
  }[]
  purchasedBy?: string[]
}

type MarketplaceContextType = {
  listings: Listing[]
  featuredListings: Listing[]
  userListings: Listing[]
  userPurchases: Listing[]
  addListing: (listing: Omit<Listing, "id" | "seller" | "sellerName" | "rating" | "sales" | "purchasedBy">) => void
  purchaseListing: (listingId: string) => Promise<boolean>
  getListingById: (id: string) => Listing | undefined
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined)

// Fixed seller address
const MARKETPLACE_OWNER = "0xfDcb4aa4426601AdfC6E48ab05658C1C109217b2"

// Initial mock data
const initialListings: Listing[] = [
  {
    id: "1",
    title: "E-commerce Shopping Cart Component",
    description: "A fully functional shopping cart with React hooks and context API",
    longDescription:
      "This comprehensive e-commerce shopping cart solution is built with React and leverages the Context API for state management. It provides a complete shopping experience from product browsing to checkout.\n\nFeatures include:\n- Product listing with filtering and sorting\n- Add to cart functionality with quantity adjustments\n- Persistent cart using local storage\n- Responsive design for all devices\n- Checkout process with form validation\n- Order summary and confirmation\n\nThe code is well-documented and follows best practices for React development. It's designed to be easily integrated into existing projects or used as a standalone solution.",
    price: 0.05,
    category: "Component",
    language: "JavaScript",
    seller: MARKETPLACE_OWNER,
    sellerName: "DevMaster",
    rating: 4.8,
    sales: 24,
    reviews: [
      { id: 1, user: "CodingPro", rating: 5, comment: "Excellent code quality and documentation!" },
      { id: 2, user: "WebDev123", rating: 4, comment: "Works great, saved me a lot of time." },
      { id: 3, user: "ReactFan", rating: 5, comment: "Perfect integration with my existing project." },
    ],
    features: [
      "Product listing with filtering",
      "Cart management with local storage",
      "Quantity adjustments",
      "Checkout flow",
      "Responsive design",
    ],
    includes: ["Source code", "Documentation", "Example implementation", "6 months support"],
    purchasedBy: [],
  },
  {
    id: "2",
    title: "Authentication System",
    description: "Complete auth system with JWT, refresh tokens, and role-based access",
    longDescription:
      "A comprehensive authentication system built with Node.js, Express, and MongoDB. This system handles user registration, login, password reset, and account management with security best practices.\n\nFeatures include:\n- JWT-based authentication\n- Refresh token rotation\n- Role-based access control\n- Password hashing with bcrypt\n- Email verification\n- Password reset functionality\n- Account lockout after failed attempts\n\nThe system is designed to be secure, scalable, and easy to integrate into any application.",
    price: 0.15,
    category: "Full System",
    language: "TypeScript",
    seller: MARKETPLACE_OWNER,
    sellerName: "SecurityExpert",
    rating: 4.9,
    sales: 56,
    reviews: [
      { id: 1, user: "BackendDev", rating: 5, comment: "Rock-solid security implementation!" },
      { id: 2, user: "FullStackNinja", rating: 5, comment: "Saved me weeks of development time." },
      { id: 3, user: "StartupCTO", rating: 4, comment: "Great system, easy to customize for our needs." },
    ],
    features: [
      "JWT authentication",
      "Refresh token rotation",
      "Role-based access control",
      "Password reset",
      "Email verification",
    ],
    includes: ["Source code", "API documentation", "Integration guide", "12 months support"],
    purchasedBy: [],
  },
  {
    id: "3",
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard with charts, graphs and filters using D3.js",
    longDescription:
      "A powerful data visualization dashboard built with D3.js and React. This dashboard provides interactive charts, graphs, and filters to help users analyze and understand complex data sets.",
    price: 0.08,
    category: "Component",
    language: "JavaScript",
    seller: MARKETPLACE_OWNER,
    sellerName: "DataVizPro",
    rating: 4.7,
    sales: 18,
    features: [
      "Interactive charts and graphs",
      "Data filtering and sorting",
      "Responsive design",
      "CSV/JSON data import",
      "Export to PNG/PDF",
    ],
    includes: ["Source code", "Documentation", "Sample data", "3 months support"],
    purchasedBy: [],
  },
  {
    id: "4",
    title: "Real-time Chat Application",
    description: "WebSocket-based chat with typing indicators and read receipts",
    longDescription:
      "A complete real-time chat application built with Socket.io and React. Features include typing indicators, read receipts, online status, and message history.",
    price: 0.12,
    category: "Full System",
    language: "TypeScript",
    seller: MARKETPLACE_OWNER,
    sellerName: "SocketMaster",
    rating: 4.6,
    sales: 32,
    features: ["Real-time messaging", "Typing indicators", "Read receipts", "Online status", "Message history"],
    includes: ["Frontend code", "Backend code", "Deployment guide", "6 months support"],
    purchasedBy: [],
  },
  {
    id: "5",
    title: "PDF Generation Utility",
    description: "Server-side PDF generation with dynamic content and styling",
    longDescription:
      "A utility for generating PDF documents on the server with dynamic content and styling. Built with Node.js and PDF-lib.",
    price: 0.04,
    category: "Utility",
    language: "JavaScript",
    seller: MARKETPLACE_OWNER,
    sellerName: "DocMaker",
    rating: 4.5,
    sales: 41,
    features: [
      "Dynamic content generation",
      "Custom styling and branding",
      "Table and chart support",
      "Image embedding",
      "Password protection",
    ],
    includes: ["Source code", "API documentation", "Example templates", "3 months support"],
    purchasedBy: [],
  },
  {
    id: "6",
    title: "Image Processing API",
    description: "Serverless functions for image resizing, cropping, and optimization",
    longDescription:
      "A set of serverless functions for image processing, including resizing, cropping, filtering, and optimization. Built with Cloudinary and AWS Lambda.",
    price: 0.07,
    category: "API",
    language: "Python",
    seller: MARKETPLACE_OWNER,
    sellerName: "CloudDev",
    rating: 4.8,
    sales: 29,
    features: [
      "Image resizing and cropping",
      "Filters and effects",
      "Image optimization",
      "Face detection",
      "Batch processing",
    ],
    includes: ["Source code", "API documentation", "Deployment guide", "6 months support"],
    purchasedBy: [],
  },
  {
    id: "7",
    title: "E-commerce Product Recommendation Engine",
    description: "ML-based recommendation system for e-commerce platforms",
    longDescription:
      "A machine learning-based recommendation engine for e-commerce platforms. Uses collaborative filtering and content-based approaches to suggest products to users.",
    price: 0.18,
    category: "Full System",
    language: "Python",
    seller: MARKETPLACE_OWNER,
    sellerName: "MLExpert",
    rating: 4.9,
    sales: 15,
    features: [
      "Collaborative filtering",
      "Content-based recommendations",
      "User behavior analysis",
      "A/B testing framework",
      "Performance analytics",
    ],
    includes: ["Source code", "Documentation", "Training data", "12 months support"],
    purchasedBy: [],
  },
  {
    id: "8",
    title: "Subscription Payment System",
    description: "Complete subscription billing system with Stripe integration",
    longDescription:
      "A full-featured subscription billing system with Stripe integration. Handles recurring payments, upgrades/downgrades, and billing management.",
    price: 0.14,
    category: "Full System",
    language: "JavaScript",
    seller: MARKETPLACE_OWNER,
    sellerName: "FinTechDev",
    rating: 4.7,
    sales: 22,
    features: [
      "Recurring billing",
      "Plan management",
      "Upgrade/downgrade handling",
      "Payment failure recovery",
      "Invoicing and receipts",
    ],
    includes: ["Frontend code", "Backend code", "Stripe integration guide", "6 months support"],
    purchasedBy: [],
  },
]

export const MarketplaceProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast()
  const { address, isConnected } = useWallet()
  const [listings, setListings] = useState<Listing[]>([])

  // Load listings from localStorage on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      try {
        const storedListings = localStorage.getItem("codeMarketListings")
        if (storedListings) {
          setListings(JSON.parse(storedListings))
        } else {
          setListings(initialListings)
          localStorage.setItem("codeMarketListings", JSON.stringify(initialListings))
        }
      } catch (error) {
        console.error("Error loading listings from localStorage:", error)
        setListings(initialListings)
      }
    }
  }, [])

  // Save listings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && listings.length > 0) {
      try {
        localStorage.setItem("codeMarketListings", JSON.stringify(listings))
      } catch (error) {
        console.error("Error saving listings to localStorage:", error)
      }
    }
  }, [listings])

  // Get featured listings (top rated)
  const featuredListings = listings.sort((a, b) => b.rating - a.rating).slice(0, 3)

  // Get user's listings
  const userListings = listings.filter((listing) => isConnected && listing.seller === address)

  // Get user's purchases
  const userPurchases = listings.filter((listing) => isConnected && listing.purchasedBy?.includes(address))

  // Add a new listing
  const addListing = (
    newListing: Omit<Listing, "id" | "seller" | "sellerName" | "rating" | "sales" | "purchasedBy">,
  ) => {
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet to add a listing",
        variant: "destructive",
      })
      return
    }

    const listing: Listing = {
      ...newListing,
      id: Date.now().toString(),
      seller: address,
      sellerName: `User_${address.substring(2, 6)}`,
      rating: 0,
      sales: 0,
      purchasedBy: [],
    }

    setListings((prev) => [...prev, listing])
    toast({
      title: "Listing added",
      description: "Your code has been listed on the marketplace",
    })
  }

  // Purchase a listing
  const purchaseListing = async (listingId: string): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive",
      })
      return false
    }

    const listing = listings.find((l) => l.id === listingId)
    if (!listing) {
      toast({
        title: "Listing not found",
        description: "The listing you're trying to purchase doesn't exist",
        variant: "destructive",
      })
      return false
    }

    if (listing.purchasedBy?.includes(address)) {
      toast({
        title: "Already purchased",
        description: "You've already purchased this code",
        variant: "destructive",
      })
      return false
    }

    try {
      // Send Ethereum transaction
      if (!window.ethereum) {
        throw new Error("MetaMask not found")
      }

      const weiValue = BigInt(Math.floor(listing.price * 1e18))

      // Always send to the marketplace owner address
      const transactionHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: MARKETPLACE_OWNER, // Fixed recipient address
            value: "0x" + weiValue.toString(16),
            gas: "0x5208", // 21000 gas
          },
        ],
      })

      // Update listing with purchase
      setListings((prev) =>
        prev.map((l) => {
          if (l.id === listingId) {
            return {
              ...l,
              sales: l.sales + 1,
              purchasedBy: [...(l.purchasedBy || []), address],
            }
          }
          return l
        }),
      )

      toast({
        title: "Purchase successful!",
        description: `Transaction hash: ${transactionHash.slice(0, 10)}...`,
      })

      return true
    } catch (error) {
      console.error("Purchase error:", error)
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to complete the transaction",
        variant: "destructive",
      })
      return false
    }
  }

  // Get a listing by ID
  const getListingById = (id: string) => {
    return listings.find((listing) => listing.id === id)
  }

  return (
    <MarketplaceContext.Provider
      value={{
        listings,
        featuredListings,
        userListings,
        userPurchases,
        addListing,
        purchaseListing,
        getListingById,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  )
}

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext)
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider")
  }
  return context
}

