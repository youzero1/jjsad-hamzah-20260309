import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getNoteRepository } from '@/lib/database';

export async function GET(req: NextRequest) {
  try {
    const repo = await getNoteRepository();
    const notes = await repo.find({
      where: { isPublic: true },
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json({ data: notes });
  } catch (error) {
    console.error('GET /api/notes/public error:', error);
    return NextResponse.json({ error: 'Failed to fetch public notes' }, { status: 500 });
  }
}
