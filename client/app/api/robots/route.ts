import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const robots = await prisma.robot.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return NextResponse.json(robots);
  } catch (error) {
    console.error('Error fetching robots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch robots' },
      { status: 500 }
    );
  }
} 