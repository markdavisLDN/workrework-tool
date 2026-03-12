'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import StepInput from './steps/StepInput'
import StepLoading from './steps/StepLoading'
import StepPreview from './steps/StepPreview'
import StepConfirmation from './steps/StepConfirmation'
import type { AssessmentResult } from '@/types/assessment'

export type Step = 'input' | 'loading' | 'preview' | 'confirmation'

export default function AssessmentTool() {
  const [step, setStep] = useState<Step>('input')
  const [jobTitle, setJobTitle] = useState('')
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const loadingStartRef = useRef<number>(0)

  const handleSubmitInput = useCallback(
    async (title: string, content: string, file: File | null) => {
      setJobTitle(title)
      setStep('loading')
      loadingStartRef.current = Date.now()

      try {
        const formData = new FormData()
        formData.append('jobTitle', title)
        if (file) {
          formData.append('file', file)
        } else {
          formData.append('text', content)
        }
        if (isAdmin) {
          formData.append('admin', 'true')
        }

        const response = await fetch('/api/assess', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          const elapsed = Date.now() - loadingStartRef.current
          const remaining = Math.max(0, 5000 - elapsed)
          await delay(remaining)
          throw new Error(data.error || 'Assessment failed')
        }

        // Ensure minimum 5 seconds loading
        const elapsed = Date.now() - loadingStartRef.current
        const remaining = Math.max(0, 5000 - elapsed)
        await delay(remaining)

        setResult(data.result)
        setStep('preview')
      } catch (err) {
        const elapsed = Date.now() - loadingStartRef.current
        const remaining = Math.max(0, 5000 - elapsed)
        await delay(remaining)
        setStep('input')
        const message =
          err instanceof Error ? err.message : 'Something went wrong'
        alert(message)
      }
    },
    [isAdmin]
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
          admin: isAdmin,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send report')
      }

      setStep('confirmation')
    },
    [result, jobTitle, isAdmin]
  )

  const handleReset = useCallback(() => {
    setStep('input')
    setJobTitle('')
    setResult(null)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid #2A2A2A',
          padding: '24px 24px',
        }}
      >
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

      {/* Main content */}
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
        {step === 'input' && (
          <StepInput
            onSubmit={handleSubmitInput}
            isAdmin={isAdmin}
            onAdminChange={setIsAdmin}
          />
        )}
        {step === 'loading' && <StepLoading />}
        {step === 'preview' && result && (
          <StepPreview
            result={result}
            onSubmitEmail={handleSubmitEmail}
          />
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
