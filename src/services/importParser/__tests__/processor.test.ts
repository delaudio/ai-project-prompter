import { describe, it, expect, vi } from 'vitest';
import { ImportProcessor } from '../processor';
import { ImportResolver } from '../resolver';

describe('ImportProcessor', () => {
  const mockResolver = {
    resolveImport: vi.fn(),
    getFileContent: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process a file without imports', async () => {
    const content = 'const x = 1;';
    mockResolver.getFileContent.mockResolvedValue(content);

    const processor = new ImportProcessor(mockResolver as any);
    const result = await processor.processFile('test.ts');

    expect(result).toContain(content);
    expect(mockResolver.getFileContent).toHaveBeenCalledTimes(1);
  });

  it('should handle circular dependencies', async () => {
    mockResolver.getFileContent.mockResolvedValue('import "./circular"');
    mockResolver.resolveImport.mockResolvedValue('./circular');

    const processor = new ImportProcessor(mockResolver as any);
    const result = await processor.processFile('circular');

    expect(result).not.toBe('');
    expect(mockResolver.getFileContent).toHaveBeenCalledTimes(1);
  });

  it('should respect max depth', async () => {
    mockResolver.getFileContent.mockResolvedValue('import "./deep"');
    mockResolver.resolveImport.mockResolvedValue('./deep');

    const processor = new ImportProcessor(mockResolver as any, { maxDepth: 2 });
    const result = await processor.processFile('root');

    expect(result).toContain('Max depth reached');
  });

  it('should handle file read errors', async () => {
    mockResolver.getFileContent.mockResolvedValue(null);

    const processor = new ImportProcessor(mockResolver as any);
    const result = await processor.processFile('error.ts');

    expect(result).toContain('Failed to read');
  });

  it('should process nested imports', async () => {
    const files = {
      'main.ts': 'import "./util"',
      'util.ts': 'const util = 1;'
    };

    mockResolver.getFileContent.mockImplementation(
      (path) => Promise.resolve(files[path as keyof typeof files])
    );
    mockResolver.resolveImport.mockResolvedValue('util.ts');

    const processor = new ImportProcessor(mockResolver as any);
    const result = await processor.processFile('main.ts');

    expect(result).toContain('main.ts');
    expect(result).toContain('util.ts');
  });
});