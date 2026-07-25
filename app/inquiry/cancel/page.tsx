'use client'

import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function InquiryCancelPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <XCircle size={48} style={{ margin: '0 auto 1.5rem', color: '#f59e0b' }} />
        <h1 style={{ fontSize: '1.875rem', fontWeight: 500, marginBottom: '1rem', color: '#111827' }}>
          Payment Cancelled
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: '1.75' }}>
          Your payment was cancelled. No charges were made to your account. 
          If you'd like to complete your consultation booking, you can return to the inquiry form.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/#inquiry"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#EF4444',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
          >
            Return to Inquiry
          </Link>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#374151',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: '1px solid #d1d5db',
              transition: 'border-color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

