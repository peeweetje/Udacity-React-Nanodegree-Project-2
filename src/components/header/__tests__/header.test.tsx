import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Header from '../header';

const mockT = (key: string) => key;
vi.mock('@/components/ui/back-button', () => ({
  default: () => React.createElement('button', { 'data-testid': 'back-button' }),
}));

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        {ui}
      </I18nextProvider>
    </MemoryRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the back button', () => {
    renderWithProviders(<Header />);
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });

  it('renders the home link', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('common.home')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /common.home/i })).toHaveAttribute('href', '/');
  });

  it('renders the dashboard link', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('common.dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /common.dashboard/i })).toHaveAttribute('href', '/home');
  });

  it('renders two navigation links', () => {
    renderWithProviders(<Header />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/home');
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
            home: 'Home',
            dashboard: 'Dashboard',
          },
        },
      },
    },
  });
});