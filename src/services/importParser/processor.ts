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
      maxDepth: 5,
      ...options,
    };
  }

  async processFile(
    filePath: string,
    currentDepth: number = 0
  ): Promise<string> {
    if (currentDepth >= (this.options.maxDepth || 5)) {
      return `// Max depth reached for: ${filePath}\n`;
    }

    if (this.processedFiles.has(filePath)) {
      return "";
    }

    const content = await this.resolver.getFileContent(filePath);
    if (!content) {
      return `// Failed to read: ${filePath}\n`;
    }

    this.processedFiles.add(filePath);
    let output = `// ${filePath}\n${content}\n\n`;

    const imports = parseImports(content, this.options.excludeNodeModules);

    for (const imp of imports) {
      const resolvedPath = await this.resolver.resolveImport(
        filePath,
        imp.path
      );
      if (resolvedPath) {
        output += await this.processFile(resolvedPath, currentDepth + 1);
      }
    }

    return output;
  }
}
