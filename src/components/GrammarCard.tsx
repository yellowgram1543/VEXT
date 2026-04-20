import React from 'react'

interface GrammarCardProps {
  children: React.ReactNode
  className?: string
}

/**
 * A wrapper component that renders children inside a premium-style card.
 * Minimalist Bunpo-style: white bg, rounded-3xl, subtle border/shadow.
 */
export default function GrammarCard({ children, className = "" }: GrammarCardProps) {
  return (
    <section className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6 ${className}`}>
      {children}
    </section>
  )
}
