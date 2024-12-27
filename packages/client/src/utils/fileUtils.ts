import { ImportProcessor } from '../services/importParser/processor';
import { ImportResolver } from '../services/importParser/resolver';

export const getFolderContent = (node: any): string => {
  let content = '';
  
  const processNode = (node: any, indent: number = 0) => {
    const indentation = '  '.repeat(indent);
    content += `${indentation}${node.name}\n`;
    
    if (node.type === 'file' && node.metadata?.content) {
      content += `${indentation}\`\`\`${node.metadata.type || ''}\n`;
      content += `${node.metadata.content}\n`;
      content += `${indentation}\`\`\`\n\n`;
    }
    
    if (node.children) {
      node.children.forEach((child: any) => {
        processNode(child, indent + 1);
      });
    }
  };
  
  processNode(node);
  return content;
};

export const getFileContentWithImports = async (
  node: any,
  adapter: any
): Promise<string> => {
  if (!node.metadata?.content) {
    return getFolderContent(node);
  }

  const resolver = new ImportResolver(adapter);
  const processor = new ImportProcessor(resolver);
  
  try {
    const content = await processor.processFile(node.path);
    return content;
  } catch (error) {
    console.error('Error processing imports:', error);
    return getFolderContent(node);
  }
};