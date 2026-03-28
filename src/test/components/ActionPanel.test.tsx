import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionPanel } from '../../components/game/ActionPanel';

const base = {
  selectedCard: null as string | null, canPlayCard: false, canTrut: false,
  canCall: false, canFold: false, canBrellan: false, canDeuxPareilles: false,
  isMyTurn: false,
  onPlayCard: vi.fn(), onTrut: vi.fn(), onCall: vi.fn(), onFold: vi.fn(),
  onBrellan: vi.fn(), onDeuxPareilles: vi.fn(),
};

describe('ActionPanel', () => {
  it('should show waiting when not my turn', () => {
    render(<ActionPanel {...base} />);
    expect(screen.getByText(/En attente/)).toBeInTheDocument();
  });
  it('should show play card button', () => {
    render(<ActionPanel {...base} canPlayCard isMyTurn />);
    expect(screen.getByTestId('play-card-btn')).toBeInTheDocument();
  });
  it('should disable play without selected card', () => {
    render(<ActionPanel {...base} canPlayCard isMyTurn />);
    expect(screen.getByTestId('play-card-btn')).toBeDisabled();
  });
  it('should enable play with selected card', () => {
    render(<ActionPanel {...base} canPlayCard isMyTurn selectedCard="SEVEN_HEARTS" />);
    expect(screen.getByTestId('play-card-btn')).not.toBeDisabled();
  });
  it('should show trut button', () => {
    render(<ActionPanel {...base} canTrut isMyTurn />);
    expect(screen.getByTestId('trut-btn')).toBeInTheDocument();
  });
  it('should show call and fold', () => {
    render(<ActionPanel {...base} canCall canFold isMyTurn />);
    expect(screen.getByTestId('call-btn')).toBeInTheDocument();
    expect(screen.getByTestId('fold-btn')).toBeInTheDocument();
  });
  it('should call onTrut', async () => {
    const user = userEvent.setup();
    const onTrut = vi.fn();
    render(<ActionPanel {...base} canTrut isMyTurn onTrut={onTrut} />);
    await user.click(screen.getByTestId('trut-btn'));
    expect(onTrut).toHaveBeenCalledOnce();
  });
  it('should call onCall', async () => {
    const user = userEvent.setup();
    const onCall = vi.fn();
    render(<ActionPanel {...base} canCall isMyTurn onCall={onCall} />);
    await user.click(screen.getByTestId('call-btn'));
    expect(onCall).toHaveBeenCalledOnce();
  });
  it('should call onFold', async () => {
    const user = userEvent.setup();
    const onFold = vi.fn();
    render(<ActionPanel {...base} canFold isMyTurn onFold={onFold} />);
    await user.click(screen.getByTestId('fold-btn'));
    expect(onFold).toHaveBeenCalledOnce();
  });
  it('should show brellan button', () => {
    render(<ActionPanel {...base} canBrellan isMyTurn />);
    expect(screen.getByTestId('brellan-btn')).toBeInTheDocument();
  });
  it('should call onBrellan', async () => {
    const user = userEvent.setup();
    const onBrellan = vi.fn();
    render(<ActionPanel {...base} canBrellan isMyTurn onBrellan={onBrellan} />);
    await user.click(screen.getByTestId('brellan-btn'));
    expect(onBrellan).toHaveBeenCalledOnce();
  });
  it('should show deux pareilles button', () => {
    render(<ActionPanel {...base} canDeuxPareilles isMyTurn />);
    expect(screen.getByTestId('deux-pareilles-btn')).toBeInTheDocument();
  });
  it('should call onDeuxPareilles', async () => {
    const user = userEvent.setup();
    const onDeuxPareilles = vi.fn();
    render(<ActionPanel {...base} canDeuxPareilles isMyTurn onDeuxPareilles={onDeuxPareilles} />);
    await user.click(screen.getByTestId('deux-pareilles-btn'));
    expect(onDeuxPareilles).toHaveBeenCalledOnce();
  });
  it('should show trut button even when not my turn', () => {
    render(<ActionPanel {...base} canTrut />);
    expect(screen.getByTestId('trut-btn')).toBeInTheDocument();
  });
  it('should show brellan button even when not my turn', () => {
    render(<ActionPanel {...base} canBrellan />);
    expect(screen.getByTestId('brellan-btn')).toBeInTheDocument();
  });
});
