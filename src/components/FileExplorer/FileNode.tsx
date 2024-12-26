import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import {
  FileIcon,
  FolderIcon,
  ChevronRight,
  ChevronDown,
  Copy,
} from "lucide-react";
import { useFileStore } from "../../store/useFileStore";
import { getFolderContent } from "../../utils/fileUtils";

interface FileNodeProps {
  data: {
    id: string;
    name: string;
    type: "folder" | "file";
    metadata?: {
      size: number;
      modified: Date;
    };
  };
}

export const FileNode = memo(({ data }: FileNodeProps) => {
  const isFolder = data.type === "folder";
  const Icon = isFolder ? FolderIcon : FileIcon;
  const { toggleFolder, isExpanded, setSelectedFile, appendToPrompt } =
    useFileStore();
  const expanded = isExpanded(data.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      toggleFolder(data.id);
    } else {
      setSelectedFile({
        ...data,
        path: "",
        metadata: data.metadata
          ? { ...data.metadata, type: data.type }
          : undefined,
      });
    }
  };

  const handleCopyFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const content = getFolderContent(data);
    appendToPrompt(content);
  };

  return (
    <div
      className="px-4 py-2 shadow-lg rounded-md bg-white border border-gray-200 cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex items-center gap-2">
        {isFolder && (
          <>
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            <button
              onClick={handleCopyFolder}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy folder content to prompt"
            >
              <Copy className="w-4 h-4 text-gray-500" />
            </button>
          </>
        )}
        <Icon className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium">{data.name}</span>
      </div>
      {data.metadata && (
        <div className="mt-1 text-xs text-gray-500">
          <div>Size: {data.metadata.size} bytes</div>
          <div>Modified: {data.metadata.modified.toLocaleDateString()}</div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});
