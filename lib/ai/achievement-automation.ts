'use server'

import { db } from '@/lib/db'
import { userAchievement, achievement, userProfile, leaderboard } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export interface AchievementUnlock {
  achievementId: string
  achievementName: string
  xpReward: number
}

export async function checkAndUnlockAchievements(userId: string): Promise<AchievementUnlock[]> {
  try {
    const unlockedAchievements: AchievementUnlock[] = []

    // Get user profile
    const profile = await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1)
    if (!profile.length) return []

    const userXP = profile[0].totalXP ?? 0
    const userStreak = profile[0].currentStreak ?? 0

    // Define achievement unlock criteria
    const achievementCriteria = [
      { slug: 'first-lab-success', condition: () => userXP >= 50 },
      { slug: 'hundred-xp', condition: () => userXP >= 100 },
      { slug: 'level-up', condition: () => userXP >= 500 },
      { slug: 'streak-warrior', condition: () => userStreak >= 7 },
      { slug: 'level-master', condition: () => userXP >= 2000 },
      { slug: 'hacker-elite', condition: () => userXP >= 5000 },
    ]

    // Check each achievement
    for (const criteria of achievementCriteria) {
      if (criteria.condition()) {
        // Check if already unlocked
        const existing = await db
          .select()
          .from(userAchievement)
          .where(and(eq(userAchievement.userId, userId), eq(userAchievement.achievementId, criteria.slug)))
          .limit(1)

        if (!existing.length) {
          // Get achievement details
          const ach = await db
            .select()
            .from(achievement)
            .where(eq(achievement.slug, criteria.slug))
            .limit(1)

          if (ach.length) {
            // Unlock achievement
            const unlockedId = `ua_${nanoid()}`
            await db.insert(userAchievement).values({
              id: unlockedId,
              userId,
              achievementId: ach[0].id,
              unlockedAt: new Date(),
            })

            unlockedAchievements.push({
              achievementId: ach[0].id,
              achievementName: ach[0].title,
              xpReward: ach[0].xpReward ?? 0,
            })
          }
        }
      }
    }

    return unlockedAchievements
  } catch (error) {
    console.error('[v0] Achievement unlock error:', error)
    return []
  }
}

export async function updateLeaderboard(userId: string): Promise<void> {
  try {
    const profile = await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1)
    if (!profile.length) return

    const totalXP = profile[0].totalXP ?? 0
    const weeklyXP = 0 // Would be calculated from recent submissions
    const monthlyXP = 0 // Would be calculated from recent submissions
    const level = Math.floor(totalXP / 500) + 1

    const existing = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.userId, userId))
      .limit(1)

    if (existing.length) {
      await db
        .update(leaderboard)
        .set({
          totalXP,
          level,
          weeklyXP,
          monthlyXP,
          lastUpdated: new Date(),
        })
        .where(eq(leaderboard.userId, userId))
    } else {
      const lbId = `lb_${nanoid()}`
      await db.insert(leaderboard).values({
        id: lbId,
        userId,
        rank: 0,
        totalXP,
        level,
        weeklyXP,
        monthlyXP,
        lastUpdated: new Date(),
      })
    }
  } catch (error) {
    console.error('[v0] Leaderboard update error:', error)
  }
}
