import { describe, it, expect, vi } from 'vitest';
import { getFolderContent, getFileContentWithImports } from '../fileUtils';
import { ImportProcessor } from '../../services/importParser/processor';

vi.mock('../../services/importParser/processor');
vi.mock('../../services/importParser/resolver');

describe('fileUtils', () => {
  describe('getFolderContent', () => {
    it('should format a simple file structure', () => {
      const mockFile = {
        name: 'test.js',
        type: 'file',
        metadata: {
          type: 'javascript',
          content: 'console.log("hello");'
        }
      };

      const result = getFolderContent(mockFile);
      expect(result).toContain('test.js');
      expect(result).toContain('```javascript');
      expect(result).toContain('console.log("hello");');
    });

    it('should handle nested folder structure', () => {
      const mockFolder = {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'utils',
            type: 'folder',
            children: [
              {
                name: 'helper.js',
                type: 'file',
                metadata: {
                  type: 'javascript',
                  content: 'export const helper = () => {};'
                }
              }
            ]
          }
        ]
      };

      const result = getFolderContent(mockFolder);
      expect(result).toContain('src');
      expect(result).toContain('  utils');
      expect(result).toContain('    helper.js');
      expect(result).toContain('export const helper = () => {};');
    });
  });

  describe('getFileContentWithImports', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return folder content for nodes without content', async () => {
      const mockNode = {
        name: 'test',
        type: 'folder'
      };

      const result = await getFileContentWithImports(mockNode, {});
      expect(result).toBe('test\n');
    });

    it('should process imports for files with content', async () => {
      const mockNode = {
        name: 'test.ts',
        type: 'file',
        path: '/test.ts',
        metadata: {
          content: 'import "./other"'
        }
      };

      const mockContent = '// Processed content';
      (ImportProcessor as any).mockImplementation(() => ({
        processFile: vi.fn().mockResolvedValue(mockContent)
      }));

      const result = await getFileContentWithImports(mockNode, {});
      expect(result).toBe(mockContent);
    });

    it('should handle processing errors', async () => {
      const mockNode = {
        name: 'error.ts',
        type: 'file',
        path: '/error.ts',
        metadata: {
          content: 'import "./error"'
        }
      };

      (ImportProcessor as any).mockImplementation(() => ({
        processFile: vi.fn().mockRejectedValue(new Error('Process error'))
      }));

      const result = await getFileContentWithImports(mockNode, {});
      expect(result).toContain('error.ts');
    });
  });
});