export interface FileSystemAdapter {
  readDirectory: (path: string) => Promise<FileNode[]>;
}

export interface FileNode {
  id: string;
  type: 'file' | 'folder';
  name: string;
  path: string;
  children?: FileNode[];
  metadata?: {
    size: number;
    modified: Date;
    type: string;
    content?: string;
  };
}