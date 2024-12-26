import { describe, it, expect } from 'vitest';
import { parseImports } from '../parser';

describe('parseImports', () => {
  it('should parse ES6 imports', () => {
    const content = `
      import foo from './foo';
      import { bar } from '../bar';
      import * as baz from '@/baz';
    `;
    
    const imports = parseImports(content);
    
    expect(imports).toHaveLength(3);
    expect(imports[0]).toEqual({
      path: './foo',
      type: 'esm',
      original: "import foo from './foo'"
    });
  });

  it('should parse require statements', () => {
    const content = `
      const foo = require('./foo');
      const { bar } = require('../bar');
    `;
    
    const imports = parseImports(content);
    
    expect(imports).toHaveLength(2);
    expect(imports[0]).toEqual({
      path: './foo',
      type: 'require',
      original: "require('./foo')"
    });
  });

  it('should exclude node_modules imports when specified', () => {
    const content = `
      import react from 'react';
      import local from './local';
    `;
    
    const imports = parseImports(content, true);
    
    expect(imports).toHaveLength(1);
    expect(imports[0].path).toBe('./local');
  });

  it('should include node_modules imports when specified', () => {
    const content = `
      import react from 'react';
      import local from './local';
    `;
    
    const imports = parseImports(content, false);
    
    expect(imports).toHaveLength(2);
  });
});