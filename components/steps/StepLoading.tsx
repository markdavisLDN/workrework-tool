'use client'

import { useState, useEffect } from 'react'

const STATUS_MESSAGES = [
  'Analysing role responsibilities...',
  'Identifying automation opportunities...',
  'Benchmarking against similar roles...',
  'Preparing your results...',
]

export default function StepLoading() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setMessageIndex((i) => (i + 1) % STATUS_MESSAGES.length)
        setVisible(true)
      }, 300)
    }, 1800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0D0D0D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* Animated diagonal slash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <AnimatedSlash />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
        {/* Gold slash mark */}
        <div
          style={{
            width: '2px',
            height: '64px',
            backgroundColor: '#C49A3C',
            margin: '0 auto 40px',
            transform: 'rotate(20deg)',
          }}
        />

        <p
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '13px',
            fontWeight: 300,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#9A9590',
            marginBottom: '16px',
          }}
        >
          Work/reWork
        </p>

        <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: '#F0EDE6',
              transition: 'opacity 0.3s ease',
              opacity: visible ? 1 : 0,
            }}
          >
            {STATUS_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress dots */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '32px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <PulseDot key={i} delay={i * 0.3} />
          ))}
        </div>
      </div>
    </div>
  )
}

function AnimatedSlash() {
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.06,
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <style>{`
          @keyframes slashMove {
            0% { transform: translateX(-150%); }
            100% { transform: translateX(250%); }
          }
          .slash-line {
            animation: slashMove 3s ease-in-out infinite;
          }
        `}</style>
      </defs>
      <g className="slash-line">
        <line
          x1="40"
          y1="0"
          x2="60"
          y2="100"
          stroke="#C49A3C"
          strokeWidth="8"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: '60px' }}
        />
      </g>
    </svg>
  )
}

function PulseDot({ delay }: { delay: number }) {
  return (
    <div
      style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: '#C49A3C',
        animation: `pulse 1.4s ease-in-out ${delay}s infinite`,
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
