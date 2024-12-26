import React from 'react';
import { FolderTree } from 'lucide-react';
import { useFileStore } from '../../store/useFileStore';
import { ThemeToggle } from '../ThemeToggle';

export const Header = () => {
  const { togglePromptPanel } = useFileStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-900 border-b dark:border-gray-700 z-50 px-4">
      <div className="h-full flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400">
          <FolderTree className="w-6 h-6" />
          <span className="font-semibold">File Explorer</span>
        </a>
        
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={togglePromptPanel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
          >
            Prompt
          </button>
        </nav>
      </div>
    </header>
  );
};