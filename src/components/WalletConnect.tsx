'use client'

import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { Button } from './ui/Button'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            setAddress(accounts[0].address)
          }
        } catch (error) {
          console.error('Failed to check connection:', error)
        }
      }
    }
    checkConnection()
  }, [])

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = await provider.getSigner()
        setAddress(signer.address)
      } else {
        setError('Please install MetaMask')
      }
    } catch (error: any) {
      setError(error.message || 'Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setAddress(null)
    setError(null)
  }

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-[9px] text-gray-400">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          className="text-[8px] px-2 py-1 border-gray-700 text-gray-400 hover:border-red-600 hover:text-red-600"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full text-[9px] py-2 bg-amber-700 text-black hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </Button>

      <div className="text-center">
        <span className="text-[9px] text-gray-500">Connect Wallet to Trade</span>
      </div>

      {error && (
        <div className="text-[8px] text-red-600 text-center">
          {error}
        </div>
      )}
    </div>
  )
}
