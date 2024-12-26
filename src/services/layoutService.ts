import { Node, Edge } from 'reactflow';

const VERTICAL_SPACING = 100;
const HORIZONTAL_SPACING = 250;

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  // Create a map of node depths
  const nodeDepths = new Map<string, number>();
  const nodeChildren = new Map<string, string[]>();
  
  // Initialize with root nodes (nodes with no incoming edges)
  const rootNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id)
  );
  
  rootNodes.forEach(node => nodeDepths.set(node.id, 0));
  
  // Build node relationships
  edges.forEach(edge => {
    const children = nodeChildren.get(edge.source) || [];
    children.push(edge.target);
    nodeChildren.set(edge.source, children);
  });
  
  // Calculate depths through traversal
  const calculateDepth = (nodeId: string, depth: number) => {
    nodeDepths.set(nodeId, Math.max(depth, nodeDepths.get(nodeId) || 0));
    const children = nodeChildren.get(nodeId) || [];
    children.forEach(childId => calculateDepth(childId, depth + 1));
  };
  
  rootNodes.forEach(node => calculateDepth(node.id, 0));
  
  // Group nodes by depth
  const nodesByDepth = new Map<number, string[]>();
  nodeDepths.forEach((depth, nodeId) => {
    const depthNodes = nodesByDepth.get(depth) || [];
    depthNodes.push(nodeId);
    nodesByDepth.set(depth, depthNodes);
  });
  
  // Position nodes
  const layoutedNodes = nodes.map(node => {
    const depth = nodeDepths.get(node.id) || 0;
    const depthNodes = nodesByDepth.get(depth) || [];
    const index = depthNodes.indexOf(node.id);
    
    return {
      ...node,
      position: {
        x: depth * HORIZONTAL_SPACING,
        y: index * VERTICAL_SPACING
      }
    };
  });
  
  return { nodes: layoutedNodes, edges };
};