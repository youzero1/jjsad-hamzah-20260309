export interface NoteType {
  id: string;
  title: string;
  content: string;
  tags: string | null;
  isPublic: boolean;
  likes: number;
  authorName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tags?: string;
  isPublic?: boolean;
  authorName?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tags?: string;
  isPublic?: boolean;
  authorName?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
