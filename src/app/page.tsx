'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session) {
      router.push('/vendors')
    }
  }, [session, status, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  )
}