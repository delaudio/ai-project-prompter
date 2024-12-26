import React from 'react';
import { X, Copy } from 'lucide-react';
import { useFileStore } from '../../store/useFileStore';
import { getFileContentWithImports } from '../../utils/fileUtils';

export const Preview = () => {
  const { selectedFile, isPanelOpen, togglePanel, appendToPrompt } = useFileStore();

  const handleCopyToPrompt = async () => {
    if (selectedFile?.metadata?.content) {
      const fileContent = await getFileContentWithImports(selectedFile, useFileStore.getState().adapter);
      appendToPrompt(fileContent);
      togglePanel(); // Close the panel after copying
    }
  };

  if (!isPanelOpen) {
    return null;
  }

  return (
    <div className="fixed right-0 top-14 h-[calc(100vh-56px)] w-96 bg-white dark:bg-gray-900 shadow-lg flex flex-col z-30">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedFile?.name || 'No file selected'}</h2>
          <div className="flex gap-2">
            {selectedFile?.metadata?.content && (
              <button
                onClick={handleCopyToPrompt}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                aria-label="Copy to prompt"
              >
                <Copy className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={togglePanel}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        {selectedFile?.metadata && (
          <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>Type: {selectedFile.metadata.type}</p>
            <p>Size: {selectedFile.metadata.size} bytes</p>
            <p>Modified: {selectedFile.metadata.modified.toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {selectedFile?.metadata?.content && (
        <div className="flex-1 overflow-auto">
          <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            {selectedFile.metadata.content}
          </pre>
        </div>
      )}
    </div>
  );
};