'use client'

import { useState } from 'react'
import { submitLabCode } from '@/app/actions/labs'
import { Button } from '@/components/ui/button'
import type { interactiveLab } from '@/lib/db/schema'

interface LabEditorProps {
  lab: typeof interactiveLab.$inferSelect
  stats: {
    totalAttempts: number
    completed: boolean
    totalXPEarned: number
    bestScore: number
    totalTests: number
  }
}

export default function LabEditor({ lab, stats }: LabEditorProps) {
  const [code, setCode] = useState(lab.initialCode || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ testsPassed: number; totalTests: number; xpEarned: number; status: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setResult(null)

    try {
      const submitResult = await submitLabCode(lab.id, code)
      setResult(submitResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const hints = lab.hints ? JSON.parse(lab.hints) : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Problem Description */}
      <div className="lg:col-span-1">
        <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
          <h2 className="text-lg font-bold text-foreground mb-4">Problem</h2>
          <p className="text-sm text-foreground mb-6">{lab.description}</p>

          {hints.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">💡 Hints</h3>
              <div className="space-y-2">
                {hints.map((hint: string, idx: number) => (
                  <details key={idx} className="group">
                    <summary className="cursor-pointer text-sm text-primary hover:text-primary/80 font-medium">
                      Hint {idx + 1}
                    </summary>
                    <p className="text-xs text-muted-foreground mt-2 pl-2 border-l border-primary">{hint}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Test Cases:</span>
              <span className="ml-2 font-bold text-foreground">{stats.totalTests}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Best Score:</span>
              <span className="ml-2 font-bold text-foreground">{stats.bestScore}/{stats.totalTests}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">XP Earned:</span>
              <span className="ml-2 font-bold text-primary">{stats.totalXPEarned}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <label className="block text-sm font-medium text-foreground mb-2">Your Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 bg-secondary text-foreground font-mono text-sm p-4 rounded border border-border focus:outline-none focus:border-primary resize-none"
              placeholder="Write your code here..."
              spellCheck="false"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div
              className={`rounded-lg p-4 border ${
                result.status === 'completed'
                  ? 'bg-green-500/10 border-green-500/30 text-green-700'
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700'
              }`}
            >
              <div className="font-semibold mb-2">
                {result.status === 'completed' ? '✓ All Tests Passed!' : '⚠ Some Tests Failed'}
              </div>
              <div className="text-sm space-y-1">
                <div>
                  Tests Passed: <span className="font-bold">{result.testsPassed}/{result.totalTests}</span>
                </div>
                <div>
                  XP Earned: <span className="font-bold">{result.xpEarned}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit Code'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCode(lab.initialCode || '')}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
