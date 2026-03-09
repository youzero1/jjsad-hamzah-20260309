# jjsad – Social Note Taking Platform

A full-stack social note-taking web application built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- ✏️ Create, read, update, and delete notes
- 🔒 Private/Public visibility toggle
- 🌐 Public feed to discover notes from all users
- 🔍 Search and filter notes by title, content, or tags
- 📱 Responsive design
- 🏷️ Tag-based organization

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite via TypeORM + better-sqlite3
- **Styling**: Custom CSS (dark theme)

## Getting Started

### Development

```bash
# Install dependencies
npm i

# Create data directory
mkdir -p data

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production with Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Environment Variables

Create a `.env` file:

```
DATABASE_PATH=./data/jjsad.sqlite
NEXT_PUBLIC_APP_NAME=jjsad
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── api/notes/       # REST API routes
│   ├── notes/           # Note pages (list, create, detail, edit)
│   ├── feed/            # Public feed
│   ├── layout.tsx
│   └── page.tsx         # Homepage
├── components/          # Reusable UI components
├── entities/            # TypeORM entity definitions
└── lib/                 # Database connection utilities
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes?public=true` | Get public notes only |
| POST | `/api/notes` | Create a note |
| GET | `/api/notes/:id` | Get a specific note |
| PUT | `/api/notes/:id` | Update a note |
| PATCH | `/api/notes/:id` | Partially update a note |
| DELETE | `/api/notes/:id` | Delete a note |
