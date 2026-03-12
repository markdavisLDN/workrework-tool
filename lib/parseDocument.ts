import { Buffer } from 'buffer'

export async function parseDocument(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (ext === 'pdf') {
    return parsePdf(buffer)
  } else if (ext === 'docx') {
    return parseDocx(buffer)
  }

  throw new Error('Unsupported file format. Please upload a PDF or DOCX.')
}

async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    // pdf-parse has a quirk where it looks for test files on import in some environments
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>
    const data = await pdfParse(buffer)
    const text = data.text?.trim()
    if (!text) throw new Error('Could not extract text from PDF.')
    return text
  } catch (err) {
    console.error('[pdf-parse error]', err)
    throw new Error(
      'We were not able to read this job description. Sorry about that — if you would like to discuss the opportunity, email mark@workrework.com'
    )
  }
}

async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    const text = result.value?.trim()
    if (!text) throw new Error('Could not extract text from DOCX.')
    return text
  } catch {
    throw new Error(
      'We were not able to read this job description. Sorry about that — if you would like to discuss the opportunity, email mark@workrework.com'
    )
  }
}
