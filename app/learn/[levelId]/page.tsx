import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { learningLevel, interactiveLab } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import DashboardHeader from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getUserTier } from '@/app/actions/subscription'
import { canAccessLevel } from '@/lib/pricing'
import { UpgradePrompt } from '@/components/upgrade-prompt'

export default async function LearningPage({ params }: { params: { levelId: string } }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const levelId = params.levelId

  // Fetch level details
  const level = await db.select().from(learningLevel).where(eq(learningLevel.id, levelId)).limit(1)

  if (!level.length) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader userName={session.user.name || 'Hacker'} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Level not found</h1>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const levelData = level[0]

  // Check tier access
  const userTier = await getUserTier()
  const hasAccess = canAccessLevel(userTier, levelData.levelNumber)

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader userName={session.user.name || 'Hacker'} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <UpgradePrompt
              feature={`Level ${levelData.levelNumber}: ${levelData.title}`}
              tier="premium"
              description={`This advanced level is available in Premium and above plans. Unlock full access to all 20 cybersecurity levels and more.`}
            />
            <div className="mt-6">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fetch labs for this level
  const labs = await db.select().from(interactiveLab).where(eq(interactiveLab.levelId, levelId))

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={session.user.name || 'Hacker'} />

      <main className="container mx-auto px-4 py-8">
        {/* Level Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-xl">{levelData.levelNumber}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{levelData.title}</h1>
              <p className="text-muted-foreground">{levelData.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              Difficulty: Level {levelData.difficultyRating}
            </span>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">
              {levelData.maxXP} XP
            </span>
            {levelData.estimatedHours && (
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-semibold">
                ~{levelData.estimatedHours} hours
              </span>
            )}
          </div>
        </div>

        {/* Content Modules */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Concepts to Master</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levelData.concepts && JSON.parse(levelData.concepts || '[]')?.length > 0 ? (
              JSON.parse(levelData.concepts || '[]').map((concept: string, idx: number) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-primary text-lg">✓</span>
                    <span className="text-foreground font-medium">{concept}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No concepts defined yet</p>
            )}
          </div>
        </section>

        {/* Labs */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Labs</h2>
          {labs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {labs.map((lab) => (
                <div key={lab.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary transition">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-foreground flex-1">{lab.title}</h3>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-semibold">{lab.maxXP} XP</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{lab.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">{lab.difficulty}</span>
                    {lab.timeLimit && <span className="text-xs text-muted-foreground">Time: {lab.timeLimit}m</span>}
                  </div>
                  <Link href={`/lab/${lab.id}`}>
                    <Button className="w-full">Start Lab</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">No labs available for this level yet</p>
              <p className="text-sm text-muted-foreground">Check back soon for more interactive challenges</p>
            </div>
          )}
        </section>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Link href={`/learn/${parseInt(levelId.split('_')[0]) + 1}`}>
            <Button>Next Level</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
