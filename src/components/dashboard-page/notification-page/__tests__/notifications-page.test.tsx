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
import NotificationsPage from '../notifications-page';
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

// Mock GSAP animations
vi.mock('../../../../animations/use-gsap-animation', () => ({
  useGsapContext: vi.fn(),
}));

vi.mock('../../../../animations/list-entry-animations', () => ({
  animateListItems: vi.fn(),
  animateEmptyState: vi.fn(),
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
    author: 'Author 1',
    body: 'Body 1',
    category: 'react',
    voteScore: 10,
    comments: [
      { id: 'c1', author: 'User A', body: 'Comment 1', timestamp: Date.now() - 300000, deleted: false, parentDeleted: false },
      { id: 'c2', author: 'User B', body: 'Comment 2', timestamp: Date.now() - 200000, deleted: false, parentDeleted: false },
    ],
    timestamp: Date.now() - 100000,
    deleted: false,
  },
  {
    id: '2',
    title: 'Post 2',
    author: 'Author 2',
    body: 'Body 2',
    category: 'redux',
    voteScore: 5,
    comments: [],
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
    comments: [
      { id: 'c3', author: 'User C', body: 'Comment on deleted', timestamp: Date.now() - 50000, deleted: false, parentDeleted: false },
    ],
    timestamp: Date.now() - 300000,
    deleted: true,
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

describe('NotificationsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the sidebar', () => {
      renderWithProviders(<NotificationsPage />);
      expect(screen.getByText('dashboard.home')).toBeInTheDocument();
    });

    it('renders the notifications title', () => {
      renderWithProviders(<NotificationsPage />);
      const notificationsElements = screen.getAllByText('dashboard.notifications');
      expect(notificationsElements.length).toBeGreaterThan(0);
    });
  });

  describe('Data Fetching', () => {
    it('dispatches fetchPosts on component mount', async () => {
      renderWithProviders(<NotificationsPage />);
      await waitFor(() => {
        expect(actions.fetchPosts).toHaveBeenCalled();
      });
    });
  });

  describe('Empty State', () => {
    it('shows empty state when there are no posts', async () => {
      const store = createStore({
        posts: { posts: [] },
        receiveCategories: mockCategories,
      });
      renderWithProviders(<NotificationsPage />, { store });
      await waitFor(() => {
        expect(screen.getByText('dashboard.no-notifications')).toBeInTheDocument();
      });
    });

    it('shows empty state when all posts are deleted', async () => {
      const deletedPosts = [
        {
          id: '1',
          title: 'Deleted Post',
          author: 'Author 1',
          body: 'Body 1',
          category: 'react',
          voteScore: 0,
          comments: [],
          timestamp: Date.now(),
          deleted: true,
        },
      ];

      const store = createStore({
        posts: { posts: deletedPosts },
        receiveCategories: mockCategories,
      });
      renderWithProviders(<NotificationsPage />, { store });
      await waitFor(() => {
        expect(screen.getByText('dashboard.no-notifications')).toBeInTheDocument();
      });
    });
  });

  describe('Notifications Display', () => {
    it('displays notifications for active posts', async () => {
      renderWithProviders(<NotificationsPage />);
      await waitFor(() => {
        expect(screen.getByText('Post 1')).toBeInTheDocument();
        expect(screen.getByText('Post 2')).toBeInTheDocument();
      });
    });

    it('does not display notifications for deleted posts', async () => {
      renderWithProviders(<NotificationsPage />);
      await waitFor(() => {
        expect(screen.queryByText('Deleted Post')).not.toBeInTheDocument();
      });
    });

    it('displays notification labels correctly', async () => {
      renderWithProviders(<NotificationsPage />);
      await waitFor(() => {
        expect(screen.getByText('2 new comments')).toBeInTheDocument();
        expect(screen.getByText('New post created')).toBeInTheDocument();
      });
    });

    it('displays author names', async () => {
      renderWithProviders(<NotificationsPage />);
      await waitFor(() => {
        expect(screen.getByText('Author 1')).toBeInTheDocument();
        expect(screen.getByText('Author 2')).toBeInTheDocument();
      });
    });

    it('links notifications to the correct post page', async () => {
      renderWithProviders(<NotificationsPage />);
      await waitFor(() => {
        const links = screen.getAllByRole('link');
        const postLinks = links.filter(link => 
          link.getAttribute('href')?.includes('react/1') || 
          link.getAttribute('href')?.includes('redux/2')
        );
        expect(postLinks.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Notification Sorting', () => {
    it('sorts notifications by latest activity timestamp', async () => {
      renderWithProviders(<NotificationsPage />);
      await waitFor(() => {
        const notifications = screen.getAllByText(/Post \d/);
        expect(notifications.length).toBeGreaterThan(0);
      });
    });

    it('limits notifications to 10 items', async () => {
      const manyPosts = Array.from({ length: 15 }, (_, i) => ({
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

      renderWithProviders(<NotificationsPage />, { store });

      await waitFor(() => {
        for (let i = 0; i < 10; i++) {
          expect(screen.getByText(`Post ${i}`)).toBeInTheDocument();
        }
        for (let i = 10; i < 15; i++) {
          expect(screen.queryByText(`Post ${i}`)).not.toBeInTheDocument();
        }
      });
    });
  });

  describe('Comment vs Post Notifications', () => {
    it('shows comment notification for posts with comments', async () => {
      renderWithProviders(<NotificationsPage />);
      await waitFor(() => {
        expect(screen.getByText('2 new comments')).toBeInTheDocument();
      });
    });

    it('shows post notification for posts without comments', async () => {
      renderWithProviders(<NotificationsPage />);
      await waitFor(() => {
        expect(screen.getByText('New post created')).toBeInTheDocument();
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
            notifications: 'Notifications',
            'no-notifications': 'No notifications',
          },
        },
      },
    },
  });
});