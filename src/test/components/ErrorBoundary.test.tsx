import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../../components/shared/ErrorBoundary';

function ThrowingComponent({ message }: { message: string }) {
  throw new Error(message);
}

function GoodComponent() {
  return <div data-testid="good">All good</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error for expected error boundary triggers
  const originalError = console.error;
  beforeEach(() => {
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === 'string' ? args[0] : '';
      if (msg.includes('Error: Uncaught') || msg.includes('The above error')) return;
      originalError(...args);
    };
  });
  afterEach(() => {
    console.error = originalError;
  });

  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('good')).toBeInTheDocument();
  });

  it('should render fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent message="boom" />
      </ErrorBoundary>
    );
    expect(screen.getByText("Oups, quelque chose s'est mal passé")).toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();
    expect(screen.getByText('Recharger')).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom">Custom error</div>}>
        <ThrowingComponent message="crash" />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(screen.queryByText("Oups, quelque chose s'est mal passé")).not.toBeInTheDocument();
  });
});
