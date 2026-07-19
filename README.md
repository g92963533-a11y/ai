# CyberForge Academy

Master cybersecurity with AI-powered learning, automatic grading, and personalized guidance. Learn from novice to expert with our 20-level comprehensive curriculum.

## 🚀 Live Features

- **20 Cybersecurity Learning Levels** - From fundamentals to mastery
- **AI Auto-Grading** - Instant feedback on lab submissions using Claude AI
- **24/7 AI Mentor** - Ask questions, get personalized guidance anytime
- **Automatic Achievements** - Unlock badges as you progress
- **Personalized Learning Paths** - AI recommends your next best lessons
- **Leaderboard** - Compete with other learners
- **Freemium Model** - Learn for free or upgrade for unlimited access
- **Google OAuth** - Sign in with your Google account
- **Professional Certificates** - Get industry-recognized credentials

## 📊 Pricing Tiers

### Free
- Levels 1-5 (5 levels)
- 5 AI Mentor questions/day
- Basic achievements
- **$0/month**

### Premium
- All 20 levels
- Unlimited AI Mentor
- Auto-grading for all labs
- Certificates & job board
- **$9.99/month**

### Professional Certification
- Everything in Premium
- Professional credentials
- 1-on-1 mentoring
- Lifetime access
- **$29.99/month**

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (email + Google OAuth)
- **AI**: Anthropic Claude 3.5 Sonnet (via AI SDK)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Neon PostgreSQL database

### Setup

1. **Clone and install**
   ```bash
   git clone <repo>
   cd cyberforge-academy
   pnpm install
   ```

2. **Environment Variables**
   ```bash
   # .env.local
   DATABASE_URL=postgresql://...  # From Neon integration
   BETTER_AUTH_SECRET=...          # Generate: openssl rand -base64 32
   
   # Optional: Google OAuth
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

3. **Run development server**
   ```bash
   pnpm dev
   ```

4. **Visit** http://localhost:3000

## 📚 Project Structure

```
/app
  /api/auth        # Authentication endpoints
  /actions         # Server actions (user, labs, mentor, subscription)
  /learn           # Learning level pages
  /lab             # Lab editor pages
  /dashboard       # Main dashboard
  /pricing         # Pricing page
  /sign-in, /sign-up  # Auth pages

/lib
  /ai              # AI modules (auto-grader, achievements, personalization)
  /db              # Database (Drizzle schema, client)
  auth.ts          # Better Auth config
  pricing.ts       # Pricing tier definitions

/components
  # UI components (dashboard, progress, level cards, etc.)

/scripts
  seed.ts          # Database seeding script
```

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy!

```bash
vercel deploy
```

## 🤖 AI Features

### Auto-Grading
- Submits code to Claude AI
- Evaluates against test cases
- Provides personalized feedback
- Suggests improvements

### Achievement Automation
- Monitors user progress
- Unlocks badges automatically
- Updates leaderboard in real-time
- Rewards XP for achievements

### Personalization
- Analyzes user performance
- Recommends optimal learning paths
- Suggests next levels based on difficulty
- Provides daily learning suggestions

## 📖 Usage Examples

### Sign In
1. Visit `/sign-in`
2. Use email/password or Google OAuth
3. Redirects to dashboard

### Learn a Level
1. Click level card from dashboard
2. Check tier access (free tier = levels 1-5)
3. Complete labs and submit code
4. Get instant AI feedback

### Use AI Mentor
1. Visit `/learn/[level]` page
2. Open mentor chat
3. Ask questions
4. Get streamed responses from Claude AI

### View Pricing
1. Visit `/pricing`
2. Compare tiers
3. Click "Upgrade Now" to subscribe

## 🔑 Key Endpoints

- `GET /api/auth/[...all]` - Auth endpoints
- `POST /api/actions/submitLab` - Lab submission
- `GET /dashboard` - Dashboard
- `GET /learn/[levelId]` - Learning page
- `GET /pricing` - Pricing page

## 🗄️ Database

20+ production tables:
- User accounts & profiles
- Learning levels & progress
- Labs & submissions  
- Achievements & leaderboard
- Mentor sessions & messages
- Career paths & job listings
- Marketplace items & reviews

See `IMPLEMENTATION_SUMMARY.md` for full schema details.

## 🔒 Security

- Better Auth for secure sessions
- Server-side validation
- Parameterized queries
- Per-user data scoping
- HTTPS-only in production
- CSRF protection

## 📊 Performance

- Build time: ~145ms
- Optimized static pages
- Server-side rendering
- Database indexes configured
- Image optimization
- Code splitting

## 🎯 Roadmap

- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Social features (study groups)
- [ ] Mobile app (React Native)
- [ ] Enterprise team management
- [ ] Advanced progress tracking

## 📝 License

MIT License

## 🤝 Support

- Documentation: See `IMPLEMENTATION_SUMMARY.md`
- Issues: Create GitHub issue
- Email: support@cyberforgeacademy.com

---

**Built with ❤️ using Next.js, AI SDK, and Vercel**
