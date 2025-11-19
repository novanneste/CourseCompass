// app/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Example courses data
  const courses = [
    { id: 1, title: 'Course 1', duration: '3 hours' },
    { id: 2, title: 'Course 2', duration: '5 hours' },
  ];

  return NextResponse.json(courses);
}
