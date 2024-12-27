import { resolve } from "path";
import * as fs from "fs/promises";

interface FileNode {
  id: string;
  name: string;
  path: string;
  type: string;
  children?: FileNode[];
  metadata: {
    type: string;
    size?: number;
    modified?: Date;
    content?: string;
  };
}

export async function scanDirectory(dir: string): Promise<FileNode[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter(
        (entry) =>
          !entry.name.startsWith(".") &&
          entry.name !== "node_modules" &&
          entry.name !== "dist" &&
          entry.name !== ".next" &&
          entry.name !== "build"
      )
      .map(async (entry) => {
        const path = resolve(dir, entry.name);
        const isDirectory = entry.isDirectory();

        const node: FileNode = {
          id: path,
          name: entry.name,
          path,
          type: isDirectory ? "folder" : "file",
          metadata: {
            type: getFileType(entry.name),
          },
        };

        if (isDirectory) {
          node.children = await scanDirectory(path);
        } else {
          const stat = await fs.stat(path);
          node.metadata = {
            ...node.metadata,
            size: stat.size,
            modified: stat.mtime,
          };
        }

        return node;
      })
  );

  return files;
}

function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    md: "markdown",
    css: "css",
    scss: "scss",
    html: "html",
    svg: "svg",
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
  };

  return typeMap[ext || ""] || ext || "unknown";
}

class ApiFileSystem {
  private ws: WebSocket;
  private onChangeCallbacks: Set<(event: string, path: string) => void>;

  constructor() {
    this.onChangeCallbacks = new Set();
    this.ws = new WebSocket(`ws://${window.location.host}`);

    this.ws.onmessage = (event) => {
      const { event: fileEvent, path } = JSON.parse(event.data);
      this.onChangeCallbacks.forEach((cb) => cb(fileEvent, path));
    };
  }

  async getFiles(): Promise<FileNode[]> {
    const response = await fetch("/api/files");
    return response.json();
  }

  async getFileContent(path: string): Promise<string> {
    const response = await fetch(`/api/files/${encodeURIComponent(path)}`);
    const data = await response.json();
    return data.content;
  }

  onFileChange(callback: (event: string, path: string) => void) {
    this.onChangeCallbacks.add(callback);
    return () => this.onChangeCallbacks.delete(callback);
  }
}

export const fileSystem = new ApiFileSystem();
