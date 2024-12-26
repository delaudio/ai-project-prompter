import React from 'react';

interface LineNumbersProps {
  content: string;
}

export const LineNumbers: React.FC<LineNumbersProps> = ({ content }) => {
  const lines = content.split('\n').length;
  
  return (
    <div className="py-2 flex flex-col text-right pr-2 select-none text-gray-400 font-mono text-sm">
      {Array.from({ length: Math.max(1, lines) }, (_, i) => (
        <div key={i + 1} className="leading-[1.6] h-[1.6em]">
          {i + 1}
        </div>
      ))}
    </div>
  );
};