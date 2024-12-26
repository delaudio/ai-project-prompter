import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { AutoLayoutButton } from '../FileExplorer/AutoLayoutButton';
import * as ReactFlow from 'reactflow';

// Mock ReactFlow hook
vi.mock('reactflow', async () => {
  const actual = await vi.importActual('reactflow');
  return {
    ...actual,
    useReactFlow: vi.fn(() => ({
      getNodes: () => [],
      getEdges: () => [],
      setNodes: vi.fn(),
      setEdges: vi.fn(),
      fitView: vi.fn()
    }))
  };
});

describe('AutoLayoutButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render auto layout button', () => {
    render(<AutoLayoutButton />);
    expect(screen.getByRole('button', { name: /auto layout/i })).toBeInTheDocument();
  });

  it('should trigger layout when clicked', () => {
    const mockSetNodes = vi.fn();
    const mockSetEdges = vi.fn();
    const mockFitView = vi.fn();

    vi.spyOn(ReactFlow, 'useReactFlow').mockImplementation(() => ({
      getNodes: () => [{ id: 'test', position: { x: 0, y: 0 }, data: {} }],
      getEdges: () => [],
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
      fitView: mockFitView
    }));

    render(<AutoLayoutButton />);
    fireEvent.click(screen.getByRole('button', { name: /auto layout/i }));

    expect(mockSetNodes).toHaveBeenCalled();
    expect(mockSetEdges).toHaveBeenCalled();
    
    vi.runAllTimers();
    expect(mockFitView).toHaveBeenCalled();
  });
});