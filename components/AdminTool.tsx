'use client'

import AssessmentTool from './AssessmentTool'
import { useEffect } from 'react'

export default function AdminTool() {
  useEffect(() => {
    // Visual indicator that admin mode is active
    document.title = '[ADMIN] Work/reWork Assessment'
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      {/* Admin banner */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: '#C49A3C',
          padding: '6px 16px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#0D0D0D',
        }}
      >
        Admin mode — rate limiting bypassed — internal notifications suppressed
      </div>
      <div style={{ paddingTop: '28px' }}>
        <AssessmentToolWithAdmin />
      </div>
    </div>
  )
}

function AssessmentToolWithAdmin() {
  // Render the full tool but pre-set admin=true
  // We do this by rendering AssessmentTool and letting it handle admin via its own state
  // The admin banner makes it clear we're in admin mode
  return <AssessmentToolAdmin />
}

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import StepInput from './steps/StepInput'
import StepLoading from './steps/StepLoading'
import StepPreview from './steps/StepPreview'
import StepConfirmation from './steps/StepConfirmation'
import type { AssessmentResult } from '@/types/assessment'

function AssessmentToolAdmin() {
  const [step, setStep] = useState<'input' | 'loading' | 'preview' | 'confirmation'>('input')
  const [jobTitle, setJobTitle] = useState('')
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const loadingStartRef = useRef<number>(0)

  const handleSubmitInput = useCallback(
    async (title: string, content: string, file: File | null) => {
      setJobTitle(title)
      setStep('loading')
      loadingStartRef.current = Date.now()

      try {
        const formData = new FormData()
        formData.append('jobTitle', title)
        formData.append('admin', 'true')
        if (file) {
          formData.append('file', file)
        } else {
          formData.append('text', content)
        }

        const response = await fetch('/api/assess', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          const elapsed = Date.now() - loadingStartRef.current
          await delay(Math.max(0, 5000 - elapsed))
          throw new Error(data.error || 'Assessment failed')
        }

        const elapsed = Date.now() - loadingStartRef.current
        await delay(Math.max(0, 5000 - elapsed))

        setResult(data.result)
        setStep('preview')
      } catch (err) {
        const elapsed = Date.now() - loadingStartRef.current
        await delay(Math.max(0, 5000 - elapsed))
        setStep('input')
        alert(err instanceof Error ? err.message : 'Something went wrong')
      }
    },
    []
  )

  const handleSubmitEmail = useCallback(
    async (name: string, company: string, email: string) => {
      if (!result) return

      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          email,
          jobTitle,
          result,
          admin: true,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send report')
      }

      setStep('confirmation')
    },
    [result, jobTitle]
  )

  const handleReset = useCallback(() => {
    setStep('input')
    setJobTitle('')
    setResult(null)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
      <header style={{ borderBottom: '1px solid #2A2A2A', padding: '24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Image
            src="/workrework-logo.png"
            alt="Work/reWork"
            width={220}
            height={44}
            priority
            style={{ height: '40px', width: 'auto' }}
          />
        </div>
      </header>
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
        {step === 'input' && (
          <StepInput onSubmit={handleSubmitInput} isAdmin={true} onAdminChange={() => {}} />
        )}
        {step === 'loading' && <StepLoading />}
        {step === 'preview' && result && (
          <StepPreview result={result} onSubmitEmail={handleSubmitEmail} />
        )}
        {step === 'confirmation' && (
          <StepConfirmation jobTitle={jobTitle} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
