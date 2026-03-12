import { NextRequest, NextResponse } from 'next/server'
import { parseDocument } from '@/lib/parseDocument'
import { runAssessment } from '@/lib/assess'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const jobTitle = formData.get('jobTitle') as string | null
    const text = formData.get('text') as string | null
    const file = formData.get('file') as File | null

    if (!jobTitle?.trim()) {
      return NextResponse.json({ error: 'Job title is required.' }, { status: 400 })
    }

    if (!file && !text?.trim()) {
      return NextResponse.json(
        { error: 'A job description is required.' },
        { status: 400 }
      )
    }

    let description: string

    if (file) {
      description = await parseDocument(file)
    } else {
      description = text!.trim()
    }

    if (!description) {
      return NextResponse.json(
        {
          error:
            'We were not able to read this job description. Sorry about that — if you would like to discuss the opportunity, email mark@workrework.com',
        },
        { status: 422 }
      )
    }

    const result = await runAssessment(jobTitle.trim(), description)

    return NextResponse.json({ result })
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'We were not able to complete this assessment. Sorry about that — if you would like to discuss the opportunity, email mark@workrework.com'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
