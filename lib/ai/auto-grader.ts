'use server'

import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export interface GradingResult {
  passed: boolean
  score: number
  feedback: string
  suggestions: string[]
}

export async function gradeLabSubmission(
  labTitle: string,
  labDescription: string,
  testCases: Array<{ input: string; expectedOutput: string }>,
  userCode: string
): Promise<GradingResult> {
  try {
    const testCasesString = testCases
      .map((tc, i) => `Test ${i + 1}: Input="${tc.input}" Expected="${tc.expectedOutput}"`)
      .join('\n')

    const prompt = `You are a cybersecurity code grading AI. Grade this lab submission:

Lab: ${labTitle}
Description: ${labDescription}

Test Cases:
${testCasesString}

Student's Code:
\`\`\`
${userCode}
\`\`\`

Analyze the code and provide:
1. Does it pass the test cases? (yes/no)
2. Score out of 100
3. Brief feedback (1-2 sentences)
4. 2-3 suggestions for improvement

Format your response as JSON:
{
  "passed": boolean,
  "score": number,
  "feedback": "string",
  "suggestions": ["string", "string", "string"]
}`

    const result = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt,
      temperature: 0.7,
    })

    try {
      const parsed = JSON.parse(result.text)
      return {
        passed: parsed.passed,
        score: Math.min(100, Math.max(0, parsed.score)),
        feedback: parsed.feedback,
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
      }
    } catch {
      return {
        passed: false,
        score: 0,
        feedback: 'Error parsing grading response. Please try again.',
        suggestions: [],
      }
    }
  } catch (error) {
    console.error('[v0] Auto-grading error:', error)
    return {
      passed: false,
      score: 0,
      feedback: 'An error occurred during grading. Please try again later.',
      suggestions: [],
    }
  }
}
