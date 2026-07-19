# Google OAuth Setup Guide for CyberForge Academy

## Current Status ✅

The "Continue with Google" button is **fully implemented** and ready on both sign-in and sign-up pages.

## What's Already Set Up

- Google OAuth provider configured in Better Auth (`lib/auth.ts`)
- "Continue with Google" button with Google icon on sign-in page
- "Continue with Google" button with Google icon on sign-up page
- Visual separator between OAuth and email/password methods
- Error handling for missing credentials
- Responsive design on all screen sizes

## How to Activate Google OAuth

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Choose "Web application" as the application type
6. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### Step 2: Add Environment Variables

Add these to your Vercel project settings or `.env.local`:

```
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### Step 3: Test

1. Restart the dev server: `pnpm dev`
2. Go to http://localhost:3000/sign-in
3. Click "Continue with Google"
4. You'll be redirected to Google login
5. After authenticating, you'll be logged into CyberForge Academy

## Production Deployment

When deploying to production:

1. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel environment variables
2. Update Google OAuth settings with production redirect URI
3. Deploy to Vercel
4. Google OAuth will automatically work

## Troubleshooting

### "Google sign-in is not configured"
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables are set
- Check that the values are correct (no extra spaces)
- Restart the dev server after adding environment variables

### Redirect URI mismatch error
- Ensure the redirect URI in Google Console matches your app's URL
- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

### Users can't login with Google
- Check browser console for errors
- Verify credentials are properly set in environment variables
- Make sure the OAuth app is verified in Google Console

## Features

When Google OAuth is activated:

✅ Users can sign up with Google account
✅ Users can sign in with Google account  
✅ Profile information (name, email, picture) synced automatically
✅ Works seamlessly with existing email/password authentication
✅ Session management handled by Better Auth
✅ Works in development and production

## Security Notes

- Client Secret is never exposed to the browser
- All OAuth requests go through the server
- Sessions are properly validated
- Cookies use secure attributes in production

---

**The button is ready now!** Just add your Google OAuth credentials to activate the feature.
