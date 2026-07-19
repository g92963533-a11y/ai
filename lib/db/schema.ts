import { pgTable, text, timestamp, boolean, integer, decimal, uniqueIndex } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// --- CyberForge Academy Tables ---

export const userProfile = pgTable('user_profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  totalXP: integer('totalXP').default(0),
  currentStreak: integer('currentStreak').default(0),
  longestStreak: integer('longestStreak').default(0),
  lastActiveDate: timestamp('lastActiveDate'),
  preferredLanguage: text('preferredLanguage').default('python'),
  bio: text('bio'),
  avatar: text('avatar'),
  hackerLevel: text('hackerLevel').default('novice'),
  certifications: text('certifications').default('{}'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const learningLevel = pgTable('learning_level', {
  id: text('id').primaryKey(),
  levelNumber: integer('levelNumber').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  difficultyRating: integer('difficultyRating').default(1),
  estimatedHours: decimal('estimatedHours'),
  maxXP: integer('maxXP').notNull(),
  prerequisites: text('prerequisites').default('{}'),
  concepts: text('concepts').default('{}'),
  contentModules: integer('contentModules').default(0),
  unlocked: boolean('unlocked').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const userProgress = pgTable('user_progress', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  levelId: text('levelId').notNull(),
  status: text('status').default('locked'),
  completedModules: integer('completedModules').default(0),
  currentModule: integer('currentModule').default(0),
  xpEarned: integer('xpEarned').default(0),
  startedAt: timestamp('startedAt'),
  completedAt: timestamp('completedAt'),
  lastAccessedAt: timestamp('lastAccessedAt').notNull().defaultNow(),
  notes: text('notes'),
})

export const interactiveLab = pgTable('interactive_lab', {
  id: text('id').primaryKey(),
  levelId: text('levelId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  difficulty: text('difficulty').default('beginner'),
  timeLimit: integer('timeLimit'),
  maxXP: integer('maxXP').notNull(),
  labType: text('labType').default('code'),
  initialCode: text('initialCode'),
  testCases: text('testCases'),
  solutionCode: text('solutionCode'),
  hints: text('hints').default('{}'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const labSubmission = pgTable('lab_submission', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  labId: text('labId').notNull(),
  code: text('code').notNull(),
  status: text('status').default('pending'),
  testsPassed: integer('testsPassed').default(0),
  totalTests: integer('totalTests').default(0),
  xpEarned: integer('xpEarned').default(0),
  submittedAt: timestamp('submittedAt').notNull().defaultNow(),
  completedAt: timestamp('completedAt'),
})

export const achievement = pgTable('achievement', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  icon: text('icon'),
  xpReward: integer('xpReward').default(0),
  category: text('category').default('skill'),
  rarity: text('rarity').default('common'),
  unlockedCount: integer('unlockedCount').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const userAchievement = pgTable('user_achievement', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  achievementId: text('achievementId').notNull(),
  unlockedAt: timestamp('unlockedAt').notNull().defaultNow(),
})

export const leaderboard = pgTable('leaderboard', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  rank: integer('rank'),
  totalXP: integer('totalXP').notNull(),
  level: integer('level').default(0),
  weeklyXP: integer('weeklyXP').default(0),
  monthlyXP: integer('monthlyXP').default(0),
  lastUpdated: timestamp('lastUpdated').notNull().defaultNow(),
})

export const mentorSession = pgTable('mentor_session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  topicId: text('topicId').notNull(),
  question: text('question').notNull(),
  context: text('context'),
  status: text('status').default('active'),
  startedAt: timestamp('startedAt').notNull().defaultNow(),
  endedAt: timestamp('endedAt'),
})

export const mentorMessage = pgTable('mentor_message', {
  id: text('id').primaryKey(),
  sessionId: text('sessionId').notNull(),
  role: text('role').default('user'),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const careerPath = pgTable('career_path', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  requiredLevel: integer('requiredLevel').default(1),
  skills: text('skills').default('{}'),
  jobRoles: text('jobRoles').default('{}'),
  salaryRange: text('salaryRange'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const userCareer = pgTable('user_career', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  careerPathId: text('careerPathId').notNull(),
  resume: text('resume'),
  portfolio: text('portfolio'),
  targetRole: text('targetRole'),
  skills: text('skills').default('{}'),
  experienceLevel: text('experienceLevel').default('entry'),
  openToWork: boolean('openToWork').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const jobListing = pgTable('job_listing', {
  id: text('id').primaryKey(),
  employerId: text('employerId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  requiredSkills: text('requiredSkills').default('{}'),
  minLevel: integer('minLevel').default(1),
  location: text('location'),
  jobType: text('jobType').default('full-time'),
  salary: text('salary'),
  postedAt: timestamp('postedAt').notNull().defaultNow(),
  expiresAt: timestamp('expiresAt'),
  status: text('status').default('active'),
  applicantCount: integer('applicantCount').default(0),
})

export const jobApplication = pgTable('job_application', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  jobId: text('jobId').notNull(),
  status: text('status').default('pending'),
  appliedAt: timestamp('appliedAt').notNull().defaultNow(),
  responseAt: timestamp('responseAt'),
  employerNotes: text('employerNotes'),
})

export const userMessage = pgTable('user_message', {
  id: text('id').primaryKey(),
  senderId: text('senderId').notNull(),
  recipientId: text('recipientId').notNull(),
  relatedJobId: text('relatedJobId'),
  subject: text('subject'),
  content: text('content').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const marketplaceItem = pgTable('marketplace_item', {
  id: text('id').primaryKey(),
  creatorId: text('creatorId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  category: text('category').default('resource'),
  price: decimal('price').default('0'),
  downloadCount: integer('downloadCount').default(0),
  rating: decimal('rating').default('5'),
  ratingCount: integer('ratingCount').default(0),
  status: text('status').default('published'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const contentPurchase = pgTable('content_purchase', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  itemId: text('itemId').notNull(),
  purchasedAt: timestamp('purchasedAt').notNull().defaultNow(),
})

export const contentReview = pgTable('content_review', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  itemId: text('itemId').notNull(),
  rating: integer('rating').default(5),
  comment: text('comment'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
