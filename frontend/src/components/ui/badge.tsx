import * as React from "react"

interface BadgeProps {
  className?: string
  children: React.ReactNode
}

export function Badge({ className = "", children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}
