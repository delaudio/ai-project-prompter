import { FileNode, FlowNode, FlowEdge } from '../../../../src/types/FileTypes';
import { useFileStore } from '../store/useFileStore';

const VERTICAL_SPACING = 100;
const HORIZONTAL_SPACING = 200;

export const transformToFlow = (fileNodes: FileNode[]) => {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  const { isExpanded } = useFileStore.getState();
  
  const processNode = (node: FileNode, level: number, index: number) => {
    const flowNode: FlowNode = {
      id: node.id,
      type: 'file',
      position: { 
        x: level * HORIZONTAL_SPACING, 
        y: index * VERTICAL_SPACING 
      },
      data: node
    };
    
    nodes.push(flowNode);
    
    if (node.children && isExpanded(node.id)) {
      node.children.forEach((child, childIndex) => {
        processNode(child, level + 1, childIndex);
        edges.push({
          id: `${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'default'
        });
      });
    }
  };
  
  fileNodes.forEach((node, index) => processNode(node, 0, index));
  
  return { nodes, edges };
};