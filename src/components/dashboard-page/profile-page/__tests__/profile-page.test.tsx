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
import ProfilePage from '../profile-page';
import rootReducer from '../../../../redux/reducers';
import * as actions from '../../../../redux/actions';

// Mock i18n
const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

// Mock GSAP - override animation methods but pass through real gsap module
vi.mock('gsap', async () => {
  const actual = await vi.importActual<typeof import('gsap')>('gsap');
  return {
    ...actual,
    context: () => ({ revert: vi.fn() }),
    timeline: () => ({ fromTo: vi.fn() }),
    killTweensOf: vi.fn(),
  };
});

// Mock AnimatedOrbs
vi.mock('../../../../components/animations/animated-orbs', () => ({
  default: () => React.createElement('div', { 'data-testid': 'animated-orbs' }),
}));

// Mock DashboardSidebar to avoid GSAP issues
vi.mock('../../sidebar/dashboard-sidebar', () => ({
  default: () => React.createElement('div', { 'data-testid': 'sidebar' }),
}));

// Mock BackButton to avoid GSAP issues
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

const mockPosts = [
  {
    id: '1',
    title: 'Post 1',
    author: 'Petra Vos',
    body: 'Body 1',
    category: 'react',
    voteScore: 10,
    comments: [
      { id: 'c1', author: 'Petra Vos', body: 'My comment', timestamp: Date.now() - 300000, deleted: false, parentDeleted: false },
    ],
    timestamp: Date.now() - 100000,
    deleted: false,
  },
  {
    id: '2',
    title: 'Post 2',
    author: 'Petra Vos',
    body: 'Body 2',
    category: 'redux',
    voteScore: 5,
    comments: [],
    timestamp: Date.now() - 200000,
    deleted: false,
  },
];

const mockCategories = [
  { path: 'react', name: 'React' },
  { path: 'redux', name: 'Redux' },
];

const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      posts: { posts: mockPosts },
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

describe('ProfilePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the profile title', () => {
      renderWithProviders(<ProfilePage />);
      expect(screen.getByText('dashboard.profile')).toBeInTheDocument();
    });

    it('renders the profile avatar with user name', () => {
      renderWithProviders(<ProfilePage />);
      expect(screen.getByText('Petra Vos')).toBeInTheDocument();
    });

    it('renders profile info section', () => {
      renderWithProviders(<ProfilePage />);
      expect(screen.getByText(/petravos@example.com/)).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('dispatches fetchPosts on component mount', async () => {
      renderWithProviders(<ProfilePage />);
      await waitFor(() => {
        expect(actions.fetchPosts).toHaveBeenCalled();
      });
    });
  });

  describe('User Stats', () => {
    it('displays posts count label', async () => {
      renderWithProviders(<ProfilePage />);
      await waitFor(() => {
        expect(screen.getByText(/dashboard.posts-count/)).toBeInTheDocument();
      });
    });

    it('displays comments count label', async () => {
      renderWithProviders(<ProfilePage />);
      await waitFor(() => {
        expect(screen.getByText(/dashboard.comments-made/)).toBeInTheDocument();
      });
    });

    it('displays total votes label', async () => {
      renderWithProviders(<ProfilePage />);
      await waitFor(() => {
        expect(screen.getByText(/dashboard.votes-received/)).toBeInTheDocument();
      });
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
            home: 'Home',
            profile: 'Profile',
            'member-since': 'Member since',
            'posts-count': 'posts',
            'comments-made': 'comments',
            'votes-received': 'votes',
          },
        },
      },
    },
  });
});