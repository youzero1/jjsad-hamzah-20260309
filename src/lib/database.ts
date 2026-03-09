import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { DataSource } from 'typeorm';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  dataSource = AppDataSource;
  return dataSource;
}
