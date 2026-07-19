import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface LevelCardProps {
  levelId: string
  levelNumber: number
  title: string
  description?: string
  difficulty: number
  estimatedHours?: string
  maxXP: number
  isUnlocked: boolean
  isCompleted?: boolean
  progress?: number
}

export default function LevelCard({
  levelId,
  levelNumber,
  title,
  description,
  difficulty,
  estimatedHours,
  maxXP,
  isUnlocked,
  isCompleted,
  progress = 0,
}: LevelCardProps) {
  const difficultyLabel = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][Math.min(difficulty, 4)]
  const difficultyColor = ['text-green-600', 'text-blue-600', 'text-purple-600', 'text-orange-600', 'text-red-600'][
    Math.min(difficulty, 4)
  ]

  return (
    <div className={`bg-card border rounded-lg p-6 transition ${isUnlocked ? 'border-border hover:border-primary' : 'border-muted opacity-50'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
              {levelNumber}
            </span>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
          </div>
          {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
        </div>
        {isCompleted && <span className="text-2xl">✓</span>}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs font-semibold ${difficultyColor}`}>{difficultyLabel}</span>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{maxXP} XP</span>
        {estimatedHours && <span className="text-xs text-muted-foreground">~{estimatedHours}h</span>}
      </div>

      {progress > 0 && (
        <div className="mb-4">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
        </div>
      )}

      <Link href={isUnlocked ? `/learn/${levelId}` : '#'}>
        <Button disabled={!isUnlocked} variant={isUnlocked ? 'default' : 'outline'} className="w-full">
          {isCompleted ? 'Review' : isUnlocked ? 'Continue' : 'Locked'}
        </Button>
      </Link>
    </div>
  )
}
