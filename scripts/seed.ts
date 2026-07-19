import { db } from '@/lib/db'
import { learningLevel, achievement, interactiveLab } from '@/lib/db/schema'

const levels = [
  { number: 1, title: 'Fundamentals', difficulty: 1, hours: 2, xp: 100 },
  { number: 2, title: 'Networking Basics', difficulty: 1, hours: 3, xp: 150 },
  { number: 3, title: 'Cryptography 101', difficulty: 2, hours: 4, xp: 200 },
  { number: 4, title: 'Web Vulnerabilities', difficulty: 2, hours: 4, xp: 250 },
  { number: 5, title: 'SQL Injection Attacks', difficulty: 2, hours: 3, xp: 200 },
  { number: 6, title: 'Authentication & Authorization', difficulty: 2, hours: 3, xp: 200 },
  { number: 7, title: 'Malware Analysis', difficulty: 3, hours: 5, xp: 300 },
  { number: 8, title: 'Reverse Engineering', difficulty: 3, hours: 6, xp: 350 },
  { number: 9, title: 'Penetration Testing', difficulty: 3, hours: 5, xp: 300 },
  { number: 10, title: 'Network Security', difficulty: 3, hours: 4, xp: 250 },
  { number: 11, title: 'Incident Response', difficulty: 3, hours: 4, xp: 250 },
  { number: 12, title: 'Cloud Security', difficulty: 3, hours: 4, xp: 250 },
  { number: 13, title: 'Advanced Cryptography', difficulty: 4, hours: 5, xp: 350 },
  { number: 14, title: 'Exploit Development', difficulty: 4, hours: 6, xp: 400 },
  { number: 15, title: 'Mobile Security', difficulty: 4, hours: 5, xp: 350 },
  { number: 16, title: 'IoT Security', difficulty: 4, hours: 5, xp: 350 },
  { number: 17, title: 'Threat Intelligence', difficulty: 4, hours: 4, xp: 300 },
  { number: 18, title: 'Advanced Penetration Testing', difficulty: 5, hours: 6, xp: 450 },
  { number: 19, title: 'Red Team Operations', difficulty: 5, hours: 8, xp: 500 },
  { number: 20, title: 'Master Hacker', difficulty: 5, hours: 10, xp: 600 },
]

const achievements = [
  { slug: 'first-lab-success', title: 'First Success', category: 'skill', rarity: 'common', xp: 10 },
  { slug: 'level-1-complete', title: 'Fundamentals Master', category: 'progress', rarity: 'common', xp: 25 },
  { slug: 'perfect-submission', title: 'Perfect Code', category: 'skill', rarity: 'rare', xp: 50 },
  { slug: 'speedrunner', title: 'Speed Runner', category: 'achievement', rarity: 'rare', xp: 50 },
  { slug: 'streak-7', title: '7-Day Streak', category: 'engagement', rarity: 'uncommon', xp: 30 },
  { slug: 'streak-30', title: '30-Day Streak', category: 'engagement', rarity: 'rare', xp: 100 },
  { slug: 'xp-1000', title: '1000 XP Club', category: 'progress', rarity: 'uncommon', xp: 0 },
  { slug: 'leaderboard-top-10', title: 'Top 10 Hacker', category: 'competitive', rarity: 'rare', xp: 75 },
  { slug: 'lab-master', title: 'Lab Master', category: 'skill', rarity: 'epic', xp: 150 },
  { slug: 'all-levels-complete', title: 'Grand Master', category: 'progress', rarity: 'legendary', xp: 500 },
]

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Seed learning levels
    console.log('📚 Seeding learning levels...')
    for (const level of levels) {
      const levelId = `level_${level.number}_${Date.now()}`
      await db
        .insert(learningLevel)
        .values({
          id: levelId,
          levelNumber: level.number,
          title: level.title,
          description: `Master the skills of ${level.title.toLowerCase()}`,
          difficultyRating: level.difficulty,
          estimatedHours: level.hours.toString(),
          maxXP: level.xp,
          unlocked: level.number === 1, // Only level 1 is unlocked by default
          concepts: JSON.stringify([
            'Concept 1',
            'Concept 2',
            'Concept 3',
            'Core Principles',
            'Advanced Techniques',
          ]),
        })
    }

    // Seed achievements
    console.log('🏆 Seeding achievements...')
    for (const ach of achievements) {
      const achievementId = `achievement_${ach.slug}_${Date.now()}`
      try {
        await db
          .insert(achievement)
          .values({
            id: achievementId,
            slug: ach.slug,
            title: ach.title,
            description: `Earn this achievement by ${ach.title.toLowerCase()}`,
            icon: '🎯',
            xpReward: ach.xp,
            category: ach.category,
            rarity: ach.rarity,
          })
      } catch (e) {
        // Ignore duplicates
      }
    }

    // Seed sample labs for level 1
    console.log('🔬 Seeding sample labs...')
    const levelOneId = `level_1_${Date.now()}`
    const labs = [
      {
        title: 'Your First Hack',
        description: 'Complete your first security challenge',
        difficulty: 'beginner',
        xp: 50,
      },
      {
        title: 'Logic Puzzle',
        description: 'Solve the security logic puzzle',
        difficulty: 'beginner',
        xp: 40,
      },
    ]

    for (const lab of labs) {
      const labId = `lab_${lab.title.replace(/\\s+/g, '_')}_${Date.now()}`
      await db
        .insert(interactiveLab)
        .values({
          id: labId,
          levelId: levelOneId,
          title: lab.title,
          description: lab.description,
          difficulty: lab.difficulty,
          maxXP: lab.xp,
          initialCode: '# Write your code here\nprint("Hello, Security!")',
          testCases: JSON.stringify([
            { input: '', expectedOutput: 'security' },
            { input: '', expectedOutput: 'test' },
          ]),
          hints: JSON.stringify([
            'Think about what output the security system expects',
            'Look at the test cases for clues',
            'Common outputs include security keywords',
          ]),
        })
    }

    console.log('✅ Database seed completed successfully!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed().then(() => process.exit(0))
