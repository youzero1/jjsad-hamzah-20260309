import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Note } from '@/entities/Note';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('public') === 'true';

    let notes: Note[];
    if (publicOnly) {
      notes = await repo.find({
        where: { isPublic: true },
        order: { createdAt: 'DESC' },
      });
    } else {
      notes = await repo.find({
        order: { createdAt: 'DESC' },
      });
    }

    return NextResponse.json(notes);
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const ds = await getDataSource();
    const repo = ds.getRepository(Note);

    const note = repo.create({
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      tags: typeof tags === 'string' ? tags.trim() : '',
      isPublic: typeof isPublic === 'boolean' ? isPublic : false,
      authorName: typeof authorName === 'string' && authorName.trim() ? authorName.trim() : 'Anonymous',
    });

    const saved = await repo.save(note);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/notes error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
