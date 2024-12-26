import { FileNode } from './FileTypes';

export interface ProjectPrompterProps {
  /**
   * The project file system structure to display
   */
  files: FileNode[];
  
  /**
   * Optional class name for the container
   */
  className?: string;
  
  /**
   * Optional callback when a file is selected
   */
  onFileSelect?: (file: FileNode) => void;
  
  /**
   * Optional callback when prompt content changes
   */
  onPromptChange?: (content: string) => void;
  
  /**
   * Initial prompt content
   */
  initialPrompt?: string;
  
  /**
   * Whether to show the prompt panel by default
   */
  showPromptPanel?: boolean;

  /**
   * Optional AI provider for prompt formatting
   */
  aiProvider?: 'openai' | 'anthropic' | 'custom';
}