'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  dark?: boolean
}

export function Logo({ size = 'md', href = '/', className, dark = true }: LogoProps) {
  const sizes = {
    sm: { fontSize: '15px' },
    md: { fontSize: '18px' },
    lg: { fontSize: '22px' },
  }

  const style = {
    fontWeight: 900,
    letterSpacing: '-0.5px',
    color: dark ? '#ffffff' : '#0f172a',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: sizes[size].fontSize,
    textDecoration: 'none',
  }

  const text = (
    <span style={style}>
      LossRun<span style={{ color: '#1c6edd' }}>360</span>
    </span>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={cn('flex items-center hover:opacity-90 transition-opacity', className)}
        style={{ textDecoration: 'none' }}
      >
        {text}
      </Link>
    )
  }

  return (
    <div className={cn('flex items-center', className)}>
      {text}
    </div>
  )
}
