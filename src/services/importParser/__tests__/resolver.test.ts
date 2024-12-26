import { describe, it, expect, vi } from 'vitest';
import { ImportResolver } from '../resolver';
import { FileSystemAdapter } from '../../adapters/types';

describe('ImportResolver', () => {
  const mockAdapter: FileSystemAdapter = {
    readDirectory: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should resolve file content', async () => {
    const content = 'file content';
    (mockAdapter.readDirectory as any).mockResolvedValue([{
      metadata: { content }
    }]);

    const resolver = new ImportResolver(mockAdapter);
    const result = await resolver.getFileContent('test.ts');

    expect(result).toBe(content);
    expect(mockAdapter.readDirectory).toHaveBeenCalledWith('test.ts');
  });

  it('should handle missing file content', async () => {
    (mockAdapter.readDirectory as any).mockResolvedValue([{}]);

    const resolver = new ImportResolver(mockAdapter);
    const result = await resolver.getFileContent('missing.ts');

    expect(result).toBeNull();
  });

  it('should handle read errors', async () => {
    (mockAdapter.readDirectory as any).mockRejectedValue(new Error('Read error'));

    const resolver = new ImportResolver(mockAdapter);
    const result = await resolver.getFileContent('error.ts');

    expect(result).toBeNull();
  });

  it('should resolve import path', async () => {
    const resolver = new ImportResolver(mockAdapter);
    const result = await resolver.resolveImport('/src/file.ts', './utils');

    expect(result).toBe('./utils');
  });
});