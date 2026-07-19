import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { db } from '@/lib/db'
import { user, account, session } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { randomBytes } from 'crypto'

const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_CALLBACK_URL || `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/google/callback`,
})

/**
 * POST /api/auth/google/verify
 * Verifies Google ID token and creates/updates user session
 * Body: { idToken: string }
 * Returns: { success: boolean, userId: string, sessionId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken } = body

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      )
    }

    // Verify the ID token with Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      )
    }

    const googleId = payload.sub
    const email = payload.email
    const name = payload.name
    const picture = payload.picture

    if (!email) {
      return NextResponse.json(
        { error: 'Email not provided by Google' },
        { status: 400 }
      )
    }

    // Check if user exists
    let existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1)

    let userId: string

    if (existingUser.length === 0) {
      // Create new user
      userId = `user_${randomBytes(16).toString('hex')}`
      await db.insert(user).values({
        id: userId,
        email,
        name: name || email.split('@')[0],
        emailVerified: true,
        image: picture,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Link Google account
      await db.insert(account).values({
        id: `account_${randomBytes(16).toString('hex')}`,
        accountId: googleId,
        providerId: 'google',
        userId,
        accessToken: null,
        refreshToken: null,
        idToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } else {
      userId = existingUser[0].id

      // Update picture if provided
      if (picture) {
        await db
          .update(user)
          .set({ image: picture, updatedAt: new Date() })
          .where(eq(user.id, userId))
      }

      // Check if Google account already linked
      const existingAccount = await db
        .select()
        .from(account)
        .where(eq(account.userId, userId))
        .where(eq(account.providerId, 'google'))
        .limit(1)

      if (existingAccount.length === 0) {
        await db.insert(account).values({
          id: `account_${randomBytes(16).toString('hex')}`,
          accountId: googleId,
          providerId: 'google',
          userId,
          accessToken: null,
          refreshToken: null,
          idToken,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      } else {
        // Update existing account
        await db
          .update(account)
          .set({ idToken, updatedAt: new Date() })
          .where(eq(account.id, existingAccount[0].id))
      }
    }

    // Create session
    const sessionId = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await db.insert(session).values({
      id: `session_${randomBytes(16).toString('hex')}`,
      token: sessionId,
      expiresAt,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Return success with session info
    return NextResponse.json({
      success: true,
      userId,
      sessionId,
      user: {
        id: userId,
        email,
        name,
        picture,
      },
    })
  } catch (error) {
    console.error('[v0] Google verification error:', error)

    if (error instanceof Error) {
      if (error.message.includes('invalid audience')) {
        return NextResponse.json(
          { error: 'Invalid token audience. Please check your Google Client ID.' },
          { status: 401 }
        )
      }
      if (error.message.includes('invalid signature')) {
        return NextResponse.json(
          { error: 'Invalid token signature' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    )
  }
}
