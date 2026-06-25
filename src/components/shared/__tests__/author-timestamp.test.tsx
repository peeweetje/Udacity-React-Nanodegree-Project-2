import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AuthorTimestamp from '../author-timestamp';

const mockT = (key: string) => key;

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

vi.mock('react-timestamp', () => ({
  default: ({ date }: { date: number }) => <span data-testid="timestamp">{String(date)}</span>,
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {ui}
    </I18nextProvider>
  );
};

describe('AuthorTimestamp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the author name', () => {
    renderWithProviders(<AuthorTimestamp author="Test Author" timestamp={1700000000000} />);
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('renders the timestamp when showClock is true', () => {
    renderWithProviders(<AuthorTimestamp author="Test Author" timestamp={1700000000000} showClock={true} />);
    expect(screen.getByTestId('timestamp')).toBeInTheDocument();
  });

  it('renders the timestamp when showClock is false', () => {
    renderWithProviders(<AuthorTimestamp author="Test Author" timestamp={1700000000000} showClock={false} />);
    expect(screen.getByTestId('timestamp')).toBeInTheDocument();
  });

  it('renders default showClock as true', () => {
    renderWithProviders(<AuthorTimestamp author="Test Author" timestamp={1700000000000} />);
    expect(screen.getByTestId('timestamp')).toBeInTheDocument();
  });
});

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
});