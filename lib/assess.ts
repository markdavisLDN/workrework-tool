import Anthropic, { APIError } from '@anthropic-ai/sdk'
import type { AssessmentResult } from '@/types/assessment'

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

const SYSTEM_PROMPT = `You are an expert workforce consultant at Work/reWork, a consultancy that helps organisations redesign roles for the AI era. Your approach is human-first: you believe automation should free people to do more meaningful work, not simply replace them.

You assess job descriptions to identify automation opportunities — both what is possible now with current AI and automation tools, and what is emerging in the near future. You are directional and specific, not generic.

Your output must be valid JSON matching the schema exactly. No markdown, no code fences, just the raw JSON object.`

const USER_PROMPT = (jobTitle: string, description: string) => `Assess this job description for automation opportunities.

Job Title: ${jobTitle}

Job Description:
${description}

Return a JSON object with this exact schema:
{
  "job_title": "string — use the job title as provided",
  "total_automatable_tasks": number — total count of all tasks identified across both sections,
  "estimated_time_saving_percentage": number — aggregate % capped at 60 for credibility,
  "summary_headline": "string — one clear sentence summarising the overall finding",
  "current_automation_opportunities": [
    {
      "task": "string — short task name",
      "description": "string — two sentences max explaining what aspect of this task can be automated and what that would free the person up to do instead. Do not name specific tools or software.",
      "estimated_time_saving_percentage": number,
      "confidence": "high" or "medium"
    }
  ],
  "emerging_automation_opportunities": [
    {
      "task": "string — short task name",
      "description": "string — exactly one sentence explaining what will become possible and why it is not fully mainstream yet",
      "estimated_time_saving_percentage": number,
      "note": "string — brief explanation of why this is forward-looking"
    }
  ],
  "role_context_note": "string — a brief paragraph on the broader implications for this role in the AI era"
}

Requirements:
- current_automation_opportunities: 3–5 items, descriptions are 1–2 sentences, no tool names
- emerging_automation_opportunities: 2–3 items, descriptions are exactly one sentence
- estimated_time_saving_percentage: between 5 and 60
- Be specific to this role, not generic
- Forward-looking items must clearly explain why they are not yet mainstream
- Tone: confident, direct, human-first — automation frees people, it does not simply replace them`

export async function runAssessment(
  jobTitle: string,
  description: string
): Promise<AssessmentResult> {
  let message
  try {
    message = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: USER_PROMPT(jobTitle, description),
      },
    ],
      system: SYSTEM_PROMPT,
    })
  } catch (err) {
    if (err instanceof APIError) {
      if (err.status === 529 || err.status === 503) {
        throw new Error('Our assessment service is very busy right now. Please try again in a moment.')
      }
      if (err.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.')
      }
    }
    throw new Error('We were unable to complete your assessment. Please try again.')
  }

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response format from AI.')
  }

  let raw = content.text.trim()

  // Strip any accidental markdown fences
  if (raw.startsWith('```')) {
    raw = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  }

  let result: AssessmentResult
  try {
    result = JSON.parse(raw)
  } catch {
    throw new Error('Could not parse AI response.')
  }

  // Validate structure
  if (
    !result.job_title ||
    typeof result.total_automatable_tasks !== 'number' ||
    typeof result.estimated_time_saving_percentage !== 'number' ||
    !result.summary_headline ||
    !Array.isArray(result.current_automation_opportunities) ||
    !Array.isArray(result.emerging_automation_opportunities) ||
    !result.role_context_note
  ) {
    throw new Error('AI response did not match expected format.')
  }

  // Enforce caps
  result.estimated_time_saving_percentage = Math.min(
    60,
    Math.max(5, result.estimated_time_saving_percentage)
  )

  return result
}
