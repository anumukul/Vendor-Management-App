'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog'
import { toast } from 'sonner'
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react'

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
  createdAt: string
}

interface PaginationData {
  page: number
  totalPages: number
  total: number
}

export default function VendorsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [vendors, setVendors] = useState<Vendor[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    totalPages: 1,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const fetchVendors = async (page: number = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/vendors?page=${page}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setVendors(data.vendors)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch vendors')
      }
    } catch {
      toast.error('Something went wrong while fetching vendors')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchVendors()
    }
  }, [session])

  const handlePageChange = (page: number) => {
    fetchVendors(page)
  }

  const handleDeleteClick = (vendor: Vendor) => {
    setVendorToDelete(vendor)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!vendorToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/vendors/${vendorToDelete._id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Vendor deleted successfully')
        fetchVendors(pagination.page)
      } else {
        toast.error('Failed to delete vendor')
      }
    } catch {
      toast.error('Something went wrong while deleting vendor')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setVendorToDelete(null)
    }
  }

  const generatePaginationButtons = () => {
    const buttons = []
    const { page, totalPages } = pagination

    if (page > 1) {
      buttons.push(
        <Button
          key="prev"
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </Button>
      )
    }

    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      )
    }

    if (page < totalPages) {
      buttons.push(
        <Button
          key="next"
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </Button>
      )
    }

    return buttons
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-gray-600 mt-1">
            Manage your vendor information
          </p>
        </div>
        <Button onClick={() => router.push('/vendors/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Vendor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Vendor List ({pagination.total} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No vendors found</p>
              <p className="text-gray-400 mt-2">Create your first vendor to get started</p>
              <Button 
                className="mt-4" 
                onClick={() => router.push('/vendors/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Vendor
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Bank Account No</TableHead>
                      <TableHead>Bank Name</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor._id}>
                        <TableCell className="font-medium">
                          {vendor.vendorName}
                        </TableCell>
                        <TableCell>{vendor.bankAccountNo}</TableCell>
                        <TableCell>{vendor.bankName}</TableCell>
                        <TableCell>{vendor.city || '-'}</TableCell>
                        <TableCell>{vendor.country || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/vendors/${vendor._id}/edit`)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteClick(vendor)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  {generatePaginationButtons()}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete vendor &quot;{vendorToDelete?.vendorName}&quot;? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}