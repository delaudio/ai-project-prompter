import { FileSystemAdapter } from './adapters/types';
import { MockFileSystemAdapter } from './adapters/mockAdapter';

let adapter: FileSystemAdapter = new MockFileSystemAdapter();

export const setFileSystemAdapter = (newAdapter: FileSystemAdapter) => {
  adapter = newAdapter;
};

export const readFileSystem = async (path: string) => {
  return adapter.readDirectory(path);
};
