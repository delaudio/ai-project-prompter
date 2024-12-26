import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FileNode } from './FileNode';
import { AutoLayoutButton } from './AutoLayoutButton';
import { useFileStore } from '../../store/useFileStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Search } from '../Search';
import { readFileSystem } from '../../services/fileSystem';
import { transformToFlow } from '../../services/flowTransformer';
import { FileExplorerProps } from '../../types/Props';

const nodeTypes = {
  file: FileNode,
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files: externalFiles,
  onFileSelect,
  onPromptChange,
  initialPrompt = '',
  showPromptPanel = false,
}) => {
  const { files, setFiles, expandedFolders, promptContent } = useFileStore();
  const { isDark } = useThemeStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (externalFiles) {
      setFiles(externalFiles);
    } else {
      readFileSystem('/')
        .then(setFiles)
        .catch(console.error);
    }
  }, [externalFiles, setFiles]);

  useEffect(() => {
    if (files.length > 0) {
      const { nodes: flowNodes, edges: flowEdges } = transformToFlow(files);
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [files, setNodes, setEdges, expandedFolders]);

  useEffect(() => {
    if (onPromptChange) {
      onPromptChange(promptContent);
    }
  }, [promptContent, onPromptChange]);

  return (
    <div className="h-full w-full">
      <div className="absolute top-4 left-4 z-20 w-64">
        <Search />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className={`h-full w-full ${isDark ? 'dark-flow' : ''}`}
      >
        <Background className={isDark ? 'dark:bg-gray-900' : ''} />
        <Controls className={isDark ? 'dark-controls' : ''} />
        <MiniMap className={isDark ? 'dark-minimap' : ''} />
        <AutoLayoutButton />
      </ReactFlow>
    </div>
  );
};