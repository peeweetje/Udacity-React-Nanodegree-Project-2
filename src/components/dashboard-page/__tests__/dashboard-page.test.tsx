import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import DashboardPage from '../dashboard-page';
import rootReducer from '../../../redux/reducers';
import * as actions from '../../../redux/actions';

// Mock i18n so t(key) returns the key
const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

// Mock GSAP animations
vi.mock('../../animations/use-gsap-animation', () => ({
  useGsapContext: vi.fn(),
  useGsapTimeline: vi.fn(),
  useGsapCardHover: vi.fn(),
}));

vi.mock('../../animations/card-animations', () => ({
  animateCards: vi.fn(),
  animateListItems: vi.fn(),
  animateEmptyState: vi.fn(),
}));

// Mock redux actions
vi.mock('../../../redux/actions', async () => {
  const actual: any = await vi.importActual('../../../redux/actions');
  const thunk = () => () => Promise.resolve();
  return {
    ...actual,
    fetchPosts: vi.fn(() => thunk),
    fetchCategories: vi.fn(() => thunk),
    fetchComments: vi.fn(() => thunk),
    setPosts: vi.fn(() => thunk),
  };
});

const mockPosts = [
  {
    id: '1',
    title: 'Test Post 1',
    author: 'Author 1',
    body: 'Body 1',
    category: 'react',
    voteScore: 10,
    comments: [{ id: 'c1', body: 'Comment 1' }, { id: 'c2', body: 'Comment 2' }],
    timestamp: Date.now() - 100000,
    deleted: false,
  },
  {
    id: '2',
    title: 'Test Post 2',
    author: 'Author 2',
    body: 'Body 2',
    category: 'redux',
    voteScore: -5,
    comments: [{ id: 'c3', body: 'Comment 3' }],
    timestamp: Date.now() - 200000,
    deleted: false,
  },
  {
    id: '3',
    title: 'Deleted Post',
    author: 'Author 3',
    body: 'Body 3',
    category: 'testing',
    voteScore: 0,
    comments: [],
    timestamp: Date.now() - 300000,
    deleted: true,
  },
];

const mockCategories = [
  { path: 'react', name: 'React' },
  { path: 'redux', name: 'Redux' },
  { path: 'testing', name: 'Testing' },
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

describe('DashboardPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the sidebar', () => {
      renderWithProviders(<DashboardPage />);
      expect(screen.getByText('dashboard.home')).toBeInTheDocument();
    });

    it('renders the search input', () => {
      renderWithProviders(<DashboardPage />);
      expect(screen.getByPlaceholderText('dashboard.search-placeholder')).toBeInTheDocument();
    });

    it('renders the stats grid', () => {
      renderWithProviders(<DashboardPage />);
      expect(screen.getByText('dashboard.active-topics')).toBeInTheDocument();
      expect(screen.getByText('dashboard.new-comments')).toBeInTheDocument();
      expect(screen.getByText('dashboard.trending-categories')).toBeInTheDocument();
      expect(screen.getByText('dashboard.total-votes')).toBeInTheDocument();
    });

    it('renders the recent activity section', () => {
      renderWithProviders(<DashboardPage />);
      expect(screen.getByText('dashboard.recent-activity')).toBeInTheDocument();
    });

    it('displays the bell icon (notifications link)', () => {
      renderWithProviders(<DashboardPage />);
      const notificationLink = screen.getByRole('link', { name: /notifications/i });
      expect(notificationLink).toBeInTheDocument();
      expect(notificationLink).toHaveAttribute('href', '/notifications');
    });
  });

  describe('Data Fetching', () => {
    it('dispatches fetchPosts on component mount', async () => {
      renderWithProviders(<DashboardPage />);
      await waitFor(() => {
        expect(actions.fetchPosts).toHaveBeenCalled();
      });
    });

    it('dispatches fetchCategories on component mount', async () => {
      renderWithProviders(<DashboardPage />);
      await waitFor(() => {
        expect(actions.fetchCategories).toHaveBeenCalled();
      });
    });
  });

  describe('Stats Calculation', () => {
    it('calculates active posts count excluding deleted posts', async () => {
      renderWithProviders(<DashboardPage />);
      await waitFor(() => {
        const topicsStat = screen.getByText('dashboard.active-topics');
        expect(topicsStat).toBeInTheDocument();
      });
    });

    it('calculates total comments across all active posts', async () => {
      renderWithProviders(<DashboardPage />);
      await waitFor(() => {
        const commentsStat = screen.getByText('dashboard.new-comments');
        expect(commentsStat).toBeInTheDocument();
      });
    });

    it('calculates total votes across all active posts', async () => {
      renderWithProviders(<DashboardPage />);
      await waitFor(() => {
        const votesStat = screen.getByText('dashboard.total-votes');
        expect(votesStat).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('filters posts by search query', async () => {
      renderWithProviders(<DashboardPage />);
      const searchInput = screen.getByPlaceholderText('dashboard.search-placeholder');
      await userEvent.type(searchInput, 'Post 1');
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    it('shows no results when search has no matches', async () => {
      renderWithProviders(<DashboardPage />);
      const searchInput = screen.getByPlaceholderText('dashboard.search-placeholder');
      await userEvent.type(searchInput, 'nonexistent');
      expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument();
    });
  });

  describe('Recent Activity', () => {
    it('displays recent activities sorted by timestamp', async () => {
      renderWithProviders(<DashboardPage />);
      await waitFor(() => {
        expect(screen.getByText('Test Post 1')).toBeInTheDocument();
        expect(screen.getByText('Test Post 2')).toBeInTheDocument();
      });
    });

    it('does not display deleted posts in recent activity', async () => {
      renderWithProviders(<DashboardPage />);
      await waitFor(() => {
        expect(screen.queryByText('Deleted Post')).not.toBeInTheDocument();
      });
    });

    it('limits recent activity to 5 items', async () => {
      const manyPosts = Array.from({ length: 10 }, (_, i) => ({
        id: `post-${i}`,
        title: `Post ${i}`,
        author: `Author ${i}`,
        body: `Body ${i}`,
        category: 'react',
        voteScore: i,
        comments: [],
        timestamp: Date.now() - i * 100000,
        deleted: false,
      }));

      const store = createStore({
        posts: { posts: manyPosts },
        receiveCategories: mockCategories,
      });

      renderWithProviders(<DashboardPage />, { store });

      await waitFor(() => {
        for (let i = 0; i < 5; i++) {
          expect(screen.getByText(`Post ${i}`)).toBeInTheDocument();
        }
        for (let i = 5; i < 10; i++) {
          expect(screen.queryByText(`Post ${i}`)).not.toBeInTheDocument();
        }
      });
    });
  });

  describe('Notification Badge', () => {
    it('shows notification badge when there are active posts', async () => {
      renderWithProviders(<DashboardPage />);
      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
      const notificationLink = header!.querySelector('a[href="/notifications"]');
      expect(notificationLink).toBeInTheDocument();
      const badge = notificationLink!.querySelector('.bg-red-500');
      expect(badge).toHaveTextContent('2');
    });

    it('shows 9+ when there are more than 9 active posts', async () => {
      const manyPosts = Array.from({ length: 12 }, (_, i) => ({
        id: `post-${i}`,
        title: `Post ${i}`,
        author: `Author ${i}`,
        body: `Body ${i}`,
        category: 'react',
        voteScore: 1,
        comments: [],
        timestamp: Date.now() - i * 100000,
        deleted: false,
      }));

      const store = createStore({
        posts: { posts: manyPosts },
        receiveCategories: mockCategories,
      });

      renderWithProviders(<DashboardPage />, { store });

      await waitFor(() => {
        expect(screen.getByText('9+')).toBeInTheDocument();
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
            'search-placeholder': 'Search',
            'active-topics': 'Active Topics',
            'new-comments': 'New Comments',
            'trending-categories': 'Trending Categories',
            'total-votes': 'Total Votes',
            'recent-activity': 'Recent Activity',
          },
        },
      },
    },
  });
});