import React from 'react';
import { Layout } from 'lucide-react';
import { useReactFlow } from 'reactflow';
import { getLayoutedElements } from '../../services/layoutService';

export const AutoLayoutButton = () => {
  const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow();

  const handleAutoLayout = () => {
    const nodes = getNodes();
    const edges = getEdges();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    
    // Fit view after layout with some padding
    setTimeout(() => fitView({ padding: 0.2 }), 0);
  };

  return (
    <button
      onClick={handleAutoLayout}
      className="absolute bottom-20 left-4 z-20 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
      title="Auto Layout"
    >
      <Layout className="w-5 h-5" />
    </button>
  );
};