'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Textarea } from './ui/textarea'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'


interface Vendor {
  _id?: string
  vendorName: string
  bankAccountNo: string
  bankName: string
  addressLine1?: string
  addressLine2: string
  city?: string
  country?: string
  zipCode?: string
}

interface VendorFormProps {
  vendor?: Vendor
  isEdit?: boolean
}

export function VendorForm({ vendor, isEdit = false }: VendorFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<Vendor>({
    vendorName: vendor?.vendorName || '',
    bankAccountNo: vendor?.bankAccountNo || '',
    bankName: vendor?.bankName || '',
    addressLine1: vendor?.addressLine1 || '',
    addressLine2: vendor?.addressLine2 || '',
    city: vendor?.city || '',
    country: vendor?.country || '',
    zipCode: vendor?.zipCode || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.vendorName.trim()) {
      newErrors.vendorName = 'Vendor name is required'
    }
    
    if (!formData.bankAccountNo.trim()) {
      newErrors.bankAccountNo = 'Bank account number is required'
    }
    
    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required'
    }
    
    if (!formData.addressLine2.trim()) {
      newErrors.addressLine2 = 'Address Line 2 is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsLoading(true)
    
    try {
      const url = isEdit ? `/api/vendors/${vendor?._id}` : '/api/vendors'
      const method = isEdit ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(`Vendor ${isEdit ? 'updated' : 'created'} successfully`)
        router.push('/vendors')
      } else {
        const error = await response.json()
        toast.error(error.message || `Failed to ${isEdit ? 'update' : 'create'} vendor`)
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof Vendor, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEdit ? 'Edit Vendor' : 'Create New Vendor'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vendor Name */}
              <div className="space-y-2">
                <Label htmlFor="vendorName" className="text-sm font-medium">
                  Vendor Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vendorName"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  className={errors.vendorName ? 'border-red-500' : ''}
                  placeholder="Enter vendor name"
                />
                {errors.vendorName && (
                  <p className="text-sm text-red-500">{errors.vendorName}</p>
                )}
              </div>

             
              <div className="space-y-2">
                <Label htmlFor="bankAccountNo" className="text-sm font-medium">
                  Bank Account Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankAccountNo"
                  value={formData.bankAccountNo}
                  onChange={(e) => handleInputChange('bankAccountNo', e.target.value)}
                  className={errors.bankAccountNo ? 'border-red-500' : ''}
                  placeholder="Enter bank account number"
                />
                {errors.bankAccountNo && (
                  <p className="text-sm text-red-500">{errors.bankAccountNo}</p>
                )}
              </div>

              
              <div className="space-y-2">
                <Label htmlFor="bankName" className="text-sm font-medium">
                  Bank Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className={errors.bankName ? 'border-red-500' : ''}
                  placeholder="Enter bank name"
                />
                {errors.bankName && (
                  <p className="text-sm text-red-500">{errors.bankName}</p>
                )}
              </div>

              
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>

             
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter country"
                />
              </div>

              
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-sm font-medium">
                  Zip Code
                </Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter zip code"
                />
              </div>
            </div>

            
            <div className="space-y-2">
              <Label htmlFor="addressLine1" className="text-sm font-medium">
                Address Line 1
              </Label>
              <Textarea
                id="addressLine1"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                placeholder="Enter address line 1"
                rows={2}
              />
            </div>

            
            <div className="space-y-2">
              <Label htmlFor="addressLine2" className="text-sm font-medium">
                Address Line 2 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                className={errors.addressLine2 ? 'border-red-500' : ''}
                placeholder="Enter address line 2"
                rows={2}
              />
              {errors.addressLine2 && (
                <p className="text-sm text-red-500">{errors.addressLine2}</p>
              )}
            </div>

            
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button type="submit" disabled={isLoading} className="sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Update Vendor' : 'Create Vendor'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}