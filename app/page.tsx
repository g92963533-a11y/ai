'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession()
        
        if (session?.user) {
          // Redirect authenticated users to dashboard
          router.push('/dashboard')
        } else {
          // Redirect unauthenticated users to sign-in
          router.push('/sign-in')
        }
      } catch (error) {
        console.error('[v0] Error checking session:', error)
        // Default to sign-in on error
        router.push('/sign-in')
      }
    }

    checkSession()
  }, [router])

  // Show loading state while checking session
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
