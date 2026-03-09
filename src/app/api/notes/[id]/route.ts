import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Note } from '@/entities/Note';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const note = await repo.findOne({ where: { id: params.id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    console.error('GET /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const note = await repo.findOne({ where: { id: params.id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, tags, isPublic, authorName } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    if (title.trim().length > 200) {
      return NextResponse.json({ error: 'Title must be 200 characters or less' }, { status: 400 });
    }

    note.title = title.trim();
    note.content = content.trim();
    note.tags = typeof tags === 'string' ? tags.trim() : '';
    if (typeof isPublic === 'boolean') note.isPublic = isPublic;
    if (typeof authorName === 'string' && authorName.trim()) note.authorName = authorName.trim();

    const updated = await repo.save(note);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const note = await repo.findOne({ where: { id: params.id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const body = await request.json();
    if (typeof body.isPublic === 'boolean') note.isPublic = body.isPublic;
    if (typeof body.title === 'string' && body.title.trim()) note.title = body.title.trim();
    if (typeof body.content === 'string' && body.content.trim()) note.content = body.content.trim();
    if (typeof body.tags === 'string') note.tags = body.tags.trim();
    if (typeof body.authorName === 'string' && body.authorName.trim()) note.authorName = body.authorName.trim();

    const updated = await repo.save(note);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
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
