'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
}

export function Logo({ size = 'md', href = '/', className }: LogoProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const content = (
    <span className={cn('font-black tracking-tight text-white', sizes[size], className)}>
      LossRun<span className="text-primary">360</span>
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {content}
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {content}
    </div>
  )
}
