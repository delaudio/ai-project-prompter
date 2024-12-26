import { parseImports } from './parser';
import { ImportResolver } from './resolver';
import { ImportParserOptions } from './types';

export class ImportProcessor {
  private processedFiles: Set<string> = new Set();
  
  constructor(
    private resolver: ImportResolver,
    private options: ImportParserOptions = {}
  ) {
    this.options = {
      excludeNodeModules: true,
      maxDepth: 5,
      ...options
    };
  }

  async processFile(filePath: string, currentDepth: number = 0): Promise<string> {
    if (this.processedFiles.has(filePath)) {
      return ''; // Skip processed files
    }
    
    if (currentDepth >= (this.options.maxDepth || 5)) {
      return `// Max depth reached for: ${filePath}\n`;
    }
    
    this.processedFiles.add(filePath);
    let output = '';
    
    const content = await this.resolver.getFileContent(filePath);
    if (!content) {
      return `// Failed to read: ${filePath}\n`;
    }
    
    output += `// ${filePath}\n${content}\n\n`;
    
    const imports = parseImports(content, this.options.excludeNodeModules);
    
    for (const imp of imports) {
      const resolvedPath = await this.resolver.resolveImport(filePath, imp.path);
      if (resolvedPath) {
        const importContent = await this.processFile(resolvedPath, currentDepth + 1);
        output += importContent;
      }
    }
    
    return output;
  }
}