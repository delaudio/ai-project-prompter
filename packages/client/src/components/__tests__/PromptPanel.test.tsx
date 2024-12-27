import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { PromptPanel } from '../PromptPanel';
import { useFileStore } from '../../store/useFileStore';

describe('PromptPanel', () => {
  it('should not render when panel is closed', () => {
    useFileStore.setState({ isPromptPanelOpen: false });
    render(<PromptPanel />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should render textarea when panel is open', () => {
    useFileStore.setState({ isPromptPanelOpen: true });
    render(<PromptPanel />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should update content when typing', () => {
    useFileStore.setState({ isPromptPanelOpen: true });
    render(<PromptPanel />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New content' } });
    
    expect(useFileStore.getState().promptContent).toBe('New content');
  });

  it('should clear content when clicking clear button', () => {
    useFileStore.setState({ 
      isPromptPanelOpen: true,
      promptContent: 'Initial content'
    });
    
    render(<PromptPanel />);
    fireEvent.click(screen.getByRole('button', { name: /clear prompt/i }));
    
    expect(useFileStore.getState().promptContent).toBe('');
  });

  it('should copy content to clipboard', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined)
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    useFileStore.setState({ 
      isPromptPanelOpen: true,
      promptContent: 'Test content'
    });
    
    render(<PromptPanel />);
    fireEvent.click(screen.getByRole('button', { name: /copy prompt content/i }));
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith('Test content');
  });
});