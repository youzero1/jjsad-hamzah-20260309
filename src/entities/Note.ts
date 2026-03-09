import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notes')
export class Note {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  title!: string;

  @Column('text')
  content!: string;

  @Column('text', { nullable: true, default: '' })
  tags!: string;

  @Column('boolean', { default: false })
  isPublic!: boolean;

  @Column('text', { default: 'Anonymous' })
  authorName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
