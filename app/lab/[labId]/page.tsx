import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getLabById, getLabStats } from '@/app/actions/labs'
import DashboardHeader from '@/components/dashboard-header'
import LabEditor from '@/components/lab-editor'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function LabPage({ params }: { params: { labId: string } }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const lab = await getLabById(params.labId)

  if (!lab) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader userName={session.user.name || 'Hacker'} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Lab not found</h1>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const stats = await getLabStats(params.labId)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={session.user.name || 'Hacker'} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{lab.title}</h1>
          <p className="text-muted-foreground">{lab.description}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{lab.difficulty}</span>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">{lab.maxXP} XP</span>
            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">Attempts: {stats.totalAttempts}</span>
            {stats.completed && <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm">✓ Completed</span>}
          </div>
        </div>

        <LabEditor lab={lab} stats={stats} />
      </main>
    </div>
  )
}
