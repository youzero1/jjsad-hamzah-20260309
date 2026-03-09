import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getNoteRepository } from '@/lib/database';
import { Like } from 'typeorm';

export async function GET(req: NextRequest) {
  try {
    const repo = await getNoteRepository();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';

    let notes = await repo.find({
      order: { createdAt: 'DESC' },
    });

    if (search) {
      const lower = search.toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(lower) ||
          n.content.toLowerCase().includes(lower)
      );
    }

    if (tag) {
      notes = notes.filter(
        (n) => n.tags && n.tags.split(',').map((t) => t.trim()).includes(tag)
      );
    }

    return NextResponse.json({ data: notes });
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const repo = await getNoteRepository();
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const note = repo.create({
      title: body.title.trim(),
      content: body.content.trim(),
      tags: body.tags?.trim() || null,
      isPublic: body.isPublic ?? false,
      authorName: body.authorName?.trim() || 'Anonymous',
      likes: 0,
    });

    const saved = await repo.save(note);
    return NextResponse.json({ data: saved }, { status: 201 });
  } catch (error) {
    console.error('POST /api/notes error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
