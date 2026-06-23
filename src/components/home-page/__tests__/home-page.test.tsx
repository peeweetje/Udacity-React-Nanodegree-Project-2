import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HomePage from '../home-page';
import rootReducer from '../../../redux/reducers';

const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

vi.mock('../../animations/home-animations', () => ({
  animateArrow: vi.fn(),
  animateTitle: vi.fn(),
  animatePlusIcon: vi.fn(),
  animateOrbs: vi.fn(),
  animateCards: vi.fn(),
}));

vi.mock('../home-page-button', () => ({
  default: ({ label, to, showArrow, variant }: { label: string; to: string; showArrow?: boolean; variant?: string }) => (
    <a href={to} data-testid="home-page-button" data-variant={variant}>
      {label} {showArrow ? '→' : ''}
    </a>
  ),
}));

vi.mock('../home-page-card', () => ({
  default: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="home-page-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      animations: { enabled: true },
      ...preloadedState,
    },
  });

const renderWithProviders = (
  ui: React.ReactElement,
  { store = createStore() }: { store?: any } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          {ui}
        </I18nextProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('HomePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the main title', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('common.git-talks')).toBeInTheDocument();
  });

  it('renders the welcome message', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('common.welcome-message')).toBeInTheDocument();
  });

  it('renders three home page buttons', () => {
    renderWithProviders(<HomePage />);
    const buttons = screen.getAllByTestId('home-page-button');
    expect(buttons).toHaveLength(3);
  });

  it('renders buttons with correct labels and destinations', () => {
    renderWithProviders(<HomePage />);
    const buttons = screen.getAllByTestId('home-page-button');

    expect(buttons[0]).toHaveAttribute('href', '/posts');
    expect(buttons[0]).toHaveTextContent('common.view-posts');

    expect(buttons[1]).toHaveAttribute('href', '/addpost');
    expect(buttons[1]).toHaveTextContent('common.create-post');

    expect(buttons[2]).toHaveAttribute('href', '/home');
    expect(buttons[2]).toHaveTextContent('common.dashboard');
  });

  it('renders three home page cards', () => {
    renderWithProviders(<HomePage />);
    const cards = screen.getAllByTestId('home-page-card');
    expect(cards).toHaveLength(3);
  });

  it('renders cards with correct content', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('common.discuss')).toBeInTheDocument();
    expect(screen.getByText('common.discuss-desc')).toBeInTheDocument();
    expect(screen.getByText('common.browse')).toBeInTheDocument();
    expect(screen.getByText('common.browse-desc')).toBeInTheDocument();
    expect(screen.getByText('common.share')).toBeInTheDocument();
    expect(screen.getByText('common.share-desc')).toBeInTheDocument();
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
            'git-talks': 'Git Talks',
            'welcome-message': 'Welcome to Git Talks',
            'view-posts': 'View Posts',
            'create-post': 'Create Post',
            dashboard: 'Dashboard',
            discuss: 'Discuss',
            'discuss-desc': 'Join discussions',
            browse: 'Browse',
            'browse-desc': 'Explore posts',
            share: 'Share',
            'share-desc': 'Create content',
          },
        },
      },
    },
  });
});