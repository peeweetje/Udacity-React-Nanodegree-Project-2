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
import SettingsPage from '../settings-page';
import rootReducer from '../../../../redux/reducers';

// Mock i18n
const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

// Mock GSAP animations
vi.mock('../../../../animations/use-gsap-animation', () => ({
  useGsapContext: vi.fn(),
  useGsapCardHover: vi.fn(),
}));

vi.mock('../../../../animations/card-animations', () => ({
  animateCards: vi.fn(),
}));

// Mock child settings components
vi.mock('../language-settings', () => ({
  default: () => React.createElement('div', { 'data-testid': 'language-settings' }),
}));

vi.mock('../theme-settings', () => ({
  default: () => React.createElement('div', { 'data-testid': 'theme-settings' }),
}));

vi.mock('../animation-settings', () => ({
  default: () => React.createElement('div', { 'data-testid': 'animation-settings' }),
}));

// Mock DashboardSidebar
vi.mock('../../sidebar/dashboard-sidebar', () => ({
  default: () => React.createElement('div', { 'data-testid': 'sidebar' }),
}));

// Mock BackButton
vi.mock('@/components/ui/back-button', () => ({
  default: () => React.createElement('button', { 'data-testid': 'back-button' }),
}));

// Mock redux actions
vi.mock('../../../../redux/actions', async () => {
  const actual: any = await vi.importActual('../../../../redux/actions');
  const thunk = () => () => Promise.resolve();
  return {
    ...actual,
    fetchPosts: vi.fn(() => thunk),
    fetchCategories: vi.fn(() => thunk),
  };
});

const mockCategories = [
  { path: 'react', name: 'React' },
  { path: 'redux', name: 'Redux' },
];

const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      posts: { posts: [] },
      getComments: { comments: [] },
      receiveCategories: mockCategories,
      sort: { sort: { value: 'new' } },
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

describe('SettingsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the settings title', () => {
      renderWithProviders(<SettingsPage />);
      expect(screen.getByText('dashboard.settings')).toBeInTheDocument();
    });

    it('renders the sidebar', () => {
      renderWithProviders(<SettingsPage />);
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('renders the back button', () => {
      renderWithProviders(<SettingsPage />);
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    it('renders all settings cards', () => {
      renderWithProviders(<SettingsPage />);
      expect(screen.getByTestId('language-settings')).toBeInTheDocument();
      expect(screen.getByTestId('theme-settings')).toBeInTheDocument();
      expect(screen.getByTestId('animation-settings')).toBeInTheDocument();
    });
  });

});

// Initialize i18n for tests
beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: {
          dashboard: {
            settings: 'Settings',
          },
        },
      },
    },
  });
});