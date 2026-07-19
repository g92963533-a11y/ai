'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    google: any
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: (user: any) => void
  onError?: (error: string) => void
  mode?: 'signin' | 'signup'
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  mode = 'signin',
}: GoogleSignInButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    // Check if Client ID is configured
    if (!clientId) {
      console.warn('[v0] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured')
      setError(
        'Google Sign-In is not configured. Contact support or use email/password login.'
      )
      return
    }

    // Load Google Identity Services script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true

    script.onload = () => {
      if (!window.google) {
        console.error('[v0] Google Identity Services failed to load')
        setError('Google Sign-In is unavailable. Please try again.')
        return
      }

      // Initialize Google Sign-In
      try {
        console.log('[v0] Initializing Google Sign-In with client ID:', clientId)
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        })

        // Render the button
        if (containerRef.current) {
          window.google.accounts.id.renderButton(containerRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: mode === 'signin' ? 'signin' : 'signup',
            logo_alignment: 'left',
          })
        }
      } catch (err) {
        console.error('[v0] Failed to initialize Google Sign-In:', err)
        setError('Failed to initialize Google Sign-In')
      }
    }

    script.onerror = () => {
      console.error('[v0] Failed to load Google Identity Services')
      setError('Failed to load Google Sign-In. Please refresh the page.')
    }

    document.body.appendChild(script)

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [mode])

  const handleCredentialResponse = async (response: any) => {
    setIsLoading(true)
    setError(null)

    try {
      if (!response.credential) {
        throw new Error('No credential received from Google')
      }

      const idToken = response.credential

      // Send token to backend for verification
      const verifyResponse = await fetch('/api/auth/google/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json()
        throw new Error(errorData.error || 'Token verification failed')
      }

      const result = await verifyResponse.json()

      if (!result.success) {
        throw new Error(result.error || 'Authentication failed')
      }

      console.log('[v0] Google Sign-In successful:', {
        userId: result.userId,
        email: result.user.email,
        name: result.user.name,
      })

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result.user)
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign-in'
      console.error('[v0] Google Sign-In error:', errorMessage)
      setError(errorMessage)

      if (onError) {
        onError(errorMessage)
      }

      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full flex justify-center"
        style={{ minHeight: '40px' }}
      />

      {isLoading && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Verifying credentials...
        </div>
      )}
    </div>
  )
}
