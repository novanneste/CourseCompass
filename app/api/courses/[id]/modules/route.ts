// app/module/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Example module data
  const modules = [
    { id: 1, name: 'Module 1', description: 'Intro to Module 1' },
    { id: 2, name: 'Module 2', description: 'Advanced Module 2' },
  ];

  return NextResponse.json(modules);
}
