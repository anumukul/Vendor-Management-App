'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { VendorForm } from '../../../components/VendorForm'
import { Loader2 } from 'lucide-react'


export default function CreateVendorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  return (
    <div className="container mx-auto py-8">
      <VendorForm />
    </div>
  )
}