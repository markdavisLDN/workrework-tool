import { redirect } from 'next/navigation'
import AdminTool from '@/components/AdminTool'

export const dynamic = 'force-dynamic'

export default async function AdminAssessPage({
  searchParams,
}: {
  searchParams: Promise<{ pw?: string }>
}) {
  const params = await searchParams
  const adminPassword = process.env.ADMIN_PASSWORD
  const provided = params.pw

  if (!adminPassword || provided !== adminPassword) {
    redirect('/?admin=denied')
  }

  return <AdminTool />
}
