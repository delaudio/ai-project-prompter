import React, { useEffect } from 'react';
import { FileExplorer } from '../FileExplorer';
import { Preview } from '../Preview';
import { Header } from '../Header';
import { PromptPanel } from '../PromptPanel';
import { ProjectPrompterProps } from '../../types/Props';
import { useFileStore } from '../../store/useFileStore';

export const ProjectPrompter: React.FC<ProjectPrompterProps> = ({
  files,
  className,
  onFileSelect,
  onPromptChange,
  initialPrompt = '',
  showPromptPanel = false,
  aiProvider = 'openai'
}) => {
  const { setFiles, setPromptContent, setIsPromptPanelOpen } = useFileStore();

  useEffect(() => {
    setFiles(files);
    if (initialPrompt) {
      setPromptContent(initialPrompt);
    }
    if (showPromptPanel) {
      setIsPromptPanelOpen(true);
    }
  }, [files, initialPrompt, showPromptPanel]);

  return (
    <div className={`h-screen overflow-hidden ${className || ''}`}>
      <Header aiProvider={aiProvider} />
      <main className="h-[calc(100vh-56px)] mt-14 relative">
        <FileExplorer onFileSelect={onFileSelect} />
      </main>
      <Preview />
      <PromptPanel onPromptChange={onPromptChange} aiProvider={aiProvider} />
    </div>
  );
};