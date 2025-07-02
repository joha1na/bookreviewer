import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    
    const connectionState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    return NextResponse.json({
      status: 'success',
      message: '✅ MongoDB connection successful!',
      connectionState: states[connectionState],
      database: mongoose.connection.name || 'Unknown',
      host: mongoose.connection.host || 'Unknown'
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: '❌ MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
