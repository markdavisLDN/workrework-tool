import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit, recordSubmission } from '@/lib/rateLimit'
import {
  buildUserReportEmail,
  buildInternalNotificationEmail,
  buildRateLimitAlertEmail,
} from '@/lib/emailTemplates'
import type { AssessmentResult } from '@/types/assessment'

export const runtime = 'nodejs'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM = () => process.env.RESEND_FROM_EMAIL || 'hello@workrework.com'
const NOTIFY_1 = () => process.env.INTERNAL_NOTIFY_EMAIL_1 || 'mark@foreseeable.world'
const NOTIFY_2 = () => process.env.INTERNAL_NOTIFY_EMAIL_2 || 'mark@briefobsession.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, company, email, jobTitle, result, admin } = body as {
      name: string
      company: string
      email: string
      jobTitle: string
      result: AssessmentResult
      admin?: boolean
    }

    if (!name?.trim() || !company?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name, company, and email are required.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Rate limiting (bypassed for admin)
    if (!admin) {
      const { allowed } = checkRateLimit(email)

      if (!allowed) {
        // Send alert to both co-founders
        await sendRateLimitAlerts(name, company, email, jobTitle)

        return NextResponse.json(
          {
            error:
              'It looks like we have already sent you a report recently. If you have not received it, check your spam folder — or email us directly at mark@workrework.com and we will be happy to help.',
          },
          { status: 429 }
        )
      }
    }

    const resend = getResend()

    // Send user report email
    const { error: userEmailError } = await resend.emails.send({
      from: FROM(),
      to: email,
      subject: `Your automation assessment — ${jobTitle}`,
      html: buildUserReportEmail(name, jobTitle, result),
    })
    if (userEmailError) throw new Error(`Failed to send report: ${JSON.stringify(userEmailError)}`)

    // Record submission before sending internal notification (non-admin only)
    if (!admin) {
      recordSubmission(email)
    }

    // Send internal notification (not for admin submissions) — errors here don't affect the user
    if (!admin) {
      try {
        await sendInternalNotification(name, company, email, jobTitle, result)
      } catch (err) {
        console.error('[internal-notify error]', err)
        console.error('[internal-notify] NOTIFY_1:', NOTIFY_1(), 'NOTIFY_2:', NOTIFY_2(), 'FROM:', FROM())
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('send-report error:', err)
    return NextResponse.json(
      {
        error:
          'We were not able to send your report right now. Sorry about that — please email mark@workrework.com and we will send it manually.',
      },
      { status: 500 }
    )
  }
}

async function sendInternalNotification(
  name: string,
  company: string,
  email: string,
  jobTitle: string,
  result: AssessmentResult
) {
  const html = buildInternalNotificationEmail(name, company, email, jobTitle, result)
  const { error } = await getResend().emails.send({
    from: FROM(),
    to: [NOTIFY_1(), NOTIFY_2()],
    subject: `New assessment: ${jobTitle} — ${company}`,
    html,
  })
  if (error) throw new Error(`Internal notify failed: ${JSON.stringify(error)}`)
}

async function sendRateLimitAlerts(
  name: string,
  company: string,
  email: string,
  jobTitle: string
) {
  const html = buildRateLimitAlertEmail(name, company, email, jobTitle)
  const { error } = await getResend().emails.send({
    from: FROM(),
    to: [NOTIFY_1(), NOTIFY_2()],
    subject: `Repeat submission flagged — ${email}`,
    html,
  })
  if (error) throw new Error(`Rate limit alert failed: ${JSON.stringify(error)}`)
}
