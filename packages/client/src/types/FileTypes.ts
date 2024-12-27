export interface FileNode {
  id: string;
  type: "file" | "folder";
  name: string;
  path: string;
  children?: FileNode[];
  metadata?: {
    size: number;
    modified: Date;
    type: string;
    content?: string;
  };
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: FileNode;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type: "default" | "hierarchy";
}
