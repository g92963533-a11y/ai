'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userProfile, learningLevel, userProgress, achievement, userAchievement, leaderboard } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user || null
}

export async function getUserProfile() {
  const userId = await getUserId()
  const profile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1)

  return profile[0] || null
}

export async function initializeUserProfile(name: string) {
  const userId = await getUserId()

  // Check if profile already exists
  const existing = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1)

  if (existing.length > 0) {
    return existing[0]
  }

  // Create new profile
  const profileId = `profile_${userId}_${Date.now()}`
  await db.insert(userProfile).values({
    id: profileId,
    userId,
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    hackerLevel: 'novice',
  })

  return {
    id: profileId,
    userId,
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    hackerLevel: 'novice',
  }
}

export async function getLearningLevels() {
  const levels = await db
    .select()
    .from(learningLevel)
    .orderBy(learningLevel.levelNumber)

  return levels
}

export async function getUserProgress() {
  const userId = await getUserId()
  const progress = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .orderBy(userProgress.levelId)

  return progress
}

export async function getLevelProgress(levelId: string) {
  const userId = await getUserId()
  const progress = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.levelId, levelId)))
    .limit(1)

  return progress[0] || null
}

export async function getUserAchievements() {
  const userId = await getUserId()
  const achievements = await db
    .select({
      achievement,
      unlockedAt: userAchievement.unlockedAt,
    })
    .from(userAchievement)
    .innerJoin(achievement, eq(userAchievement.achievementId, achievement.id))
    .where(eq(userAchievement.userId, userId))
    .orderBy(desc(userAchievement.unlockedAt))

  return achievements
}

export async function getLeaderboard(limit = 50) {
  const leaderboardData = await db
    .select()
    .from(leaderboard)
    .orderBy(desc(leaderboard.totalXP))
    .limit(limit)

  return leaderboardData
}

export async function updateUserXP(xpAmount: number) {
  const userId = await getUserId()

  // Update user profile XP
  const profile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1)

  if (profile.length > 0) {
    const newXP = (profile[0].totalXP || 0) + xpAmount
    await db
      .update(userProfile)
      .set({ totalXP: newXP })
      .where(eq(userProfile.userId, userId))

    // Update leaderboard
    const leaderboardEntry = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.userId, userId))
      .limit(1)

    if (leaderboardEntry.length > 0) {
      await db
        .update(leaderboard)
        .set({ totalXP: newXP })
        .where(eq(leaderboard.userId, userId))
    } else {
      const leaderboardId = `leaderboard_${userId}_${Date.now()}`
      await db.insert(leaderboard).values({
        id: leaderboardId,
        userId,
        totalXP: newXP,
      })
    }
  }
}
