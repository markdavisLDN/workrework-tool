'use client'

import { useState } from 'react'
import type { AssessmentResult } from '@/types/assessment'

interface StepPreviewProps {
  result: AssessmentResult
  onSubmitEmail: (name: string, company: string, email: string) => Promise<void>
}

export default function StepPreview({ result, onSubmitEmail }: StepPreviewProps) {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; company?: string; email?: string; submit?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}

    if (!name.trim()) newErrors.name = 'Please enter your name.'
    if (!company.trim()) newErrors.company = 'Please enter your company.'
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      await onSubmitEmail(name.trim(), company.trim(), email.trim())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setErrors({ submit: message })
      setSubmitting(false)
    }
  }

  return (
    <div style={{ paddingTop: '64px', paddingBottom: '80px' }}>
      {/* Summary stats */}
      <div style={{ marginBottom: '48px' }}>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#C49A3C',
            marginBottom: '12px',
          }}
        >
          Assessment Complete
        </p>
        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '32px',
            fontWeight: 300,
            color: '#F0EDE6',
            marginBottom: '8px',
          }}
        >
          {result.job_title}
        </h2>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            color: '#9A9590',
            marginBottom: '40px',
          }}
        >
          {result.summary_headline}
        </p>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
          <StatCard
            value={result.total_automatable_tasks}
            label="Automatable tasks identified"
          />
          <StatCard
            value={`${result.estimated_time_saving_percentage}%`}
            label="Estimated time saving potential"
          />
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#2A2A2A', marginBottom: '40px' }} />
      </div>

      {/* Blurred preview */}
      <div style={{ marginBottom: '48px', position: 'relative' }}>
        <h3
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#9A9590',
            marginBottom: '16px',
          }}
        >
          What could be automated
        </h3>

        {/* Blurred task list */}
        <div style={{ position: 'relative' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="blurred"
              style={{
                backgroundColor: '#161616',
                border: '1px solid #2A2A2A',
                padding: '20px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  height: '14px',
                  backgroundColor: '#2A2A2A',
                  borderRadius: '2px',
                  marginBottom: '8px',
                  width: `${60 + i * 10}%`,
                }}
              />
              <div
                style={{
                  height: '12px',
                  backgroundColor: '#2A2A2A',
                  borderRadius: '2px',
                  width: '90%',
                }}
              />
            </div>
          ))}

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(to bottom, transparent, #0D0D0D)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Gate form */}
      <div
        style={{
          backgroundColor: '#161616',
          border: '1px solid #2A2A2A',
          padding: '40px',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#C49A3C',
            marginBottom: '12px',
          }}
        >
          Get your full report
        </p>
        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '28px',
            fontWeight: 300,
            color: '#F0EDE6',
            marginBottom: '8px',
          }}
        >
          See everything we found
        </h2>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            color: '#9A9590',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}
        >
          Your full automation report — with every task, time saving estimate, and
          forward-looking opportunities — will be sent to your inbox.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((er) => ({ ...er, name: undefined }))
                }}
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            <div>
              <label style={labelStyle}>Company</label>
              <input
                type="text"
                className="input-field"
                placeholder="Your company"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value)
                  if (errors.company) setErrors((er) => ({ ...er, company: undefined }))
                }}
              />
              {errors.company && <p style={errorStyle}>{errors.company}</p>}
            </div>

            <div>
              <label style={labelStyle}>Work Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((er) => ({ ...er, email: undefined }))
                }}
              />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>
          </div>

          {errors.submit && (
            <div
              style={{
                backgroundColor: 'rgba(192,57,43,0.1)',
                border: '1px solid #C0392B',
                padding: '12px 16px',
                marginBottom: '16px',
              }}
            >
              <p style={{ color: '#C0392B', fontSize: '14px' }}>{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '16px' }}
          >
            {submitting ? 'Sending...' : 'Send My Report'}
          </button>
        </form>
      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div
      style={{
        backgroundColor: '#161616',
        border: '1px solid #2A2A2A',
        padding: '24px',
      }}
    >
      <p
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '40px',
          fontWeight: 300,
          color: '#C49A3C',
          lineHeight: 1,
          marginBottom: '8px',
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: '#9A9590',
          lineHeight: 1.4,
        }}
      >
        {label}
      </p>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#9A9590',
  marginBottom: '8px',
}

const errorStyle: React.CSSProperties = {
  color: '#C0392B',
  fontSize: '13px',
  marginTop: '6px',
}
