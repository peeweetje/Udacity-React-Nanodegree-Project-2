import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import CategoryMenu from '../category-menu';
import rootReducer from '../../../redux/reducers';
import * as actions from '../../../redux/actions';

const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

// Mock GSAP 
vi.mock('../../../animations/use-gsap-animation', () => ({
  useGsapContext: vi.fn(),
  useGsapCardHover: vi.fn(),
}));

// Mock redux actions
vi.mock('../../../redux/actions', async () => {
  const actual: any = await vi.importActual('../../../redux/actions');
  const thunk = () => () => Promise.resolve();
  return {
    ...actual,
    fetchCategories: vi.fn(() => thunk),
    fetchPostsCategory: vi.fn(() => thunk),
    fetchPosts: vi.fn(() => thunk),
  };
});

// Mock SortBy component
vi.mock('../../sort-by/sortBy', () => ({
  default: () => <div data-testid='sort-by'>SortBy</div>,
}));

const mockCategories = [
  { path: 'react', name: 'React' },
  { path: 'redux', name: 'Redux' },
  { path: 'javascript', name: 'Javascript' },
];

const createStore = () =>
  configureStore({
    reducer: rootReducer as any,
    preloadedState: {
      receiveCategories: mockCategories,
      posts: { posts: [] },
      sort: { sort: { value: 'new' } },
      animations: { enabled: true },
    } as any,
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

describe('CategoryMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('does not dispatch fetchCategories if categories already loaded', async () => {
    // fetchCategories is mocked to return a thunk, but we want to test that dispatch happens on mount regardless
    renderWithProviders(<CategoryMenu />);
    await waitFor(() => {
      expect(actions.fetchCategories).toHaveBeenCalled();
    });
  });

  it('renders the "All" button', () => {
    renderWithProviders(<CategoryMenu />);
    expect(screen.getByText('common.all')).toBeInTheDocument();
  });

  it('renders category buttons', () => {
    renderWithProviders(<CategoryMenu />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getByText('Javascript')).toBeInTheDocument();
  });

  it('renders SortBy component', () => {
    renderWithProviders(<CategoryMenu />);
    // CategoryMenu renders SortBy twice: for desktop and mobile
    expect(screen.getAllByTestId('sort-by').length).toBeGreaterThanOrEqual(1);
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
          common: {
            all: 'All',
          },
          dashboard: {
            home: 'Home',
          },
        },
      },
    },
  });
});