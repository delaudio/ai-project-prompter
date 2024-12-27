import React from 'react';
import { X, Trash2, Copy, Check } from 'lucide-react';
import { useFileStore } from '../../store/useFileStore';
import { formatPrompt } from '../../services/promptFormatters';
import { CodeEditor } from './CodeEditor';

interface PromptPanelProps {
  onPromptChange?: (content: string) => void;
  aiProvider?: string;
}

export const PromptPanel: React.FC<PromptPanelProps> = ({ 
  onPromptChange,
  aiProvider = 'openai'
}) => {
  const [copied, setCopied] = React.useState(false);
  const { 
    isPromptPanelOpen, 
    togglePromptPanel, 
    promptContent, 
    clearPrompt,
    setPromptContent 
  } = useFileStore();

  const handleCopy = async () => {
    try {
      const formattedPrompt = formatPrompt(promptContent, aiProvider);
      await navigator.clipboard.writeText(formattedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!isPromptPanelOpen) {
    return null;
  }

  return (
    <div className="fixed right-0 top-14 h-[calc(100vh-56px)] w-96 bg-white dark:bg-gray-900 shadow-lg flex flex-col z-40">
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Prompt</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            aria-label="Copy prompt content"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={clearPrompt}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            aria-label="Clear prompt"
            title="Clear prompt"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={togglePromptPanel}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close prompt panel"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <CodeEditor
          value={promptContent}
          onChange={setPromptContent}
          placeholder="Write or paste file contents here..."
        />
      </div>
    </div>
  );
};