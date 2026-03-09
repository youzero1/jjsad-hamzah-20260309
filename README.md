# jjsad - Social Note Taking Platform

A full-stack social note-taking web application built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- ✏️ **Create Notes** – Write notes with title, content, tags, and author name
- 📋 **My Notes** – View, search, and filter your notes
- ✏️ **Edit Notes** – Update existing notes
- 🗑️ **Delete Notes** – Remove notes with confirmation
- 🌍 **Share Notes** – Toggle between private and public visibility
- 📢 **Public Feed** – Browse publicly shared notes from all users
- ❤️ **Like Notes** – React to notes in the public feed

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with TypeORM
- **Deployment**: Docker with standalone output

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker

```bash
docker-compose up --build
```

### Environment Variables

```env
DATABASE_PATH=./database.sqlite
NEXT_PUBLIC_APP_NAME=jjsad
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/          # Next.js App Router pages and API routes
├── components/   # Reusable React components
├── entities/     # TypeORM entity definitions
├── lib/          # Database utilities
└── types/        # TypeScript type definitions
```
