# Step-by-Step Google OAuth Setup Guide

Follow these steps exactly to get Google OAuth working on your local machine.

## STEP 1: Create `.env.local` File

Create a new file named `.env.local` in your project root (same level as `package.json`).

**Command:**
```bash
cd /vercel/share/v0-project
cp .env.local.example .env.local
```

This creates your configuration file.

---

## STEP 2: Go to Google Cloud Console

1. Open https://console.cloud.google.com in your browser
2. Sign in with your Google account (or create one)
3. You'll see the Google Cloud Console dashboard

---

## STEP 3: Create a New Project

1. At the top left, click on the project dropdown
2. Click "NEW PROJECT"
3. Enter name: `CyberForge Academy`
4. Click "CREATE"
5. Wait for the project to be created (2-3 seconds)
6. Click the notification to open your new project

---

## STEP 4: Enable Google+ API

1. In the left sidebar, click "APIs & Services"
2. Click "Enable APIs and Services" (or "Library")
3. Search for: `Google+ API`
4. Click "Google+ API" from the results
5. Click the blue "ENABLE" button
6. Wait for it to enable (a few seconds)

---

## STEP 5: Create OAuth Credentials

1. In the left sidebar, click "Credentials"
2. Click the blue "+ CREATE CREDENTIALS" button
3. Select "OAuth 2.0 Client ID"
4. You might see: "You'll need to create a consent screen first"
   - Click "CONFIGURE CONSENT SCREEN"
   - Choose "External"
   - Click "CREATE"
   - Fill in:
     - App name: `CyberForge Academy`
     - User support email: your@email.com
     - Developer contact info: your@email.com
   - Click "SAVE AND CONTINUE"
   - Skip the next pages, click "SAVE AND CONTINUE" each time
   - Click "BACK TO DASHBOARD"

5. Now click "Credentials" again in the left sidebar
6. Click "+ CREATE CREDENTIALS"
7. Select "OAuth 2.0 Client ID"
8. Choose "Web application"
9. Name: `CyberForge Sign-In`
10. Under "Authorized JavaScript origins", click "ADD URI" and add:
    ```
    http://localhost:3000
    ```
11. Under "Authorized redirect URIs", click "ADD URI" and add:
    ```
    http://localhost:3000/api/auth/google/callback
    ```
12. Click "CREATE"

---

## STEP 6: Copy Your Credentials

After clicking CREATE, you'll see a popup with your credentials:

1. **Copy the Client ID** - Long string ending with `.apps.googleusercontent.com`
2. **Copy the Client Secret** - Random string of characters
3. Click "DONE"

You can always find these again by clicking on your credential in the Credentials page.

---

## STEP 7: Update Your `.env.local` File

Open `.env.local` (created in STEP 1) and replace with:

```env
# Replace YOUR_CLIENT_ID with the Client ID you copied
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com

# Replace YOUR_CLIENT_SECRET with the Client Secret you copied
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

# Keep these as-is (from your Neon setup)
DATABASE_URL=postgresql://user:password@host/dbname
BETTER_AUTH_SECRET=your_generated_secret_here

# Keep this
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Example (with fake credentials):**
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-1234567890abcdefghijklmn
```

**IMPORTANT:** Don't share these values with anyone!

---

## STEP 8: Restart Your Dev Server

1. Stop the current dev server (press `Ctrl+C` in your terminal)
2. Restart it:
   ```bash
   pnpm dev
   ```
3. Wait for it to compile (should say "Ready" in terminal)

---

## STEP 9: Test It!

1. Open http://localhost:3000/sign-in in your browser
2. You should see:
   - Email/password login form
   - **Google Sign-In button** at the top
3. Click the Google button
4. Google authentication popup should appear
5. Sign in with your Google account
6. If successful, you'll be redirected to `/dashboard`

---

## ✅ Success!

If you made it here, Google OAuth is working! 🎉

---

## 🐛 If It's Not Working

### "Google Sign-In button doesn't appear"
- Check browser console (F12)
- Look for error messages starting with `[v0]`
- Make sure `.env.local` has correct Client ID

### "Error when clicking button"
- Open browser console (F12)
- Look at the error message
- See `GOOGLE_OAUTH_TROUBLESHOOTING.md` for solutions

### "400 invalid_request error"
- Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is in `.env.local`
- Restart dev server
- Clear browser cache (Ctrl+Shift+Delete)
- Try again

---

## 📱 Testing with Different Accounts

Once set up, you can test with multiple Google accounts:
1. Logout from your Google account in another tab
2. Try signing in with a different Google account
3. Each account creates a new CyberForge Academy account

---

## 🚀 Next: Deploy to Vercel

When ready to go live:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add the same three variables:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
5. Go back to Google Cloud Console
6. Update your OAuth credential's authorized redirect URIs:
   - Add: `https://yourdomain.vercel.app`
   - Add: `https://yourdomain.vercel.app/api/auth/google/callback`
7. Push your code to GitHub
8. Vercel auto-deploys!

---

## 📞 Need Help?

- **Troubleshooting:** `GOOGLE_OAUTH_TROUBLESHOOTING.md`
- **Complete Setup:** `GOOGLE_OAUTH_COMPLETE_SETUP.md`
- **Technical Details:** `GOOGLE_OAUTH_IMPLEMENTATION.md`
