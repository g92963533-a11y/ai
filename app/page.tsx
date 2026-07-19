import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export default async function HomePage() {
  try {
    const headersList = await headers()
    const session = await auth.api.getSession({ headers: headersList })

    // Redirect authenticated users to dashboard
    if (session?.user) {
      redirect('/dashboard')
    }
  } catch (error) {
    console.error('[v0] Error getting session:', error)
  }

  // Redirect unauthenticated users to sign-in
  redirect('/sign-in')
}
