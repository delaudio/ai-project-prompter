import { FileSystemAdapter, FileNode } from './types';

export class MockFileSystemAdapter implements FileSystemAdapter {
  async readDirectory(): Promise<FileNode[]> {
    return [
      {
        id: 'test-folder',
        type: 'folder',
        name: 'test-folder',
        path: '/test-folder',
        children: [
          {
            id: 'test-file',
            type: 'file',
            name: 'test-file.js',
            path: '/test-folder/test-file.js',
            metadata: {
              size: 123,
              modified: new Date(),
              type: 'javascript',
              content: '// This is a test JavaScript file\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n'
            }
          }
        ]
      }
    ];
  }
}