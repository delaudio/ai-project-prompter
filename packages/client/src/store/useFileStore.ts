import { create } from 'zustand';
import { FileNode } from '../../../../src/types/FileTypes';
import { BrowserFileSystemAdapter } from '../services/adapters/browserAdapter';

interface FileStore {
  files: FileNode[];
  selectedFile: FileNode | null;
  searchQuery: string;
  isPanelOpen: boolean;
  isPromptPanelOpen: boolean;
  expandedFolders: Set<string>;
  promptContent: string;
  adapter: BrowserFileSystemAdapter;
  setFiles: (files: FileNode[]) => void;
  setSelectedFile: (file: FileNode | null) => void;
  setSearchQuery: (query: string) => void;
  togglePanel: () => void;
  togglePromptPanel: () => void;
  toggleFolder: (folderId: string) => void;
  isExpanded: (folderId: string) => boolean;
  appendToPrompt: (content: string) => void;
  setPromptContent: (content: string) => void;
  clearPrompt: () => void;
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  selectedFile: null,
  searchQuery: '',
  isPanelOpen: false,
  isPromptPanelOpen: false,
  expandedFolders: new Set<string>(),
  promptContent: '',
  adapter: new BrowserFileSystemAdapter(),
  setFiles: (files) => {
    const adapter = get().adapter;
    files.forEach(file => adapter.registerFile(file));
    set({ files });
  },
  setSelectedFile: (file) => set({ selectedFile: file, isPanelOpen: true }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  togglePromptPanel: () => set((state) => ({ isPromptPanelOpen: !state.isPromptPanelOpen })),
  toggleFolder: (folderId) => set((state) => {
    const newExpanded = new Set(state.expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    return { expandedFolders: newExpanded };
  }),
  isExpanded: (folderId) => useFileStore.getState().expandedFolders.has(folderId),
  appendToPrompt: (content) => set((state) => ({
    promptContent: state.promptContent + (state.promptContent ? '\n\n' : '') + content,
    isPromptPanelOpen: true
  })),
  setPromptContent: (content) => set({ promptContent: content }),
  clearPrompt: () => set({ promptContent: '' })
}));