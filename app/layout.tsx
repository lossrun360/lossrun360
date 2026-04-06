import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'LossRun360 — Commercial Trucking Insurance',
    template: '%s | LossRun360',
  },
  description:
    'The fastest way to submit loss run requests for commercial trucking insurance. Auto-populate carrier data from FMCSA, generate professional PDFs, and send to carriers in minutes.',
  keywords: ['loss run', 'trucking insurance', 'FMCSA', 'commercial auto', 'insurance requests'],
  openGraph: {
    title: 'LossRun360',
    description: 'Streamlined loss run requests for trucking insurance agencies.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161b22',
              color: '#e6edf3',
              border: '1px solid #21262d',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#161b22' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#161b22' },
            },
          }}
        />
      </body>
    </html>
  )
}
