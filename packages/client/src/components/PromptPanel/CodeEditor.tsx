import React, { useRef, useEffect } from 'react';
import { LineNumbers } from './LineNumbers';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      const { height } = textareaRef.current.getBoundingClientRect();
      lineNumbersRef.current.style.height = `${height}px`;
    }
  }, [value]);

  return (
    <div className="relative flex-1 h-full border dark:border-gray-700 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      <div 
        ref={lineNumbersRef}
        className="absolute left-0 top-0 bottom-0 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700 overflow-hidden"
      >
        <LineNumbers content={value} />
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
        className="w-full h-full resize-none font-mono text-sm p-2 pl-12 bg-transparent dark:bg-gray-900 dark:text-gray-100 focus:outline-none leading-[1.6]"
        spellCheck={false}
      />
    </div>
  );
};