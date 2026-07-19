# Google OAuth 2.0 Complete Setup Guide

This guide walks you through setting up Google OAuth 2.0 for CyberForge Academy using the latest Google Identity Services (GIS).

## Architecture Overview

```
User Frontend
     ↓
Google Sign-In Button (GIS)
     ↓
Google OAuth Server
     ↓
Get ID Token
     ↓
Send to /api/auth/google/verify
     ↓
Backend Verifies Token
     ↓
Create/Update User & Session
     ↓
Redirect to Dashboard
```

## Setup Steps

### 1. Create Google OAuth Application

**Go to Google Cloud Console:**
- Visit https://console.cloud.google.com
- Create a new project (or select existing)
- Search for "OAuth" in the search bar
- Click on "OAuth consent screen"

**Configure OAuth Consent Screen:**
- Choose "External" user type
- Fill in required fields:
  - App name: "CyberForge Academy"
  - User support email: your@email.com
  - Developer contact: your@email.com
- Click "Create"

**Create OAuth Credentials:**
- Go to "Credentials" in the left menu
- Click "Create Credentials" → "OAuth client ID"
- Choose "Web application"
- Name: "CyberForge Web Client"
- Add Authorized redirect URIs:
  ```
  http://localhost:3000/api/auth/google/callback
  https://your-domain.com/api/auth/google/callback
  https://your-domain.vercel.app/api/auth/google/callback
  ```
- Click "Create"
- Copy the **Client ID** and **Client Secret**

### 2. Configure Environment Variables

**Local Development (.env.local):**
```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

**Vercel Deployment:**
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following:
   - `GOOGLE_CLIENT_ID` = your_client_id.apps.googleusercontent.com
   - `GOOGLE_CLIENT_SECRET` = your_client_secret_here
   - `GOOGLE_CALLBACK_URL` = https://your-domain.vercel.app/api/auth/google/callback
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = your_client_id.apps.googleusercontent.com

**Important:** 
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is safe to expose (public)
- `GOOGLE_CLIENT_SECRET` should NEVER be exposed

### 3. File Structure

```
your-project/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── google/
│   │           └── verify/
│   │               └── route.ts          ← Token verification
│   ├── sign-in/
│   │   └── page.tsx                      ← Sign-in page (uses AuthForm)
│   └── sign-up/
│       └── page.tsx                      ← Sign-up page (uses AuthForm)
├── components/
│   ├── auth-form.tsx                     ← Main auth form (uses GoogleSignInButton)
│   └── google-signin-button.tsx          ← GIS button component
├── lib/
│   ├── auth.ts                           ← Better Auth config
│   ├── auth-client.ts                    ← Frontend auth client
│   └── db/
│       └── schema.ts                     ← Database schema
└── .env.local                            ← Environment variables
```

## How It Works

### 1. Frontend Flow (google-signin-button.tsx)

```typescript
// User clicks "Sign in with Google"
// ↓
// Google Identity Services renders Google Sign-In button
// ↓
// User authenticates with Google
// ↓
// Google returns ID Token (JWT)
// ↓
// Send token to /api/auth/google/verify
```

### 2. Backend Flow (app/api/auth/google/verify/route.ts)

```typescript
// Receive ID Token from frontend
// ↓
// Verify token signature with Google using OAuth2Client
// ↓
// Extract user data (email, name, picture, sub/googleId)
// ↓
// Check if user exists in database
//   - If YES: Update profile picture if needed
//   - If NO: Create new user
// ↓
// Link Google account to user
// ↓
// Create session token (7-day expiry)
// ↓
// Return session to frontend
```

### 3. Security Best Practices Implemented

✅ **Token Verification:**
- Verify token signature with Google
- Validate token expiration
- Check audience matches Client ID
- Use google-auth-library (official library)

✅ **User Data Protection:**
- Email verified automatically (from Google)
- Server-side session creation
- HTTP-only cookies for sessions
- CORS protection

✅ **Error Handling:**
- Invalid audience detection
- Invalid signature detection
- Token expiration handling
- Graceful error messages

✅ **Session Management:**
- 7-day session expiration
- Secure token generation (32 bytes random)
- User ID scoping for all queries
- Automatic session validation

## Testing Google OAuth Locally

### 1. Start Development Server
```bash
pnpm dev
```

### 2. Test Sign-In Flow
- Go to http://localhost:3000/sign-in
- Click "Continue with Google"
- Sign in with your Google account
- You should be redirected to /dashboard

### 3. Test Sign-Up Flow
- Go to http://localhost:3000/sign-up
- Click "Continue with Google"
- First-time users auto-create account
- Redirected to /dashboard

### 4. Verify Database Entry
```sql
-- Check user created
SELECT * FROM "user" WHERE email = 'your@email.com';

-- Check Google account linked
SELECT * FROM "account" WHERE "providerId" = 'google';

-- Check session created
SELECT * FROM "session" WHERE "userId" = '...';
```

## API Reference

### POST /api/auth/google/verify

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "userId": "user_abc123...",
  "sessionId": "abc123...",
  "user": {
    "id": "user_abc123...",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://..."
  }
}
```

**Error Responses:**
```json
// 400 - Missing ID token
{ "error": "ID token is required" }

// 401 - Invalid token
{ "error": "Invalid token audience. Please check your Google Client ID." }

// 500 - Server error
{ "error": "Token verification failed" }
```

## Troubleshooting

### "Google Identity Services failed to load"
- ✅ Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
- ✅ Clear browser cache
- ✅ Check browser console for CORS errors
- ✅ Verify Google CDN is accessible

### "Invalid token audience"
- ✅ Ensure `GOOGLE_CLIENT_ID` matches Google Console
- ✅ Check environment variables are deployed to Vercel
- ✅ Rebuild/redeploy after changing env vars

### "User creation fails"
- ✅ Check database connection (`DATABASE_URL`)
- ✅ Verify user table exists with correct schema
- ✅ Check `BETTER_AUTH_SECRET` is set

### "Session not persisting"
- ✅ Check cookies are enabled in browser
- ✅ Verify `BETTER_AUTH_SECRET` is set
- ✅ Check session table in database

## Production Checklist

- [ ] Google OAuth credentials created
- [ ] Environment variables set in Vercel
- [ ] Authorized redirect URIs include production domain
- [ ] HTTPS enabled on production
- [ ] Session expiration set appropriately (7 days default)
- [ ] Error messages reviewed (no sensitive data exposed)
- [ ] Tested sign-in → sign-up → dashboard flow
- [ ] Tested across browsers (Chrome, Firefox, Safari, Edge)
- [ ] Tested on mobile devices
- [ ] Logging/monitoring configured

## Security Reminders

🔒 **Never:**
- Commit `GOOGLE_CLIENT_SECRET` to version control
- Expose secret in frontend code
- Skip token verification on backend
- Trust client-side authentication alone
- Use localhost redirects in production

🔒 **Always:**
- Verify tokens on the backend
- Use HTTPS in production
- Keep dependencies updated
- Monitor authentication logs
- Implement rate limiting on auth endpoints
- Require email verification for new accounts

## Additional Resources

- Google Identity Services: https://developers.google.com/identity/gis/web
- OAuth 2.0 Spec: https://tools.ietf.org/html/rfc6749
- Better Auth Docs: https://better-auth.js.org
- Drizzle ORM: https://orm.drizzle.team
