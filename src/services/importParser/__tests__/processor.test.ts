import { describe, it, expect, vi } from "vitest";
import { ImportProcessor } from "../processor";

describe("ImportProcessor", () => {
  const mockAdapter = { readDirectory: vi.fn() };
  const mockResolver = {
    resolveImport: vi.fn(),
    getFileContent: vi.fn(),
    extensions: ['.ts', '.js'],
    adapter: mockAdapter
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should respect max depth", async () => {
    const files = {
      root: 'import "./deep"',
      "./deep": 'import "./deeper"',
      "./deeper": "const deeper = true;",
    };

    mockResolver.getFileContent.mockImplementation((path) =>
      Promise.resolve(files[path as keyof typeof files])
    );
    mockResolver.resolveImport.mockImplementation((_, path) =>
      Promise.resolve(path)
    );

    const processor = new ImportProcessor(mockResolver, { maxDepth: 1 });
    const result = await processor.processFile("root");

    expect(result).toContain("// root\n");
    expect(result).toContain('import "./deep"');
    expect(result).toContain("// Max depth reached for: ./deeper");
  });

  it("should process nested imports", async () => {
    const files = {
      "main.ts": 'import "./util"',
      "./util": "const util = 1;",
    };

    mockResolver.getFileContent.mockImplementation((path) =>
      Promise.resolve(files[path as keyof typeof files])
    );
    mockResolver.resolveImport.mockImplementation((_, path) =>
      Promise.resolve(path)
    );

    const processor = new ImportProcessor(mockResolver);
    const result = await processor.processFile("main.ts");

    expect(result).toContain("// main.ts");
    expect(result).toContain("const util = 1;");
  });
});
