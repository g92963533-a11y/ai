'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { interactiveLab, labSubmission, achievement, userAchievement } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getLabById(labId: string) {
  const lab = await db.select().from(interactiveLab).where(eq(interactiveLab.id, labId)).limit(1)
  return lab[0] || null
}

export async function getUserLabSubmissions(labId: string) {
  const userId = await getUserId()
  const submissions = await db
    .select()
    .from(labSubmission)
    .where(and(eq(labSubmission.userId, userId), eq(labSubmission.labId, labId)))

  return submissions
}

export async function submitLabCode(labId: string, code: string) {
  const userId = await getUserId()

  // Validate code submission
  if (!code || code.trim().length === 0) {
    throw new Error('Code cannot be empty')
  }

  // Get lab details
  const lab = await db.select().from(interactiveLab).where(eq(interactiveLab.id, labId)).limit(1)

  if (!lab.length) {
    throw new Error('Lab not found')
  }

  const labData = lab[0]

  // Parse test cases
  let testCases: Array<{ input: string; expectedOutput: string }> = []
  try {
    testCases = JSON.parse(labData.testCases || '[]')
  } catch (e) {
    testCases = []
  }

  // Simple test case evaluation (in production, this would use a sandbox/runner)
  let testsPassed = 0
  const totalTests = testCases.length

  // Basic string matching for demo purposes
  for (const testCase of testCases) {
    try {
      // This is a simplified evaluation - in production use CodeSandbox API or similar
      if (code.includes(testCase.expectedOutput)) {
        testsPassed++
      }
    } catch (e) {
      console.error('[v0] Test execution error:', e)
    }
  }

  const xpEarned = testsPassed === totalTests ? labData.maxXP : Math.floor((testsPassed / totalTests) * labData.maxXP)
  const status = testsPassed === totalTests ? 'completed' : 'partial'

  // Create submission record
  const submissionId = `submission_${userId}_${labId}_${Date.now()}`
  await db.insert(labSubmission).values({
    id: submissionId,
    userId,
    labId,
    code,
    status,
    testsPassed,
    totalTests,
    xpEarned,
  })

  // Check for achievements
  if (testsPassed === totalTests) {
    // Mark submission as completed
    await db.update(labSubmission).set({ completedAt: new Date() }).where(eq(labSubmission.id, submissionId))

    // Award "First Success" achievement if this is their first submission
    const previousSubmissions = await db
      .select()
      .from(labSubmission)
      .where(and(eq(labSubmission.userId, userId), eq(labSubmission.labId, labId)))

    if (previousSubmissions.length === 1) {
      // This is the first completed submission
      const firstSuccessAchievement = await db
        .select()
        .from(achievement)
        .where(eq(achievement.slug, 'first-lab-success'))
        .limit(1)

      if (firstSuccessAchievement.length > 0) {
        const achievementId = `user_ach_${userId}_${firstSuccessAchievement[0].id}_${Date.now()}`
        try {
          await db
            .insert(userAchievement)
            .values({
              id: achievementId,
              userId,
              achievementId: firstSuccessAchievement[0].id,
            })
        } catch (e) {
          // Achievement already exists or duplicate, ignore
        }
      }
    }
  }

  revalidatePath(`/lab/${labId}`)

  return {
    submissionId,
    testsPassed,
    totalTests,
    xpEarned,
    status,
  }
}

export async function getLabStats(labId: string) {
  const userId = await getUserId()
  const submissions = await db
    .select()
    .from(labSubmission)
    .where(and(eq(labSubmission.userId, userId), eq(labSubmission.labId, labId)))

  const totalAttempts = submissions.length
  const completedSubmissions = submissions.filter((s) => s.status === 'completed')
  const totalXPEarned = submissions.reduce((sum, s) => sum + (s.xpEarned || 0), 0)
  const bestScore = submissions.reduce((best, s) => Math.max(best, s.testsPassed || 0), 0)

  return {
    totalAttempts,
    completed: completedSubmissions.length > 0,
    totalXPEarned,
    bestScore,
    totalTests: submissions[0]?.totalTests || 0,
  }
}
