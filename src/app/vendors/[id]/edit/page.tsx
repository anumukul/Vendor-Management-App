'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { VendorForm } from '../../../../components/VendorForm'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Vendor {
  _id: string
  vendorName: string
  bankAccountNo: string
  bankName: string
  addressLine1?: string
  addressLine2: string
  city?: string
  country?: string
  zipCode?: string
}

export default function EditVendorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session && params.id) {
      fetchVendor()
    }
  }, [status, session, params.id])

  const fetchVendor = async () => {
    try {
      const response = await fetch(`/api/vendors/${params.id}`)
      
      if (response.ok) {
        const vendorData = await response.json()
        setVendor(vendorData)
      } else if (response.status === 404) {
        toast.error('Vendor not found')
        router.push('/vendors')
      } else {
        toast.error('Failed to fetch vendor details')
        router.push('/vendors')
      }
    } catch (error) {
      toast.error('Something went wrong while fetching vendor details')
      router.push('/vendors')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading vendor details...</span>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Vendor not found</h2>
          <p className="text-gray-600 mt-2">The vendor you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <VendorForm vendor={vendor} isEdit={true} />
    </div>
  )
}