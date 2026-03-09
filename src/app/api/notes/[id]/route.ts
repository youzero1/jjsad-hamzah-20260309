import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getNoteRepository } from '@/lib/database';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getNoteRepository();
    const note = await repo.findOne({ where: { id: params.id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ data: note });
  } catch (error) {
    console.error('GET /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

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
    if (body.title !== undefined) note.title = body.title.trim();
    if (body.content !== undefined) note.content = body.content.trim();
    if (body.tags !== undefined) note.tags = body.tags?.trim() || null;
    if (body.isPublic !== undefined) note.isPublic = body.isPublic;
    if (body.authorName !== undefined) note.authorName = body.authorName.trim();

    const updated = await repo.save(note);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PATCH /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const repo = await getNoteRepository();
    const note = await repo.findOne({ where: { id: params.id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    await repo.remove(note);
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
