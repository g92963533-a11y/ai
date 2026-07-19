'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { PRICING_TIERS } from '@/lib/pricing'

export default function PricingPage() {

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works for you. Upgrade anytime to unlock more features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {Object.entries(PRICING_TIERS).map(([key, tier]) => (
            <Card
              key={key}
              className={`p-8 flex flex-col ${
                key === 'PREMIUM'
                  ? 'ring-2 ring-primary md:scale-105 shadow-2xl'
                  : 'hover:shadow-lg transition'
              }`}
            >
              {/* Badge for popular */}
              {key === 'PREMIUM' && (
                <div className="mb-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier Name and Price */}
              <h2 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h2>
              <p className="text-muted-foreground mb-6 text-sm">{tier.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                {tier.price > 0 && <span className="text-muted-foreground ml-2">/month</span>}
                {tier.price === 0 && <span className="text-muted-foreground ml-2">Forever</span>}
              </div>

              {/* CTA Button */}
              <Button
                className="w-full mb-8"
                variant={key === 'PREMIUM' ? 'default' : 'outline'}
                onClick={() => {
                  if (tier.price === 0) {
                    // Free tier - just navigate
                    window.location.href = '/dashboard'
                  } else {
                    // Premium/Certification - would go to checkout
                    window.location.href = '/checkout?tier=' + tier.id
                  }
                }}
              >
                {tier.price === 0 ? 'Get Started' : 'Upgrade Now'}
              </Button>

              {/* Features List */}
              <div className="space-y-4">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Can I change my plan anytime?</h4>
              <p className="text-muted-foreground text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Is there a free trial for Premium?</h4>
              <p className="text-muted-foreground text-sm">
                Start with our Free tier and upgrade to Premium whenever you&apos;re ready. The first week of Premium is 50% off.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h4>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, Apple Pay, and Google Pay through Stripe.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Do you offer refunds?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, we offer a 30-day money-back guarantee on Premium plans. No questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Ready to level up your cybersecurity skills?</p>
          <Button
            size="lg"
            onClick={() => {
              window.location.href = '/sign-up'
            }}
          >
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  )
}
