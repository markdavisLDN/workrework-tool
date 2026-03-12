import type { AssessmentResult } from '@/types/assessment'

const LOGO_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/workrework-logo.png`
  : 'https://assess.workrework.com/workrework-logo.png'

export function buildUserReportEmail(
  name: string,
  jobTitle: string,
  result: AssessmentResult
): string {
  const currentItems = result.current_automation_opportunities
    .map(
      (item) => `
      <tr>
        <td style="padding: 20px 0; border-bottom: 1px solid #2A2A2A;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin: 0 0 4px; font-family: Inter, Helvetica, sans-serif; font-size: 16px; font-weight: 600; color: #F0EDE6;">${escHtml(item.task)}</p>
                <p style="margin: 0 0 10px; font-family: Inter, Helvetica, sans-serif; font-size: 14px; color: #9A9590; line-height: 1.6;">${escHtml(item.description)}</p>
              </td>
              <td width="80" style="text-align: right; vertical-align: top; padding-left: 16px;">
                <p style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 300; color: #C49A3C;">${item.estimated_time_saving_percentage}%</p>
                <p style="margin: 0; font-family: Inter, Helvetica, sans-serif; font-size: 11px; color: #9A9590; text-transform: uppercase; letter-spacing: 0.06em;">saving</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join('')

  const emergingItems = result.emerging_automation_opportunities
    .map(
      (item) => `
      <tr>
        <td style="padding: 20px 0; border-bottom: 1px solid #2A2A2A;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin: 0 0 2px; font-family: Inter, Helvetica, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #C49A3C;">Forward-looking</p>
                <p style="margin: 0 0 4px; font-family: Inter, Helvetica, sans-serif; font-size: 16px; font-weight: 600; color: #F0EDE6;">${escHtml(item.task)}</p>
                <p style="margin: 0 0 8px; font-family: Inter, Helvetica, sans-serif; font-size: 14px; color: #9A9590; line-height: 1.6;">${escHtml(item.description)}</p>
                <p style="margin: 0; font-family: Inter, Helvetica, sans-serif; font-size: 13px; color: #9A9590; font-style: italic;">${escHtml(item.note || '')}</p>
              </td>
              <td width="80" style="text-align: right; vertical-align: top; padding-left: 16px;">
                <p style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 300; color: #C49A3C;">${item.estimated_time_saving_percentage}%</p>
                <p style="margin: 0; font-family: Inter, Helvetica, sans-serif; font-size: 11px; color: #9A9590; text-transform: uppercase; letter-spacing: 0.06em;">potential</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your automation assessment — ${escHtml(jobTitle)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0D0D0D; font-family: Inter, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0D0D0D;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background-color: #0D0D0D; padding: 40px 40px 32px; border-bottom: 1px solid #2A2A2A;">
              <img src="${LOGO_URL}" alt="Work/reWork" width="180" style="height: auto; display: block;" />
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="background-color: #161616; padding: 40px; border-bottom: 1px solid #2A2A2A;">
              <p style="margin: 0 0 8px; font-family: Inter, Helvetica, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #C49A3C;">Automation Assessment</p>
              <h1 style="margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 300; color: #F0EDE6; line-height: 1.3;">Here is what we found for ${escHtml(jobTitle)}</h1>
              <p style="margin: 0; font-family: Inter, Helvetica, sans-serif; font-size: 15px; color: #9A9590; line-height: 1.6;">Hi ${escHtml(name)}, here is your full automation report.</p>
            </td>
          </tr>

          <!-- Summary stats -->
          <tr>
            <td style="background-color: #0D0D0D; padding: 40px; border-bottom: 1px solid #2A2A2A;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right: 12px;">
                    <div style="background-color: #161616; border: 1px solid #2A2A2A; padding: 24px;">
                      <p style="margin: 0 0 4px; font-family: 'Playfair Display', Georgia, serif; font-size: 40px; font-weight: 300; color: #C49A3C; line-height: 1;">${result.total_automatable_tasks}</p>
                      <p style="margin: 0; font-family: Inter, Helvetica, sans-serif; font-size: 13px; color: #9A9590; line-height: 1.4;">Automatable tasks identified</p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 12px;">
                    <div style="background-color: #161616; border: 1px solid #2A2A2A; padding: 24px;">
                      <p style="margin: 0 0 4px; font-family: 'Playfair Display', Georgia, serif; font-size: 40px; font-weight: 300; color: #C49A3C; line-height: 1;">${result.estimated_time_saving_percentage}%</p>
                      <p style="margin: 0; font-family: Inter, Helvetica, sans-serif; font-size: 13px; color: #9A9590; line-height: 1.4;">Estimated time saving potential</p>
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-family: Inter, Helvetica, sans-serif; font-size: 15px; color: #9A9590; line-height: 1.6; font-style: italic;">${escHtml(result.summary_headline)}</p>
            </td>
          </tr>

          <!-- Current opportunities -->
          <tr>
            <td style="background-color: #161616; padding: 40px; border-bottom: 1px solid #2A2A2A;">
              <p style="margin: 0 0 4px; font-family: Inter, Helvetica, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #C49A3C;">What could be automated now</p>
              <p style="margin: 0 0 24px; font-family: Inter, Helvetica, sans-serif; font-size: 13px; color: #9A9590;">Using tools and AI capabilities available today</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${currentItems}
              </table>
            </td>
          </tr>

          <!-- Emerging opportunities -->
          <tr>
            <td style="background-color: #161616; padding: 40px; border-bottom: 1px solid #2A2A2A;">
              <p style="margin: 0 0 4px; font-family: Inter, Helvetica, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #9A9590;">What is coming</p>
              <p style="margin: 0 0 24px; font-family: Inter, Helvetica, sans-serif; font-size: 13px; color: #9A9590;">Forward-looking opportunities — not yet mainstream, but on the horizon</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${emergingItems}
              </table>
            </td>
          </tr>

          <!-- Role context note -->
          <tr>
            <td style="background-color: #0D0D0D; padding: 40px; border-bottom: 1px solid #2A2A2A;">
              <p style="margin: 0 0 12px; font-family: Inter, Helvetica, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #9A9590;">The bigger picture</p>
              <p style="margin: 0; font-family: Inter, Helvetica, sans-serif; font-size: 15px; color: #9A9590; line-height: 1.7;">${escHtml(result.role_context_note)}</p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background-color: #161616; padding: 40px; border-bottom: 1px solid #2A2A2A;">
              <p style="margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 300; color: #F0EDE6; line-height: 1.4;">Automation is only half the picture.</p>
              <p style="margin: 0 0 28px; font-family: Inter, Helvetica, sans-serif; font-size: 15px; color: #9A9590; line-height: 1.7;">The real challenge is implementing these changes in a way that is legally sound, considers your people, and sets your organisation up for the future. That is what Work/reWork does.</p>
              <a href="mailto:mark@foreseeable.world" style="display: inline-block; background-color: #C49A3C; color: #0D0D0D; font-family: Inter, Helvetica, sans-serif; font-size: 15px; font-weight: 600; letter-spacing: 0.04em; padding: 14px 32px; text-decoration: none;">Book a conversation</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0D0D0D; padding: 32px 40px; text-align: center;">
              <p style="margin: 0; font-family: Inter, Helvetica, sans-serif; font-size: 12px; color: #9A9590; line-height: 1.6;">Work/reWork &mdash; Human-first workforce redesign for the AI era</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildInternalNotificationEmail(
  name: string,
  company: string,
  email: string,
  jobTitle: string,
  result: AssessmentResult,
  originalDescription?: string
): string {
  const currentItems = result.current_automation_opportunities
    .map(
      (item) =>
        `<li style="margin-bottom: 12px;"><strong>${escHtml(item.task)}</strong> — ${escHtml(item.description)} (${item.estimated_time_saving_percentage}% saving, ${item.confidence} confidence)</li>`
    )
    .join('')

  const emergingItems = result.emerging_automation_opportunities
    .map(
      (item) =>
        `<li style="margin-bottom: 12px;"><strong>${escHtml(item.task)}</strong> — ${escHtml(item.description)} (${item.estimated_time_saving_percentage}% potential) — <em>${escHtml(item.note || '')}</em></li>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New assessment: ${escHtml(jobTitle)} — ${escHtml(company)}</title></head>
<body style="margin: 0; padding: 40px 20px; background-color: #f5f5f5; font-family: Inter, Helvetica, sans-serif;">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background-color: #0D0D0D; padding: 24px 32px;">
        <p style="margin: 0; font-family: Inter, Helvetica, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #C49A3C;">New Assessment Submission</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px; border-bottom: 2px solid #f0f0f0;">
        <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #1a1a1a;">${escHtml(jobTitle)} — ${escHtml(company)}</h2>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding: 4px 16px 4px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;">Name</td><td style="padding: 4px 0; font-size: 15px; color: #1a1a1a;">${escHtml(name)}</td></tr>
          <tr><td style="padding: 4px 16px 4px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;">Company</td><td style="padding: 4px 0; font-size: 15px; color: #1a1a1a;">${escHtml(company)}</td></tr>
          <tr><td style="padding: 4px 16px 4px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;">Email</td><td style="padding: 4px 0; font-size: 15px; color: #1a1a1a;"><a href="mailto:${escHtml(email)}" style="color: #C49A3C;">${escHtml(email)}</a></td></tr>
          <tr><td style="padding: 4px 16px 4px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;">Job Title</td><td style="padding: 4px 0; font-size: 15px; color: #1a1a1a;">${escHtml(jobTitle)}</td></tr>
          <tr><td style="padding: 4px 16px 4px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;">Tasks found</td><td style="padding: 4px 0; font-size: 15px; color: #1a1a1a;">${result.total_automatable_tasks}</td></tr>
          <tr><td style="padding: 4px 16px 4px 0; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;">Time saving</td><td style="padding: 4px 0; font-size: 15px; color: #1a1a1a;">${result.estimated_time_saving_percentage}%</td></tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; border-bottom: 1px solid #f0f0f0;">
        <p style="margin: 0 0 6px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #666;">Summary</p>
        <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6; font-style: italic;">${escHtml(result.summary_headline)}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; border-bottom: 1px solid #f0f0f0;">
        <p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #666;">Current Automation Opportunities</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #333; line-height: 1.6;">${currentItems}</ul>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; border-bottom: 1px solid #f0f0f0;">
        <p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #666;">Emerging Opportunities</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #333; line-height: 1.6;">${emergingItems}</ul>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; border-bottom: 1px solid #f0f0f0;">
        <p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #666;">Role Context</p>
        <p style="margin: 0; font-size: 14px; color: #333; line-height: 1.6;">${escHtml(result.role_context_note)}</p>
      </td>
    </tr>
    ${
      originalDescription
        ? `<tr>
      <td style="padding: 24px 32px;">
        <p style="margin: 0 0 12px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #666;">Original Job Description</p>
        <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.7; white-space: pre-wrap; font-family: monospace; background: #f9f9f9; padding: 16px;">${escHtml(originalDescription)}</p>
      </td>
    </tr>`
        : ''
    }
  </table>
</body>
</html>`
}

export function buildRateLimitAlertEmail(
  name: string,
  company: string,
  email: string,
  jobTitle: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Repeat submission flagged — ${escHtml(email)}</title></head>
<body style="margin: 0; padding: 40px 20px; background-color: #f5f5f5; font-family: Inter, Helvetica, sans-serif;">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background-color: #C49A3C; padding: 24px 32px;">
        <p style="margin: 0; font-family: Inter, Helvetica, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #0D0D0D;">Repeat Submission — Follow-up Flag</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <p style="margin: 0 0 20px; font-size: 15px; color: #333; line-height: 1.6;">Someone has attempted a second submission within 24 hours. This may be a warm lead worth following up with directly.</p>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding: 4px 16px 4px 0; font-size: 13px; color: #666; font-weight: 600;">Name</td><td style="font-size: 15px; color: #1a1a1a;">${escHtml(name)}</td></tr>
          <tr><td style="padding: 4px 16px 4px 0; font-size: 13px; color: #666; font-weight: 600;">Company</td><td style="font-size: 15px; color: #1a1a1a;">${escHtml(company)}</td></tr>
          <tr><td style="padding: 4px 16px 4px 0; font-size: 13px; color: #666; font-weight: 600;">Email</td><td style="font-size: 15px; color: #1a1a1a;"><a href="mailto:${escHtml(email)}" style="color: #C49A3C;">${escHtml(email)}</a></td></tr>
          <tr><td style="padding: 4px 16px 4px 0; font-size: 13px; color: #666; font-weight: 600;">Job Title</td><td style="font-size: 15px; color: #1a1a1a;">${escHtml(jobTitle)}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
