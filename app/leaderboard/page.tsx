import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { leaderboard, user, userProfile } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import DashboardHeader from '@/components/dashboard-header'
import ProgressCard from '@/components/progress-card'

export default async function LeaderboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  // Get leaderboard data with user info
  const leaderboardData = await db
    .select({
      rank: leaderboard.rank,
      totalXP: leaderboard.totalXP,
      level: leaderboard.level,
      weeklyXP: leaderboard.weeklyXP,
      monthlyXP: leaderboard.monthlyXP,
      userId: leaderboard.userId,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
      hackerLevel: userProfile.hackerLevel,
    })
    .from(leaderboard)
    .leftJoin(user, eq(leaderboard.userId, user.id))
    .leftJoin(userProfile, eq(leaderboard.userId, userProfile.userId))
    .orderBy(desc(leaderboard.totalXP))
    .limit(100)

  // Get current user's rank
  const currentUserLeaderboard = await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.userId, session.user.id))
    .limit(1)

  const userRank = currentUserLeaderboard[0]?.rank || leaderboardData.findIndex((l) => l.userId === session.user.id) + 1

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={session.user.name || 'Hacker'} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🏆 Leaderboard</h1>
          <p className="text-muted-foreground">Compete with hackers worldwide and climb the rankings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ProgressCard title="Your Rank" value={`#${userRank}`} icon="🎯" color="primary" />
          <ProgressCard title="Your XP" value={currentUserLeaderboard[0]?.totalXP || 0} icon="⭐" color="accent" />
          <ProgressCard title="Your Level" value={currentUserLeaderboard[0]?.level || 1} icon="📈" color="secondary" />
        </div>

        {/* Leaderboard Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Hacker</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Total XP</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Weekly XP</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Monthly XP</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Level</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry, idx) => (
                  <tr
                    key={entry.userId}
                    className={`border-b border-border transition ${
                      entry.userId === session.user.id ? 'bg-primary/10' : 'hover:bg-secondary/50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        {idx === 0 && <span className="text-2xl">🥇</span>}
                        {idx === 1 && <span className="text-2xl">🥈</span>}
                        {idx === 2 && <span className="text-2xl">🥉</span>}
                        {idx > 2 && <span className="font-bold text-foreground">#{idx + 1}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-foreground">{entry.userName}</div>
                        <div className="text-xs text-muted-foreground">{entry.hackerLevel}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-primary">{entry.totalXP.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-foreground">{(entry.weeklyXP ?? 0).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-foreground">{(entry.monthlyXP ?? 0).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-semibold">Level {entry.level}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leaderboardData.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No leaderboard data yet. Start learning to appear on the leaderboard!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
