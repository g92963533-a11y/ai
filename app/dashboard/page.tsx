import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import DashboardHeader from '@/components/dashboard-header'
import ProgressCard from '@/components/progress-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={session.user.name || 'Hacker'} />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ProgressCard title="Total XP" value={0} icon="⭐" color="primary" />
          <ProgressCard title="Current Streak" value={0} unit="days" icon="🔥" color="accent" />
          <ProgressCard title="Hacker Level" value="Novice" icon="🎯" color="secondary" />
          <ProgressCard title="Levels Completed" value={0} icon="🏆" />
        </div>

        {/* Welcome Section */}
        <section className="mb-12">
          <div className="bg-card rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-bold mb-2">Welcome to CyberForge Academy, {session.user.name}!</h2>
            <p className="text-muted-foreground mb-6">
              Start your cybersecurity journey with our comprehensive learning path covering 20 levels from basics to advanced.
            </p>
            <Link href="/learn">
              <Button size="lg">Begin Your Journey</Button>
            </Link>
          </div>
        </section>

        {/* Available Levels Preview */}
        <section>
          <h3 className="text-xl font-bold mb-4">Your Learning Path</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="bg-card rounded-lg p-4 border border-border hover:border-primary transition-colors">
                <h4 className="font-semibold mb-2">Level {level}</h4>
                <p className="text-sm text-muted-foreground mb-4">Complete this level to unlock the next</p>
                <Link href={`/learn/${level}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Start Level
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Sections */}
        <section className="mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 border border-primary/20">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/leaderboard">
                <Button variant="outline" className="w-full">View Leaderboard</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="w-full">Upgrade Plan</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">My Progress</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
