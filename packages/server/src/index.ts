import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import * as fs from "fs/promises";
import chokidar from "chokidar";
import chalk from "chalk";
import { scanDirectory } from "./services/fileSystem";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(resolve(__dirname, "../../client/dist")));
}

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
    res.status(500).json({ error: "Failed to read file" });
  }
});

// Set up WebSocket for file changes
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("error", console.error);

  ws.on("close", () => {
    console.log("Client disconnected");
  });
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
  wss.clients.forEach((client) => {
    client.send(JSON.stringify({ event, path }));
  });
});

const port = process.env.PORT || 4173;
server.listen(port, () => {
  console.log();
  console.log(chalk.green("  🚀 AI Project Prompter started at:"));
  console.log();
  console.log(chalk.cyan(`  > Local: http://localhost:${port}/`));
  console.log();
});
