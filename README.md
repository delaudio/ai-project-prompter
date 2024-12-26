# AI Project Prompter

A React component for exploring your project files and crafting AI prompts with their contents.

## Features

- 🤖 Streamlined AI prompt creation from project files
- 📁 Visual file system explorer with auto-layout
- 🔄 One-click file content insertion into prompts
- 📝 Integrated prompt editor with AI provider formatting
- 🎯 TypeScript support with full type safety
- ⚡ Lightweight and performant
- 🔍 Quick file search
- 🎨 Beautiful and intuitive UI
- 📋 Smart copy with AI provider formatting
- 🔌 Extensible file system adapter

## Installation

```bash
npm install ai-project-prompter
```

## Usage

```tsx
import { ProjectPrompter } from 'ai-project-prompter';

const files = [
  {
    id: 'src',
    type: 'folder',
    name: 'src',
    path: '/src',
    children: [
      {
        id: 'app',
        type: 'file',
        name: 'App.tsx',
        path: '/src/App.tsx',
        metadata: {
          size: 1234,
          modified: new Date(),
          type: 'typescript',
          content: '// Your file content here'
        }
      }
    ]
  }
];

function App() {
  return (
    <ProjectPrompter
      files={files}
      onFileSelect={(file) => console.log('Selected:', file)}
      onPromptChange={(content) => console.log('Prompt:', content)}
      aiProvider="openai"
    />
  );
}
```

## Props

| Prop             | Type                                | Description                                   |
| ---------------- | ----------------------------------- | --------------------------------------------- |
| files            | FileNode[]                          | The project file system structure to display  |
| className?       | string                              | Optional class name for the container         |
| onFileSelect?    | (file: FileNode) => void            | Optional callback when a file is selected     |
| onPromptChange?  | (content: string) => void           | Optional callback when prompt content changes |
| initialPrompt?   | string                              | Initial prompt content                        |
| showPromptPanel? | boolean                             | Whether to show the prompt panel by default   |
| aiProvider?      | 'openai' \| 'anthropic' \| 'custom' | Optional AI provider for prompt formatting    |

## Types

```typescript
interface FileNode {
  id: string;
  type: 'file' | 'folder';
  name: string;
  path: string;
  children?: FileNode[];
  metadata?: {
    size: number;
    modified: Date;
    type: string;
    content?: string;
  };
}
```

## Custom File System Adapter

You can provide your own file system adapter to customize how files are read:

```typescript
import { setFileSystemAdapter } from 'ai-project-prompter';

class CustomAdapter implements FileSystemAdapter {
  async readDirectory(path: string): Promise<FileNode[]> {
    // Your custom implementation
    return [];
  }
}

setFileSystemAdapter(new CustomAdapter());
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Features in Detail

### AI Provider Support

- OpenAI: Default formatting
- Anthropic: Formats prompts with Human/Assistant structure
- Custom: Use your own formatting

### File Explorer

- Visual tree structure
- Auto-layout for better visualization
- Quick search functionality
- File/folder metadata display
- One-click content copying

### Prompt Panel

- Integrated editor
- Smart copy with AI provider formatting
- File content insertion
- Markdown support
- Syntax highlighting

## License

MIT © [Federico Del Gaudio](https://federicodelgaudio.com)
