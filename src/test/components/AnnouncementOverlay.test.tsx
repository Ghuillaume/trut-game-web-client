import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AnnouncementOverlay } from '../../components/game/AnnouncementOverlay';

describe('AnnouncementOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render announcement text', () => {
    render(<AnnouncementOverlay text="Alice a truté !" type="trut" onDone={vi.fn()} />);
    expect(screen.getByText('Alice a truté !')).toBeInTheDocument();
  });

  it('should render trut icon for trut type', () => {
    render(<AnnouncementOverlay text="Test" type="trut" onDone={vi.fn()} />);
    expect(screen.getByText('🤜')).toBeInTheDocument();
  });

  it('should render deux-pareilles icon', () => {
    render(<AnnouncementOverlay text="Test" type="deux-pareilles" onDone={vi.fn()} />);
    expect(screen.getByText('✌️')).toBeInTheDocument();
  });

  it('should render brellan icon', () => {
    render(<AnnouncementOverlay text="Test" type="brellan" onDone={vi.fn()} />);
    expect(screen.getByText('🃏')).toBeInTheDocument();
  });

  it('should render pourri icon', () => {
    render(<AnnouncementOverlay text="Pourri !" type="pourri" onDone={vi.fn()} />);
    expect(screen.getByText('💀')).toBeInTheDocument();
  });

  it('should apply correct CSS class for type', () => {
    const { container } = render(
      <AnnouncementOverlay text="Test" type="deux-pareilles" onDone={vi.fn()} />
    );
    expect(container.querySelector('.announcement-deux-pareilles')).toBeTruthy();
  });

  it('should call onDone after animation completes', () => {
    const onDone = vi.fn();
    render(<AnnouncementOverlay text="Test" type="trut" onDone={onDone} />);
    expect(onDone).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(2800); });

    expect(onDone).toHaveBeenCalledOnce();
  });

  it('should transition through enter → visible → exit phases', () => {
    const { container } = render(
      <AnnouncementOverlay text="Test" type="trut" onDone={vi.fn()} />
    );

    expect(container.querySelector('.announcement-enter')).toBeTruthy();

    act(() => { vi.advanceTimersByTime(60); });
    expect(container.querySelector('.announcement-visible')).toBeTruthy();

    act(() => { vi.advanceTimersByTime(2200); });
    expect(container.querySelector('.announcement-exit')).toBeTruthy();
  });
});
