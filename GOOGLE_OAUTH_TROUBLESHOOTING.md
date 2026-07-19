# Google OAuth Troubleshooting Guide

## Error: 400 invalid_request - flowName=GeneralOAuthFlow

This error means Google OAuth is not properly configured. Here's how to fix it:

### Step 1: Verify Environment Variables Are Set

Check your `.env.local` file (create if it doesn't exist):

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

**Note:** The `NEXT_PUBLIC_` prefix makes the variable accessible in the browser. This is safe because Client IDs are public.

### Step 2: Get Your Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com
   - Create a new project (name it "CyberForge Academy")

2. **Enable Google+ API:**
   - Click "APIs & Services"
   - Click "Enable APIs and Services"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials:**
   - Go to "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Name it "CyberForge Sign-In"

4. **Add Authorized Redirect URIs:**
   - Under "Authorized redirect URIs", add:
     ```
     http://localhost:3000/api/auth/google/callback
     http://localhost:3000
     https://yourdomain.vercel.app/api/auth/google/callback
     https://yourdomain.vercel.app
     ```

5. **Copy Your Credentials:**
   - Copy your Client ID and Client Secret
   - Add them to your `.env.local` file

### Step 3: Restart Your Dev Server

```bash
# Kill the current server (Ctrl+C)
# Then restart
pnpm dev
```

### Step 4: Test

1. Go to http://localhost:3000/sign-in
2. Click the Google Sign-In button
3. You should see the Google authentication popup

## Common Errors and Solutions

### Error: "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured"

**Cause:** Environment variable is not set
**Solution:** 
1. Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `.env.local`
2. Restart dev server with `pnpm dev`

### Error: "Google Sign-In is unavailable"

**Cause:** Google's JavaScript library failed to load
**Solution:**
1. Check your internet connection
2. Check browser console (F12 → Console tab)
3. Clear browser cache and reload

### Error: "Token verification failed"

**Cause:** Backend couldn't verify the token
**Solution:**
1. Check that `GOOGLE_CLIENT_SECRET` is set in `.env.local`
2. Ensure it matches exactly with Google Console
3. Check server logs for detailed error

### Error: "Redirect URI mismatch"

**Cause:** The redirect URI doesn't match Google's configuration
**Solution:**
1. Go to Google Cloud Console
2. Click your OAuth credentials
3. Ensure all redirect URIs are added:
   - `http://localhost:3000`
   - `https://yourdomain.vercel.app`

## Debugging Tips

### Check Browser Console

Open your browser's developer tools (F12) and look for:
- Blue `[v0]` messages showing initialization
- Red errors indicating problems

### Check Network Requests

In browser DevTools → Network tab:
1. Look for `/api/auth/google/verify` requests
2. Check response status (should be 200)
3. Look at response body for error details

### Check Environment Variables

Add this to your `.env.local` to verify they're loaded:

```env
# Debug
DEBUG_GOOGLE_CLIENT_ID=true
```

Then in components/google-signin-button.tsx temporarily add:
```javascript
console.log('Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
```

## Production Deployment on Vercel

1. **Add Environment Variables:**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`

2. **Update Google Console:**
   - Add your Vercel domain to Authorized Redirect URIs:
     - `https://yourdomain.vercel.app`
     - `https://yourdomain.vercel.app/api/auth/google/callback`

3. **Deploy:**
   - Push to GitHub
   - Vercel auto-deploys

## File Locations Reference

- **Environment Config:** `.env.local` (local) or Vercel Dashboard (production)
- **Frontend Component:** `components/google-signin-button.tsx`
- **Backend Verification:** `app/api/auth/google/verify/route.ts`
- **Auth Config:** `lib/auth.ts`
- **Sign-In Page:** `app/sign-in/page.tsx`
- **Sign-Up Page:** `app/sign-up/page.tsx`

## Still Having Issues?

1. Check `GOOGLE_OAUTH_COMPLETE_SETUP.md` for detailed setup
2. Review `GOOGLE_OAUTH_IMPLEMENTATION.md` for technical details
3. Check browser console for `[v0]` debug messages
4. Verify all environment variables match exactly
5. Ensure localhost:3000 is accessible
