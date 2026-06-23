import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Loading from '../loading';

const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {ui}
    </I18nextProvider>
  );
};

describe('Loading Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the loading spinner', () => {
    renderWithProviders(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the screen reader text', () => {
    renderWithProviders(<Loading />);
    expect(screen.getByText('common.loading')).toBeInTheDocument();
  });

  it('applies the correct ARIA role', () => {
    renderWithProviders(<Loading />);
    expect(screen.getByRole('status')).toHaveAttribute('role', 'status');
  });

  it('applies screen reader only class to loading text', () => {
    renderWithProviders(<Loading />);
    const srText = screen.getByText('common.loading');
    expect(srText).toHaveClass('sr-only');
  });
});

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: {
          common: {
            loading: 'Loading...',
          },
        },
      },
    },
  });
});