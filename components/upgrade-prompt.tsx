'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lock } from 'lucide-react'

interface UpgradePromptProps {
  feature: string
  tier: 'premium' | 'certification'
  description?: string
}

export function UpgradePrompt({ feature, tier, description }: UpgradePromptProps) {
  const tierInfo = {
    premium: {
      name: 'Premium',
      price: '$9.99/month',
      benefits: 'Access all 20 levels, unlimited AI mentor, and auto-grading.',
    },
    certification: {
      name: 'Professional Certification',
      price: '$29.99/month',
      benefits: 'Everything in Premium plus professional certificates and job board access.',
    },
  }

  const info = tierInfo[tier]

  return (
    <Card className="p-6 border-primary/30 bg-primary/5">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/20 p-3">
          <Lock className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">Unlock {feature}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {description || `This feature requires ${info.name} tier access.`}
          </p>

          <p className="text-sm text-foreground mb-4">
            <strong>{info.name}</strong> · {info.price}
          </p>
          <p className="text-xs text-muted-foreground mb-4">{info.benefits}</p>

          <div className="flex gap-3">
            <Button
              size="sm"
              onClick={() => {
                window.location.href = '/pricing'
              }}
            >
              Upgrade Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                window.location.href = '/pricing'
              }}
            >
              View All Plans
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
