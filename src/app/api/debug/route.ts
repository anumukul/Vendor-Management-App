
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectDB } from '../../../../lib/mongodb'

export async function GET(request: NextRequest) {
  try {
 
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    }

   
    const session = await getServerSession()
    

    let dbConnection = false;
    let dbError = null;
    
    try {
      await connectDB()
      dbConnection = true;
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Unknown database error'
    }

    return NextResponse.json({
      message: "Debug information",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      environmentVariables: envCheck,
      session: {
        exists: !!session,
        user: session?.user?.email || null
      },
      database: {
        connected: dbConnection,
        error: dbError
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      error: 'Debug route failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}