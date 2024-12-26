#!/usr/bin/env node
import { Command } from "commander";
import * as express from "express";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import * as fs from "node:fs/promises";
import * as chokidar from "chokidar";
import chalk from "chalk";

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

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

async function startServer() {
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: resolve(__dirname, ".."),
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // API endpoint to get project structure
  app.get("/api/files", async (req, res) => {
    try {
      const projectRoot = process.cwd();
      const files = await scanDirectory(projectRoot);
      res.json(files);
    } catch (error) {
      console.error("Error scanning directory:", error);
      res.status(500).json({ error: "Failed to scan directory" });
    }
  });

  // API endpoint to get file content
  app.get("/api/files/:path(*)", async (req, res) => {
    try {
      const filePath = resolve(process.cwd(), req.params.path);
      const content = await fs.readFile(filePath, "utf-8");
      res.json({ content });
    } catch (error) {
      console.error("Error reading file:", error);
      res.status(500).json({ error: "Failed to read file" });
    }
  });

  const port = process.env.PORT || 4173;
  app.listen(port, () => {
    console.log();
    console.log(chalk.green("  🚀 AI Project Prompter started at:"));
    console.log();
    console.log(chalk.cyan(`  > Local: http://localhost:${port}/`));
    console.log();
  });

  // Watch for file changes
  const watcher = chokidar.watch(process.cwd(), {
    ignored: [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/.next/**",
      "**/build/**",
    ],
    persistent: true,
  });

  watcher.on("all", (event, path) => {
    console.log(chalk.gray(`  ${event}: ${path}`));
  });
}

async function scanDirectory(dir: string): Promise<FileNode[]> {
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

// Create the CLI program
const program = new Command();

program
  .name("ai-project-prompter")
  .description("AI-powered project file explorer and prompt generator")
  .version("0.1.0")
  .action(startServer);

program.parse();
