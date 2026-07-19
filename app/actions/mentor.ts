'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mentorSession, mentorMessage } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createMentorSession(topicId: string, question: string) {
  const userId = await getUserId()

  const sessionId = `mentor_${userId}_${topicId}_${Date.now()}`
  await db.insert(mentorSession).values({
    id: sessionId,
    userId,
    topicId,
    question,
    status: 'active',
  })

  return sessionId
}

export async function getMentorSessionMessages(sessionId: string) {
  const userId = await getUserId()

  // Verify ownership
  const session = await db
    .select()
    .from(mentorSession)
    .where(and(eq(mentorSession.id, sessionId), eq(mentorSession.userId, userId)))
    .limit(1)

  if (!session.length) {
    throw new Error('Session not found')
  }

  const messages = await db
    .select()
    .from(mentorMessage)
    .where(eq(mentorMessage.sessionId, sessionId))

  return messages
}

export async function sendMentorMessage(sessionId: string, userMessage: string) {
  const userId = await getUserId()

  // Verify session ownership
  const session = await db
    .select()
    .from(mentorSession)
    .where(and(eq(mentorSession.id, sessionId), eq(mentorSession.userId, userId)))
    .limit(1)

  if (!session.length) {
    throw new Error('Session not found')
  }

  // Save user message
  const userMessageId = `msg_user_${sessionId}_${Date.now()}`
  await db.insert(mentorMessage).values({
    id: userMessageId,
    sessionId,
    role: 'user',
    content: userMessage,
  })

  // Get conversation history
  const history = await db.select().from(mentorMessage).where(eq(mentorMessage.sessionId, sessionId))

  // Build conversation context
  const conversationMessages = history.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  // Generate AI response
  try {
    const response = await generateObject({
      model: anthropic('claude-3-5-sonnet-20241022'),
      schema: z.object({
        response: z.string().describe('The mentor response to the user question'),
      }),
      messages: [
        {
          role: 'user',
          content: `You are an expert cybersecurity mentor at CyberForge Academy. Help the student with their cybersecurity learning. 
          
Topic: ${session[0].topicId}
Student's question: ${userMessage}

Provide helpful guidance, explanations, and hints. Be encouraging and educational.`,
        },
        ...conversationMessages.slice(0, -1), // Exclude the current message we just added
      ],
      system: `You are a knowledgeable cybersecurity mentor. Your role is to:
- Explain cybersecurity concepts clearly
- Provide hints and guidance without giving away complete solutions
- Encourage learning and problem-solving
- Ask clarifying questions when needed
- Be supportive and motivating

Keep responses concise and focused on helping the student learn.`,
    })

    // Save AI response
    const assistantMessageId = `msg_assistant_${sessionId}_${Date.now()}`
    await db.insert(mentorMessage).values({
      id: assistantMessageId,
      sessionId,
      role: 'assistant',
      content: response.object.response,
    })

    return {
      success: true,
      message: response.object.response,
    }
  } catch (error) {
    console.error('[v0] Error generating mentor response:', error)
    throw new Error('Failed to generate mentor response')
  }
}

export async function closeMentorSession(sessionId: string) {
  const userId = await getUserId()

  await db
    .update(mentorSession)
    .set({
      status: 'closed',
      endedAt: new Date(),
    })
    .where(and(eq(mentorSession.id, sessionId), eq(mentorSession.userId, userId)))
}
