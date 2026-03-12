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
    await resend.emails.send({
      from: FROM(),
      to: email,
      subject: `Your automation assessment — ${jobTitle}`,
      html: buildUserReportEmail(name, jobTitle, result),
    })

    // Record submission before sending internal notification (non-admin only)
    if (!admin) {
      recordSubmission(email)
    }

    // Send internal notification (not for admin submissions)
    if (!admin) {
      await sendInternalNotification(name, company, email, jobTitle, result)
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
  await getResend().emails.send({
    from: FROM(),
    to: [NOTIFY_1(), NOTIFY_2()],
    subject: `New assessment: ${jobTitle} — ${company}`,
    html,
  })
}

async function sendRateLimitAlerts(
  name: string,
  company: string,
  email: string,
  jobTitle: string
) {
  const html = buildRateLimitAlertEmail(name, company, email, jobTitle)
  await getResend().emails.send({
    from: FROM(),
    to: [NOTIFY_1(), NOTIFY_2()],
    subject: `Repeat submission flagged — ${email}`,
    html,
  })
}
