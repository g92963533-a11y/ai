'use server'

import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { db } from '@/lib/db'
import { userProgress, learningLevel, userProfile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export interface PersonalizedRecommendation {
  levelId: string
  levelNumber: number
  title: string
  reason: string
}

export async function generatePersonalizedRecommendations(userId: string): Promise<PersonalizedRecommendation[]> {
  try {
    // Get user profile
    const profile = await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1)
    if (!profile.length) return []

    // Get user progress
    const progress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(10)

    // Get all levels
    const allLevels = await db.select().from(learningLevel).limit(20)

    // Find completed and current levels
    const completedLevels = progress.filter((p) => p.status === 'completed').map((p) => p.levelId)
    const nextLevelNumber = Math.max(
      1,
      Math.max(...progress.map((p) => parseInt(p.levelId.split('_')[1] || '0')), 0) + 1
    )

    // Get next 3 available levels
    const recommendedLevels = allLevels.filter((l) => l.levelNumber >= nextLevelNumber).slice(0, 3)

    const prompt = `You are a cybersecurity learning path AI. Based on this user's profile, recommend the next learning levels:

User's Current Stats:
- Total XP: ${profile[0].totalXP ?? 0}
- Current Streak: ${profile[0].currentStreak ?? 0} days
- Hacker Level: ${profile[0].hackerLevel ?? 'Novice'}
- Completed Levels: ${completedLevels.length}

Available Next Levels:
${recommendedLevels.map((l) => `- Level ${l.levelNumber}: ${l.title} (Difficulty: ${l.difficultyRating}/5, Estimated: ${l.estimatedHours}h)`).join('\n')}

Provide 2-3 personalized recommendations. For each, explain why it's a good next step for this learner.

Format your response as JSON:
[
  {
    "levelNumber": number,
    "reason": "string explaining why this is recommended"
  }
]`

    const result = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt,
      temperature: 0.7,
    })

    try {
      const parsed = JSON.parse(result.text)
      return parsed
        .map((rec: { levelNumber: number; reason: string }) => {
          const level = recommendedLevels.find((l) => l.levelNumber === rec.levelNumber)
          return level
            ? {
                levelId: level.id,
                levelNumber: level.levelNumber,
                title: level.title,
                reason: rec.reason,
              }
            : null
        })
        .filter(Boolean)
    } catch {
      // If parsing fails, return the next level
      return recommendedLevels.map((l) => ({
        levelId: l.id,
        levelNumber: l.levelNumber,
        title: l.title,
        reason: `Continue your journey with Level ${l.levelNumber}`,
      }))
    }
  } catch (error) {
    console.error('[v0] Personalization error:', error)
    return []
  }
}

export async function saveDailyRecommendation(userId: string, recommendations: PersonalizedRecommendation[]): Promise<void> {
  try {
    // Store in a simple recommendations table/cache
    // For MVP, we just log it
    console.log(`[v0] Daily recommendations for ${userId}:`, recommendations)
  } catch (error) {
    console.error('[v0] Save recommendation error:', error)
  }
}
