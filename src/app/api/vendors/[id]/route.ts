import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { connectDB } from '@/lib/mongodb'
import { Vendor } from '@/models/Vendor'
import { ObjectId } from 'mongodb'

const authOptions = {
  providers: [],
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 })
    }

    const vendor = await Vendor.findOne({
      _id: id,
      createdBy: session.user.email
    }).lean()

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    return NextResponse.json(vendor)
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor' }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 })
    }

    const data = await request.json()
    
    if (!data.vendorName || !data.bankAccountNo || !data.bankName || !data.addressLine2) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    const existingVendor = await Vendor.findOne({
      _id: id,
      createdBy: session.user.email
    })

    if (!existingVendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    if (data.bankAccountNo !== existingVendor.bankAccountNo) {
      const conflictingVendor = await Vendor.findOne({
        createdBy: session.user.email,
        bankAccountNo: data.bankAccountNo,
        _id: { $ne: id }
      })

      if (conflictingVendor) {
        return NextResponse.json(
          { error: 'Another vendor with this bank account already exists' }, 
          { status: 409 }
        )
      }
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      {
        vendorName: data.vendorName.trim(),
        bankAccountNo: data.bankAccountNo.trim(),
        bankName: data.bankName.trim(),
        addressLine1: data.addressLine1?.trim() || '',
        addressLine2: data.addressLine2.trim(),
        city: data.city?.trim() || '',
        country: data.country?.trim() || '',
        zipCode: data.zipCode?.trim() || '',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).lean()

    return NextResponse.json(updatedVendor)
  } catch (error) {
    console.error('Error updating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to update vendor' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 })
    }

    const deletedVendor = await Vendor.findOneAndDelete({
      _id: id,
      createdBy: session.user.email
    })

    if (!deletedVendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Vendor deleted successfully',
      deletedVendor: {
        _id: deletedVendor._id,
        vendorName: deletedVendor.vendorName
      }
    })
  } catch (error) {
    console.error('Error deleting vendor:', error)
    return NextResponse.json(
      { error: 'Failed to delete vendor' }, 
      { status: 500 }
    )
  }
}