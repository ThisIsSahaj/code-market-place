"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Loader2, Upload } from "lucide-react"
import { useWallet } from "@/lib/hooks/use-wallet"
import { useMarketplace } from "@/lib/context/marketplace-context"

export default function SellPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected, connectWallet } = useWallet()
  const { addListing } = useMarketplace()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    price: "",
    category: "",
    language: "",
    file: null,
    features: ["", "", ""],
    includes: ["Source code", "Documentation", "3 months support"],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }))
  }

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  const handleIncludeChange = (index, value) => {
    const newIncludes = [...formData.includes]
    newIncludes[index] = value
    setFormData((prev) => ({ ...prev, includes: newIncludes }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to list your code",
        variant: "destructive",
      })
      return
    }

    // Validate form
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.language ||
      !formData.file
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Filter out empty features and includes
      const features = formData.features.filter((f) => f.trim() !== "")
      const includes = formData.includes.filter((i) => i.trim() !== "")

      // Add listing to marketplace
      addListing({
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        language: formData.language,
        features,
        includes,
      })

      toast({
        title: "Listing created!",
        description: "Your code has been listed on the marketplace",
      })

      router.push("/marketplace")
    } catch (error) {
      console.error("Error adding listing:", error)
      toast({
        title: "Error",
        description: "Failed to add your listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>You need to connect your wallet to list your code on the marketplace</CardDescription>
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
        <h1 className="text-3xl font-bold tracking-tight">Sell Your Code</h1>
        <p className="text-muted-foreground">List your code on the marketplace and start earning</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
            <CardDescription>Provide information about your code listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="E.g., Authentication System, Shopping Cart Component"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief description of your code (100 characters max)"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Detailed Description</Label>
              <Textarea
                id="longDescription"
                name="longDescription"
                placeholder="Provide a detailed description of your code, including features, use cases, and implementation details"
                className="min-h-[150px]"
                value={formData.longDescription}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" onValueChange={(value) => handleSelectChange("category", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Component">Component</SelectItem>
                    <SelectItem value="Full System">Full System</SelectItem>
                    <SelectItem value="Utility">Utility</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Primary Language</Label>
                <Select name="language" onValueChange={(value) => handleSelectChange("language", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="C#">C#</SelectItem>
                    <SelectItem value="PHP">PHP</SelectItem>
                    <SelectItem value="Ruby">Ruby</SelectItem>
                    <SelectItem value="Go">Go</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Key Features (up to 5)</Label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <Input
                    key={index}
                    placeholder={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                  />
                ))}
                {formData.features.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))}
                  >
                    Add Feature
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>What's Included</Label>
              <div className="space-y-2">
                {formData.includes.map((item, index) => (
                  <Input
                    key={index}
                    placeholder={`Included item ${index + 1}`}
                    value={item}
                    onChange={(e) => handleIncludeChange(index, e.target.value)}
                  />
                ))}
                {formData.includes.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, includes: [...prev.includes, ""] }))}
                  >
                    Add Item
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (ETH)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.001"
                min="0.001"
                placeholder="0.05"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload Code (ZIP file)</Label>
              <div className="flex items-center gap-4">
                <Input id="file" type="file" accept=".zip" onChange={handleFileChange} required />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload a ZIP file containing your code and any necessary documentation (max 50MB)
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "List on Marketplace"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

