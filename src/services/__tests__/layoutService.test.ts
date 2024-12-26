import { describe, it, expect } from 'vitest';
import { getLayoutedElements } from '../layoutService';
import { Node, Edge } from 'reactflow';

describe('layoutService', () => {
  describe('getLayoutedElements', () => {
    it('should layout a simple tree structure', () => {
      const nodes: Node[] = [
        { id: 'root', position: { x: 0, y: 0 }, data: {} },
        { id: 'child1', position: { x: 0, y: 0 }, data: {} },
        { id: 'child2', position: { x: 0, y: 0 }, data: {} }
      ];

      const edges: Edge[] = [
        { id: 'e1', source: 'root', target: 'child1' },
        { id: 'e2', source: 'root', target: 'child2' }
      ];

      const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges);

      // Root should be at depth 0
      expect(layoutedNodes[0].position.x).toBe(0);

      // Children should be at depth 1
      expect(layoutedNodes[1].position.x).toBeGreaterThan(0);
      expect(layoutedNodes[2].position.x).toBeGreaterThan(0);

      // Children should be vertically separated
      expect(layoutedNodes[1].position.y).not.toBe(layoutedNodes[2].position.y);
    });

    it('should handle nodes without connections', () => {
      const nodes: Node[] = [
        { id: 'isolated1', position: { x: 0, y: 0 }, data: {} },
        { id: 'isolated2', position: { x: 0, y: 0 }, data: {} }
      ];

      const { nodes: layoutedNodes } = getLayoutedElements(nodes, []);

      // Both nodes should be at depth 0
      expect(layoutedNodes[0].position.x).toBe(0);
      expect(layoutedNodes[1].position.x).toBe(0);

      // Nodes should be vertically separated
      expect(layoutedNodes[0].position.y).not.toBe(layoutedNodes[1].position.y);
    });
  });
});