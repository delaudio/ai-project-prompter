import { FileSystemAdapter } from "./adapters/types";
import { MockFileSystemAdapter } from "./adapters/mockAdapter";

let adapter: FileSystemAdapter = new MockFileSystemAdapter();

export const setFileSystemAdapter = (newAdapter: FileSystemAdapter) => {
  adapter = newAdapter;
};

export const readFileSystem = async (path: string) => {
  return adapter.readDirectory(path);
};

class WebSocketService {
  private ws: WebSocket;
  private onChangeCallbacks: Set<(event: string, path: string) => void>;

  constructor() {
    this.onChangeCallbacks = new Set();
    this.ws = new WebSocket(`ws://${window.location.host}`);

    this.ws.onmessage = (event) => {
      const { event: fileEvent, path } = JSON.parse(event.data);
      this.onChangeCallbacks.forEach((cb) => cb(fileEvent, path));
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
      // Attempt to reconnect after a delay
      setTimeout(() => this.connect(), 5000);
    };
  }

  private connect() {
    this.ws = new WebSocket(`ws://${window.location.host}`);
  }

  onFileChange(callback: (event: string, path: string) => void) {
    this.onChangeCallbacks.add(callback);
    return () => this.onChangeCallbacks.delete(callback);
  }
}

export const wsService = new WebSocketService();

export async function getFiles() {
  const response = await fetch("/api/files");
  if (!response.ok) {
    throw new Error("Failed to fetch files");
  }
  return response.json();
}

export async function getFileContent(path: string) {
  const response = await fetch(`/api/files/${encodeURIComponent(path)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch file content");
  }
  const data = await response.json();
  return data.content;
}
