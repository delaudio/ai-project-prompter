import { describe, it, expect } from 'vitest';
import { BrowserFileSystemAdapter } from '../browserAdapter';
import { FileNode } from '../types';

describe('BrowserFileSystemAdapter', () => {
  it('should register and read files', async () => {
    const adapter = new BrowserFileSystemAdapter();
    const mockFile: FileNode = {
      id: 'test',
      type: 'file',
      name: 'test.ts',
      path: '/test.ts',
      metadata: {
        content: 'test content',
        size: 12,
        modified: new Date(),
        type: 'typescript'
      }
    };

    adapter.registerFile(mockFile);
    const result = await adapter.readDirectory('/test.ts');
    
    expect(result[0]).toEqual(mockFile);
  });

  it('should handle nested files', async () => {
    const adapter = new BrowserFileSystemAdapter();
    const mockFolder: FileNode = {
      id: 'src',
      type: 'folder',
      name: 'src',
      path: '/src',
      children: [{
        id: 'test',
        type: 'file',
        name: 'test.ts',
        path: '/src/test.ts',
        metadata: {
          content: 'test content',
          size: 12,
          modified: new Date(),
          type: 'typescript'
        }
      }]
    };

    adapter.registerFile(mockFolder);
    const result = await adapter.readDirectory('/src/test.ts');
    
    expect(result[0].name).toBe('test.ts');
  });

  it('should throw error for non-existent files', async () => {
    const adapter = new BrowserFileSystemAdapter();
    
    await expect(adapter.readDirectory('/missing.ts')).rejects.toThrow('File not found');
  });
});