import { parseImports } from "./parser";
import { ImportResolver } from "./resolver";
import { ImportParserOptions } from "./types";

export class ImportProcessor {
  private processedFiles: Set<string> = new Set();

  constructor(
    public resolver: ImportResolver,
    private options: ImportParserOptions = {}
  ) {
    this.options = {
      excludeNodeModules: true,
      maxDepth: 7,
      ...options,
    };
  }

  async processFile(filePath: string, currentDepth: number = 0): Promise<string> {
    // Get content of current file
    const content = await this.resolver.getFileContent(filePath);
    if (!content) {
      return `// Failed to read: ${filePath}\n`;
    }

    let output = `// ${filePath}\n${content}\n\n`;

    // If we've hit max depth, stop processing imports but still return file content
    if (currentDepth >= (this.options.maxDepth || 5)) {
      return output;
    }

    // Parse and process imports
    const imports = parseImports(content, this.options.excludeNodeModules);
    
    // Track this file as processed
    this.processedFiles.add(filePath);

    // Process each import
    for (const imp of imports) {
      const resolvedPath = await this.resolver.resolveImport(filePath, imp.path);
      
      if (!resolvedPath) {
        output += `// Failed to resolve: ${imp.path}\n`;
        continue;
      }

      // Skip if we've already processed this file
      if (this.processedFiles.has(resolvedPath)) {
        continue;
      }

      // For files beyond max depth, add a note but don't process
      if (currentDepth + 1 >= (this.options.maxDepth || 5)) {
        output += `// Max depth reached for: ${imp.path}\n`;
        continue;
      }

      // Process the imported file
      try {
        const importedContent = await this.processFile(resolvedPath, currentDepth + 1);
        output += importedContent;
      } catch (error) {
        output += `// Error processing import ${imp.path}: ${error}\n`;
      }
    }

    return output;
  }

  reset(): void {
    this.processedFiles.clear();
  }
}