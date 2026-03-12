'use client'

import { useState, useRef, useCallback } from 'react'

interface StepInputProps {
  onSubmit: (jobTitle: string, text: string, file: File | null) => void
  isAdmin: boolean
  onAdminChange: (v: boolean) => void
}

export default function StepInput({ onSubmit, isAdmin, onAdminChange }: StepInputProps) {
  const [jobTitle, setJobTitle] = useState('')
  const [pastedText, setPastedText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState<{ jobTitle?: string; content?: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (ext !== 'pdf' && ext !== 'docx') {
      setErrors((e) => ({ ...e, content: 'Please upload a PDF or DOCX file.' }))
      return
    }
    setFile(f)
    setPastedText('')
    setErrors((e) => ({ ...e, content: undefined }))
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFileChange(dropped)
    },
    [handleFileChange]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { jobTitle?: string; content?: string } = {}

    if (!jobTitle.trim()) newErrors.jobTitle = 'Please enter a job title.'
    if (!file && !pastedText.trim())
      newErrors.content = 'Please upload a document or paste a job description.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(jobTitle.trim(), pastedText.trim(), file)
  }

  return (
    <div style={{ paddingTop: '64px', paddingBottom: '80px' }}>
      {/* Heading */}
      <div style={{ marginBottom: '48px' }}>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#C49A3C',
            marginBottom: '16px',
          }}
        >
          Free Assessment
        </p>
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '42px',
            fontWeight: 300,
            lineHeight: 1.15,
            color: '#F0EDE6',
            marginBottom: '20px',
          }}
        >
          How much of your role<br />could be automated?
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '17px',
            lineHeight: 1.6,
            color: '#9A9590',
            maxWidth: '560px',
          }}
        >
          Upload or paste a job description and we will assess which tasks could be
          automated — now and in the near future.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Job title */}
        <div style={{ marginBottom: '32px' }}>
          <label
            htmlFor="jobTitle"
            style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#9A9590',
              marginBottom: '10px',
            }}
          >
            Job Title
          </label>
          <input
            id="jobTitle"
            type="text"
            className="input-field"
            placeholder="e.g. Marketing Manager"
            value={jobTitle}
            onChange={(e) => {
              setJobTitle(e.target.value)
              if (errors.jobTitle) setErrors((er) => ({ ...er, jobTitle: undefined }))
            }}
          />
          {errors.jobTitle && (
            <p style={{ color: '#C0392B', fontSize: '13px', marginTop: '8px' }}>
              {errors.jobTitle}
            </p>
          )}
        </div>

        {/* Document upload */}
        <div style={{ marginBottom: '32px' }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#9A9590',
              marginBottom: '10px',
            }}
          >
            Job Description
          </label>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#C49A3C' : file ? '#C49A3C' : '#2A2A2A'}`,
              backgroundColor: dragOver ? 'rgba(196,154,60,0.04)' : '#161616',
              padding: '32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background-color 0.2s',
              marginBottom: '16px',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFileChange(f)
              }}
            />
            {file ? (
              <div>
                <p style={{ color: '#C49A3C', fontSize: '15px', fontWeight: 500 }}>
                  {file.name}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  style={{
                    marginTop: '8px',
                    color: '#9A9590',
                    fontSize: '13px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: '#9A9590', fontSize: '15px', marginBottom: '4px' }}>
                  Drag and drop a PDF or DOCX
                </p>
                <p style={{ color: '#2A2A2A', fontSize: '13px' }}>
                  or click to browse
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#2A2A2A' }} />
            <span style={{ color: '#9A9590', fontSize: '13px' }}>or paste text</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#2A2A2A' }} />
          </div>

          {/* Paste text */}
          <textarea
            className="input-field"
            placeholder="Paste the job description here..."
            rows={8}
            value={pastedText}
            disabled={!!file}
            onChange={(e) => {
              setPastedText(e.target.value)
              if (errors.content) setErrors((er) => ({ ...er, content: undefined }))
            }}
            style={{
              resize: 'vertical',
              opacity: file ? 0.4 : 1,
              cursor: file ? 'not-allowed' : 'text',
            }}
          />

          {errors.content && (
            <p style={{ color: '#C0392B', fontSize: '13px', marginTop: '8px' }}>
              {errors.content}
            </p>
          )}
        </div>

        {/* Disclaimer */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            lineHeight: 1.6,
            color: '#9A9590',
            marginBottom: '32px',
            borderLeft: '2px solid #2A2A2A',
            paddingLeft: '16px',
          }}
        >
          This document will only be used for assessment purposes within this session.
          It will not be stored after your session ends. A summary will be shared with
          the Work/reWork team for sales and service purposes.
        </p>

        {/* Submit */}
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>
          Assess This Role
        </button>

        {/* Admin toggle — subtle, not visible in normal use */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: '#2A2A2A',
              fontSize: '12px',
            }}
          >
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => onAdminChange(e.target.checked)}
              style={{ accentColor: '#C49A3C' }}
            />
            Admin mode
          </label>
        </div>
      </form>
    </div>
  )
}
