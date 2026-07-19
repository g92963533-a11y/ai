# Google OAuth 2.0 - Final Setup & Getting Started

## 🚀 Quick Start (5 Minutes)

### 1. Copy Environment Template
```bash
cp .env.local.example .env.local
```

### 2. Get Your Google Credentials
- Go to https://console.cloud.google.com
- Create new project: "CyberForge Academy"
- Enable Google+ API
- Create OAuth 2.0 Web Application credentials
- Copy Client ID and Secret

### 3. Update `.env.local`
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_SECRET
```

### 4. Restart Dev Server
```bash
pnpm dev
```

### 5. Test
Go to http://localhost:3000/sign-in → Click Google button

---

## 📁 File Structure

```
cyberforge-academy/
├── components/
│   ├── google-signin-button.tsx        ← Google Login Component
│   └── auth-form.tsx                   ← Sign In/Up Form
├── app/
│   ├── api/auth/
│   │   └── google/
│   │       └── verify/
│   │           └── route.ts            ← Token Verification
│   ├── sign-in/
│   │   └── page.tsx                    ← Sign In Page
│   └── sign-up/
│       └── page.tsx                    ← Sign Up Page
├── lib/
│   ├── auth.ts                         ← Better Auth Config
│   └── auth-client.ts                  ← Frontend Auth Client
├── .env.local                          ← Environment Variables
├── .env.local.example                  ← Template
├── GOOGLE_OAUTH_TROUBLESHOOTING.md     ← Error Help
└── GOOGLE_OAUTH_COMPLETE_SETUP.md      ← Detailed Guide
```

---

## 🔐 Security Implementation

✅ **Backend Token Verification** - Server validates all tokens
✅ **Signature Validation** - Prevents token forgery
✅ **Secure Sessions** - Cryptographic session tokens
✅ **Environment Isolation** - Secrets never exposed to frontend
✅ **Error Handling** - No sensitive data leaked
✅ **HTTPS Ready** - Production-safe
✅ **CORS Protection** - Cross-origin validation
✅ **Session Expiry** - 7-day automatic logout

---

## 📝 What Happens When User Clicks "Sign In"

1. **User clicks Google button**
   - Browser opens Google authentication popup
   - User enters Google credentials

2. **Google issues ID Token**
   - JWT token created by Google
   - Sent to your frontend

3. **Frontend sends token to backend**
   - POST to `/api/auth/google/verify`
   - Includes the JWT token

4. **Backend verifies token**
   - Checks signature with Google's public key
   - Validates audience claim (Client ID)
   - Extracts user info (name, email, picture)

5. **User created/updated in database**
   - First-time users get new account
   - Existing users get signed in
   - Email auto-verified

6. **Session created**
   - Secure session token generated
   - Stored in database
   - Cookie set in browser

7. **User redirected to dashboard**
   - Full access to CyberForge Academy
   - All features unlocked based on tier

---

## 🔧 Configuration Checklist

### Local Development

- [ ] Created `.env.local` file
- [ ] Added `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Added `GOOGLE_CLIENT_ID`
- [ ] Added `GOOGLE_CLIENT_SECRET`
- [ ] Dev server restarted (`pnpm dev`)
- [ ] Tested at http://localhost:3000/sign-in

### Google Cloud Console

- [ ] Created OAuth 2.0 Web Application credentials
- [ ] Added Authorized Redirect URIs:
  - [ ] `http://localhost:3000`
  - [ ] `http://localhost:3000/api/auth/google/callback`
- [ ] Client ID copied correctly
- [ ] Client Secret copied correctly

### Vercel Deployment

- [ ] Added environment variables in Vercel dashboard
- [ ] Added production domain to Google's authorized URIs:
  - [ ] `https://yourdomain.vercel.app`
  - [ ] `https://yourdomain.vercel.app/api/auth/google/callback`
- [ ] Pushed to GitHub
- [ ] Verified deployment

---

## 🐛 Common Issues & Solutions

### Issue: "Google Sign-In is not configured"
- **Cause:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID` not in `.env.local`
- **Fix:** Add it and restart dev server

### Issue: "400 invalid_request"
- **Cause:** Client ID is invalid or missing
- **Fix:** 
  1. Copy exact Client ID from Google Console
  2. Check no extra spaces
  3. Restart dev server

### Issue: "Redirect URI mismatch"
- **Cause:** Callback URL not in Google's authorized list
- **Fix:** Add `http://localhost:3000` to authorized URIs in Google Console

### Issue: "Token verification failed"
- **Cause:** Client Secret is wrong
- **Fix:**
  1. Copy exact secret from Google Console
  2. Ensure no spaces or line breaks
  3. Check it matches `GOOGLE_CLIENT_SECRET` in `.env.local`

### Issue: Can't see Google button on sign-in page
- **Cause:** Component failed to initialize
- **Fix:**
  1. Open browser console (F12)
  2. Look for `[v0]` error messages
  3. Check all env variables

---

## 📚 Further Reading

- **Troubleshooting:** See `GOOGLE_OAUTH_TROUBLESHOOTING.md`
- **Complete Setup:** See `GOOGLE_OAUTH_COMPLETE_SETUP.md`
- **Technical Details:** See `GOOGLE_OAUTH_IMPLEMENTATION.md`
- **Quick Reference:** See `GOOGLE_OAUTH_QUICK_START.md`

---

## 🎯 What's Included

### Frontend
- Modern Google Identity Services library
- Responsive OAuth button
- Error handling
- Loading states

### Backend
- JWT token verification
- User creation/updates
- Secure session management
- Comprehensive error handling

### Database
- User accounts
- Session storage
- Profile information
- Login history

### Documentation
- Setup guides
- Troubleshooting
- Security explanation
- Deployment instructions

---

## ✅ You're Ready!

Your Google OAuth implementation is production-ready. Just add your credentials and you're done!

Questions? Check the troubleshooting guide or review the technical documentation.
