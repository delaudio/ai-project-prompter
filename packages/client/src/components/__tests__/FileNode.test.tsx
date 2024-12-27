import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { FileNode } from '../FileExplorer/FileNode';
import { useFileStore } from '../../store/useFileStore';

// Mock ReactFlow's Handle component
vi.mock('reactflow', () => ({
  Handle: () => null,
  Position: { Top: 'top', Bottom: 'bottom' }
}));

describe('FileNode', () => {
  it('should render a file node', () => {
    const mockFile = {
      id: 'test',
      name: 'test.js',
      type: 'file',
      path: '/test.js'
    };

    render(<FileNode data={mockFile} />);
    expect(screen.getByText('test.js')).toBeInTheDocument();
  });

  it('should render a folder node with expand/collapse button', () => {
    const mockFolder = {
      id: 'test',
      name: 'test',
      type: 'folder',
      path: '/test'
    };

    render(<FileNode data={mockFolder} />);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy folder content/i })).toBeInTheDocument();
  });

  it('should handle folder expansion', () => {
    const mockFolder = {
      id: 'test',
      name: 'test',
      type: 'folder',
      path: '/test'
    };

    render(<FileNode data={mockFolder} />);
    fireEvent.click(screen.getByText('test'));

    const store = useFileStore.getState();
    expect(store.isExpanded('test')).toBe(true);
  });
});