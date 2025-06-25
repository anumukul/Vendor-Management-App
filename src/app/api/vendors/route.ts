import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { connectDB } from '@/lib/mongodb'
import { Vendor } from '@/models/Vendor'

const authOptions = {
  providers: [],
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
}


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    
    const vendors = await Vendor.find({ createdBy: session.user.email })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    
    const total = await Vendor.countDocuments({ createdBy: session.user.email })

    return NextResponse.json({
      vendors,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' }, 
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const data = await request.json()
    
   
    if (!data.vendorName || !data.bankAccountNo || !data.bankName || !data.addressLine2) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

   
    const existingVendor = await Vendor.findOne({
      createdBy: session.user.email,
      bankAccountNo: data.bankAccountNo
    })

    if (existingVendor) {
      return NextResponse.json(
        { error: 'Vendor with this bank account already exists' }, 
        { status: 409 }
      )
    }

    const vendor = new Vendor({
      vendorName: data.vendorName.trim(),
      bankAccountNo: data.bankAccountNo.trim(),
      bankName: data.bankName.trim(),
      addressLine1: data.addressLine1?.trim() || '',
      addressLine2: data.addressLine2.trim(),
      city: data.city?.trim() || '',
      country: data.country?.trim() || '',
      zipCode: data.zipCode?.trim() || '',
      createdBy: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await vendor.save()
    
    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to create vendor' }, 
      { status: 500 }
    )
  }
}