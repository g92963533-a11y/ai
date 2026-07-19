'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

// In a real app, this would query a subscriptions table
// For MVP, we'll simulate tier based on user ID
export async function getUserTier(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return null

    // Simulate tier: users ending in 0-3 are premium for demo
    const userIdNum = parseInt(session.user.id.slice(-1), 10)
    if (userIdNum < 4) return 'premium'

    return 'free'
  } catch (error) {
    console.error('[v0] Get tier error:', error)
    return 'free'
  }
}

export async function checkTierAccess(requiredTier: 'free' | 'premium' | 'certification'): Promise<boolean> {
  const userTier = await getUserTier()

  const tierHierarchy = {
    free: 0,
    premium: 1,
    certification: 2,
  }

  const userLevel = tierHierarchy[userTier as keyof typeof tierHierarchy] ?? 0
  const requiredLevel = tierHierarchy[requiredTier]

  return userLevel >= requiredLevel
}

export async function trackMentorUsage(userId: string): Promise<number> {
  // In real app, query usage table for today
  // For MVP, return 0
  return 0
}

export async function trackAutoGradingUsage(userId: string): Promise<number> {
  // In real app, query usage table for today
  // For MVP, return 0
  return 0
}
