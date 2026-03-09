import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getNoteRepository } from '@/lib/database';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getNoteRepository();
    const note = await repo.findOne({ where: { id: params.id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const body = await req.json();

    if (body.like === true) {
      note.likes = (note.likes || 0) + 1;
    }

    if (body.isPublic !== undefined) {
      note.isPublic = body.isPublic;
    }

    const updated = await repo.save(note);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PATCH /api/notes/[id]/share error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}
