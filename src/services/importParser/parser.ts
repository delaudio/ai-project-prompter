import { ParsedImport } from './types';

const ES_IMPORT_REGEX = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
const REQUIRE_REGEX = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

export function parseImports(content: string, excludeNodeModules: boolean = true): ParsedImport[] {
  const imports: ParsedImport[] = [];
  
  // Parse ES imports
  let match;
  while ((match = ES_IMPORT_REGEX.exec(content)) !== null) {
    const path = match[1];
    if (excludeNodeModules && !path.startsWith('.') && !path.startsWith('@')) {
      continue;
    }
    imports.push({ path, type: 'esm', original: match[0] });
  }
  
  // Parse require statements
  while ((match = REQUIRE_REGEX.exec(content)) !== null) {
    const path = match[1];
    if (excludeNodeModules && !path.startsWith('.') && !path.startsWith('@')) {
      continue;
    }
    imports.push({ path, type: 'require', original: match[0] });
  }
  
  return imports;
}