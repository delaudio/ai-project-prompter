import { FileSystemAdapter, FileNode } from './types';

export class BrowserFileSystemAdapter implements FileSystemAdapter {
  private fileMap: Map<string, FileNode>;

  constructor() {
    this.fileMap = new Map();
  }

  registerFile(node: FileNode) {
    this.fileMap.set(node.path, node);
    if (node.children) {
      node.children.forEach(child => this.registerFile(child));
    }
  }

  async readDirectory(path: string): Promise<FileNode[]> {
    const node = this.fileMap.get(path);
    if (!node) {
      throw new Error(`File not found: ${path}`);
    }
    return [node];
  }
}