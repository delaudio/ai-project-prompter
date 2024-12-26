import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { AutoLayoutButton } from '../FileExplorer/AutoLayoutButton';

// Mock ReactFlow hook
vi.mock('reactflow', () => ({
  useReactFlow: () => ({
    getNodes: () => [],
    getEdges: () => [],
    setNodes: vi.fn(),
    setEdges: vi.fn(),
    fitView: vi.fn()
  })
}));

describe('AutoLayoutButton', () => {
  it('should render auto layout button', () => {
    render(<AutoLayoutButton />);
    expect(screen.getByRole('button', { name: /auto layout/i })).toBeInTheDocument();
  });

  it('should trigger layout when clicked', () => {
    const mockSetNodes = vi.fn();
    const mockSetEdges = vi.fn();
    const mockFitView = vi.fn();

    vi.mock('reactflow', () => ({
      useReactFlow: () => ({
        getNodes: () => [{ id: 'test', position: { x: 0, y: 0 }, data: {} }],
        getEdges: () => [],
        setNodes: mockSetNodes,
        setEdges: mockSetEdges,
        fitView: mockFitView
      })
    }));

    render(<AutoLayoutButton />);
    fireEvent.click(screen.getByRole('button', { name: /auto layout/i }));

    expect(mockSetNodes).toHaveBeenCalled();
    expect(mockSetEdges).toHaveBeenCalled();
    // FitView is called after a timeout
    setTimeout(() => {
      expect(mockFitView).toHaveBeenCalled();
    }, 0);
  });
});