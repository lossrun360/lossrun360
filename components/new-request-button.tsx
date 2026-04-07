'use client'
import { useState } from 'react'
import { NewRequestModal } from './new-request-modal'

export function NewRequestButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: '#6366f1', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.1px' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1V11M1 6H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        New Request
      </button>
      <NewRequestModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
