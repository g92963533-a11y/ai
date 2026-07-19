'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  userName?: string
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary">⚔️</div>
          <div>
            <h1 className="text-xl font-bold text-foreground">CyberForge Academy</h1>
            <p className="text-xs text-muted-foreground">Master Cybersecurity</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-foreground hover:text-primary transition">
            Dashboard
          </Link>
          <Link href="/learn" className="text-foreground hover:text-primary transition">
            Learn
          </Link>
          <Link href="/labs" className="text-foreground hover:text-primary transition">
            Labs
          </Link>
          <Link href="/leaderboard" className="text-foreground hover:text-primary transition">
            Leaderboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Logged in as:</span>
            <span className="font-medium text-foreground">{userName}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
