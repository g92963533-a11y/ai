# Google OAuth Quick Start Guide

## 5-Minute Setup

### Step 1: Get Credentials (2 min)
1. Go to https://console.cloud.google.com
2. Create new project
3. Search for "OAuth" → Configure consent screen
4. Click "Create Credentials" → "OAuth client ID" → "Web application"
5. Add redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy **Client ID** and **Client Secret**

### Step 2: Set Environment Variables (1 min)
Create `.env.local`:
```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### Step 3: Test (2 min)
```bash
pnpm dev
# Visit http://localhost:3000/sign-in
# Click "Sign in" button
# Sign in with Google account
# You're in the dashboard!
```

## Files Created

| File | Purpose |
|------|---------|
| `app/api/auth/google/verify/route.ts` | Backend token verification |
| `components/google-signin-button.tsx` | GIS button component |
| `.env.example` | Environment variables template |

## Production Deployment

### On Vercel:
1. Set environment variables in Vercel dashboard
2. Add production domain to Google OAuth redirect URIs
3. Push to GitHub
4. Vercel auto-deploys

### Environment Variables for Vercel:
```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET  
NEXT_PUBLIC_GOOGLE_CLIENT_ID
GOOGLE_CALLBACK_URL=https://yourdomain.vercel.app/api/auth/google/callback
```

## How It Works

1. **Frontend:** User clicks "Sign in" → Google Sign-In popup
2. **Backend:** Token sent to `/api/auth/google/verify`
3. **Verification:** Token verified with google-auth-library
4. **Database:** User created or updated
5. **Session:** 7-day session created
6. **Redirect:** User sent to `/dashboard`

## Security Features

✅ Server-side token verification
✅ Secure session tokens (32 bytes)
✅ User data scoping
✅ Environment variable isolation
✅ HTTPS in production
✅ Error handling

## What You Get

✅ Official Google Sign-In button
✅ Latest OAuth 2.0 standards
✅ Automatic user creation
✅ Profile picture sync
✅ Email verification
✅ Secure sessions

## Common Issues

| Issue | Solution |
|-------|----------|
| Button not appearing | Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set |
| Invalid audience error | Verify `GOOGLE_CLIENT_ID` matches console |
| User not created | Check database connection |

## Full Documentation

- **Complete Setup:** `GOOGLE_OAUTH_COMPLETE_SETUP.md`
- **Implementation Details:** `GOOGLE_OAUTH_IMPLEMENTATION.md`

---

**That's it! You now have secure Google OAuth 2.0 authentication.** 🎉
