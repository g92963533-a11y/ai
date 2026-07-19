export const PRICING_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started with cybersecurity',
    features: [
      'Levels 1-5 access',
      '5 AI Mentor questions/day',
      'Basic achievements',
      'Leaderboard access (read-only)',
      'Community resources',
    ],
    limitations: {
      maxLevels: 5,
      mentorQuestionsPerDay: 5,
      autoGradingPerDay: 10,
    },
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    priceId: 'price_premium_monthly', // Stripe price ID
    description: 'Unlock full learning potential',
    features: [
      'All 20 cybersecurity levels',
      'Unlimited AI Mentor questions',
      'Auto-grading for all labs',
      'Personalized learning paths',
      'Advanced achievements',
      'Leaderboard with stats',
      'Certificate generation',
      'Priority support',
    ],
    limitations: {
      maxLevels: 20,
      mentorQuestionsPerDay: -1, // unlimited
      autoGradingPerDay: -1, // unlimited
    },
  },
  CERTIFICATION: {
    id: 'certification',
    name: 'Professional Certification',
    price: 29.99,
    priceId: 'price_certification_monthly', // Stripe price ID
    description: 'Industry-recognized credentials',
    features: [
      'All Premium features',
      'Professional certificates',
      'Resume credentials',
      'Employer verification badge',
      'Career path guidance',
      'Job board access',
      '1-on-1 mentoring sessions',
      'Lifetime access',
    ],
    limitations: {
      maxLevels: 20,
      mentorQuestionsPerDay: -1,
      autoGradingPerDay: -1,
    },
  },
}

export type TierType = keyof typeof PRICING_TIERS

export function getTierLimits(tier: string | null): (typeof PRICING_TIERS)[TierType]['limitations'] {
  if (tier === 'premium' || tier === 'certification') {
    return PRICING_TIERS[tier === 'premium' ? 'PREMIUM' : 'CERTIFICATION'].limitations
  }
  return PRICING_TIERS.FREE.limitations
}

export function canAccessLevel(tier: string | null, levelNumber: number): boolean {
  const limits = getTierLimits(tier)
  return levelNumber <= limits.maxLevels
}

export function canUseMentorToday(questionsUsedToday: number, tier: string | null): boolean {
  const limits = getTierLimits(tier)
  if (limits.mentorQuestionsPerDay === -1) return true // unlimited
  return questionsUsedToday < limits.mentorQuestionsPerDay
}

export function canAutoGradeToday(submissionsToday: number, tier: string | null): boolean {
  const limits = getTierLimits(tier)
  if (limits.autoGradingPerDay === -1) return true // unlimited
  return submissionsToday < limits.autoGradingPerDay
}
