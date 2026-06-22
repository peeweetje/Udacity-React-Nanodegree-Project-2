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
import MessagesPage from '../messages-page';
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
    comments: [
      { id: 'c3', author: 'User C', body: 'Comment 3', timestamp: Date.now() - 100000, deleted: false, parentDeleted: false },
    ],
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
      { id: 'c4', author: 'User D', body: 'Comment on deleted', timestamp: Date.now() - 50000, deleted: false, parentDeleted: true },
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

describe('MessagesPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the sidebar', () => {
      renderWithProviders(<MessagesPage />);
      expect(screen.getByText('dashboard.home')).toBeInTheDocument();
    });

    it('renders the messages page title', () => {
      renderWithProviders(<MessagesPage />);
      const messagesElements = screen.getAllByText('dashboard.messages');
      expect(messagesElements.length).toBeGreaterThan(0);
    });
  });

  describe('Data Fetching', () => {
    it('dispatches fetchPosts on component mount', async () => {
      renderWithProviders(<MessagesPage />);
      await waitFor(() => {
        expect(actions.fetchPosts).toHaveBeenCalled();
      });
    });
  });

  describe('Empty State', () => {
    it('shows empty state when there are no comments', async () => {
      const store = createStore({
        posts: { posts: [] },
        receiveCategories: mockCategories,
      });
      renderWithProviders(<MessagesPage />, { store });
      await waitFor(() => {
        expect(screen.getByText('dashboard.noMessages')).toBeInTheDocument();
      });
    });

    it('shows empty state when all comments are deleted', async () => {
      const deletedCommentPosts = [
        {
          id: '1',
          title: 'Post 1',
          author: 'Author 1',
          body: 'Body 1',
          category: 'react',
          voteScore: 10,
          comments: [
            { id: 'c1', author: 'User A', body: 'Deleted comment', timestamp: Date.now(), deleted: true, parentDeleted: false },
          ],
          timestamp: Date.now(),
          deleted: false,
        },
      ];

      const store = createStore({
        posts: { posts: deletedCommentPosts },
        receiveCategories: mockCategories,
      });
      renderWithProviders(<MessagesPage />, { store });
      await waitFor(() => {
        expect(screen.getByText('dashboard.noMessages')).toBeInTheDocument();
      });
    });
  });

  describe('Comments Display', () => {
    it('displays all non-deleted comments from active posts', async () => {
      renderWithProviders(<MessagesPage />);
      await waitFor(() => {
        expect(screen.getByText('Comment 1')).toBeInTheDocument();
        expect(screen.getByText('Comment 2')).toBeInTheDocument();
        expect(screen.getByText('Comment 3')).toBeInTheDocument();
      });
    });

    it('does not display deleted comments', async () => {
      renderWithProviders(<MessagesPage />);
      await waitFor(() => {
        expect(screen.queryByText('Deleted comment')).not.toBeInTheDocument();
      });
    });

    it('does not display comments from deleted posts', async () => {
      renderWithProviders(<MessagesPage />);
      await waitFor(() => {
        expect(screen.queryByText('Comment on deleted')).not.toBeInTheDocument();
      });
    });

    it('displays comment author names', async () => {
      renderWithProviders(<MessagesPage />);
      await waitFor(() => {
        expect(screen.getByText('User A')).toBeInTheDocument();
        expect(screen.getByText('User B')).toBeInTheDocument();
        expect(screen.getByText('User C')).toBeInTheDocument();
      });
    });


    it('links message cards to the correct post page', async () => {
      renderWithProviders(<MessagesPage />);
      await waitFor(() => {
        const links = screen.queryAllByRole('link');
        const postLinks = links.filter(link => link.getAttribute('href')?.includes('react/1') || link.getAttribute('href')?.includes('redux/2'));
        expect(postLinks.length).toBeGreaterThan(0);
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
            messages: 'Messages',
            noMessages: 'No messages yet',
            noMessagesHint: 'No messages hint',
            commentedOn: 'commented on',
          },
        },
      },
    },
  });
});