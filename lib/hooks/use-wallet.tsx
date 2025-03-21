"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

// Sepolia testnet configuration
const SEPOLIA_CHAIN_ID = "0xaa36a7"
const SEPOLIA_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: "Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "SEP",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia.infura.io/v3/"],
  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
}

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const { toast } = useToast()

  const checkNetwork = async () => {
    if (typeof window === "undefined" || !window.ethereum) return false

    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          })
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [SEPOLIA_CONFIG],
            })
          } else {
            throw switchError
          }
        }
      }
      return true
    } catch (error) {
      console.error("Error checking/switching network:", error)
      return false
    }
  }

  const connectWallet = async () => {
    if (typeof window === "undefined") return

    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this feature",
        variant: "destructive",
      })
      return
    }

    try {
      const networkOk = await checkNetwork()
      if (!networkOk) {
        toast({
          title: "Network error",
          description: "Please switch to Sepolia testnet",
          variant: "destructive",
        })
        return
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      setAddress(accounts[0])
      setIsConnected(true)

      toast({
        title: "Wallet connected",
        description: `Connected to ${formatAddress(accounts[0])}`,
      })

      // Here you would update the wallet address in your database
      // For now, we'll just log it
      console.log("Wallet connected:", accounts[0])
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    setAddress("")
    setIsConnected(false)
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const formatAddress = (addr) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }

    checkConnection()

    // Setup event listeners
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
        } else {
          setAddress("")
          setIsConnected(false)
        }
      }

      const handleChainChanged = () => {
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      // Cleanup
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [])

  return {
    isConnected,
    address,
    connectWallet,
    disconnectWallet,
    formatAddress,
  }
}

