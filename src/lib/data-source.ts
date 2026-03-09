import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Note } from '@/entities/Note';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/jjsad.sqlite';
const resolvedDbPath = path.resolve(process.cwd(), dbPath);

// Ensure the data directory exists
const dataDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: resolvedDbPath,
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [Note],
  migrations: [],
  subscribers: [],
});
