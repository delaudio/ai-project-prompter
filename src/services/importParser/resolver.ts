import { FileSystemAdapter } from '../adapters/types';

const DEFAULT_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

export class ImportResolver {
  constructor(
    private adapter: FileSystemAdapter,
    private extensions: string[] = DEFAULT_EXTENSIONS
  ) {}

  async resolveImport(basePath: string, importPath: string): Promise<string | null> {
    // Implementation will depend on the FileSystemAdapter capabilities
    // For now, we'll return the import path as is
    return importPath;
  }

  async getFileContent(path: string): Promise<string | null> {
    try {
      const file = await this.adapter.readDirectory(path);
      return file[0]?.metadata?.content || null;
    } catch {
      return null;
    }
  }
}