'use client'

interface StepConfirmationProps {
  jobTitle: string
  onReset: () => void
}

export default function StepConfirmation({ jobTitle, onReset }: StepConfirmationProps) {
  return (
    <div
      style={{
        paddingTop: '80px',
        paddingBottom: '80px',
        textAlign: 'center',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      {/* Gold tick mark */}
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '1px solid #C49A3C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 10L8.5 14.5L16 6"
            stroke="#C49A3C"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      </div>

      <h2
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '32px',
          fontWeight: 300,
          color: '#F0EDE6',
          marginBottom: '16px',
        }}
      >
        Your report is on its way
      </h2>

      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          lineHeight: 1.7,
          color: '#9A9590',
          marginBottom: '48px',
        }}
      >
        We have sent your full automation assessment for{' '}
        <span style={{ color: '#F0EDE6' }}>{jobTitle}</span> to your inbox.
        Check your email — including your spam folder if it does not arrive within
        a few minutes.
      </p>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: '#2A2A2A',
          marginBottom: '48px',
        }}
      />

      {/* CTA block */}
      <div
        style={{
          backgroundColor: '#161616',
          border: '1px solid #2A2A2A',
          padding: '40px',
          textAlign: 'left',
          marginBottom: '40px',
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
          What comes next
        </p>
        <p
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '22px',
            fontWeight: 300,
            color: '#F0EDE6',
            lineHeight: 1.4,
            marginBottom: '16px',
          }}
        >
          Automation is only half the picture.
        </p>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            lineHeight: 1.7,
            color: '#9A9590',
            marginBottom: '28px',
          }}
        >
          The real challenge is implementing these changes in a way that is legally
          sound, considers your people, and sets your organisation up for the future.
          That is what Work/reWork does.
        </p>
        <a
          href="mailto:mark@foreseeable.world"
          className="btn-primary"
          style={{ display: 'inline-block' }}
        >
          Let&apos;s talk
        </a>
      </div>

      <button
        onClick={onReset}
        style={{
          background: 'none',
          border: 'none',
          color: '#9A9590',
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        Assess another role
      </button>
    </div>
  )
}
