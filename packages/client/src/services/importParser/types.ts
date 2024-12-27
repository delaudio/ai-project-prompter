export interface ImportParserOptions {
  extensions?: string[];
  excludeNodeModules?: boolean;
  maxDepth?: number;
}

export interface ParsedImport {
  path: string;
  type: 'esm' | 'require';
  original: string;
}