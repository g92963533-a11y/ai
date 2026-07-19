interface ProgressCardProps {
  title: string
  value: string | number
  unit?: string
  icon?: string
  color?: 'primary' | 'accent' | 'secondary'
}

export default function ProgressCard({ title, value, unit, icon, color = 'primary' }: ProgressCardProps) {
  const bgColor = color === 'primary' ? 'bg-primary/10' : color === 'accent' ? 'bg-accent/10' : 'bg-secondary/10'
  const textColor = color === 'primary' ? 'text-primary' : color === 'accent' ? 'text-accent' : 'text-secondary'

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>
            {value}
            {unit && <span className="text-lg ml-1">{unit}</span>}
          </p>
        </div>
        {icon && <div className="text-4xl">{icon}</div>}
      </div>
    </div>
  )
}
