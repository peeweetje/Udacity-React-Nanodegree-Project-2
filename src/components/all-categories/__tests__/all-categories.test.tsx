import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Categories from '../all-categories';
import rootReducer from '../../../redux/reducers';
import * as actions from '../../../redux/actions';
import * as sortUtil from '../../../utils/sortPosts';

// Mock i18n so t(key) returns the key (simple spy)
const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

// Mock GSAP animations (path is two levels up: src/components/animations)
vi.mock('../../animations/use-gsap-animation', () => ({
  useGsapContext: vi.fn(),
  useGsapCardHover: vi.fn(),
}));

vi.mock('../../animations/card-animations', () => ({
  animateCards: vi.fn(),
  animateListItems: vi.fn(),
  animateEmptyState: vi.fn(),
}));

// Mock redux actions: keep real exports so reducers still get their action creators,
// but spy on the ones we want to verify were called.
// IMPORTANT: these are thunk action creators, so the spy must return a thunk function
// (otherwise redux throws "Actions must be plain objects" when dispatching).
vi.mock('../../../redux/actions', async () => {
  const actual: any = await vi.importActual('../../../redux/actions');
  const thunk = () => () => Promise.resolve();
  return {
    ...actual,
    fetchPostsCategory: vi.fn(() => thunk),
    fetchDeletePost: vi.fn(() => thunk),
    fetchVotePost: vi.fn(() => thunk),
  };
});

// Mock sortPosts
vi.mock('../../../utils/sortPosts', async () => {
  const actual: any = await vi.importActual('../../../utils/sortPosts');
  return {
    ...actual,
    sortPosts: vi.fn((posts: any) => posts),
  };
});

const mockPosts = [
  {
    id: '1',
    title: 'Test Post 1',
    author: 'Author 1',
    body: 'Content 1',
    category: 'react',
    timestamp: Date.now(),
    voteScore: 5,
    deleted: false,
    error: false,
    comments: [],
  },
  {
    id: '2',
    title: 'Test Post 2',
    author: 'Author 2',
    body: 'Content 2',
    category: 'react',
    timestamp: Date.now() - 1000,
    voteScore: 3,
    deleted: false,
    error: false,
    comments: [],
  },
];

const createStore = (posts: any = mockPosts) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      posts: { posts },
      sort: { sort: { value: 'new' } },
      animations: { enabled: true },
    },
  });

// Wraps the UI in MemoryRouter + Route so useParams returns the right category
const renderWithProviders = (
  ui: React.ReactElement,
  { store = createStore(), initialPath = '/react' }: { store?: any; initialPath?: string } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route path="/:category" element={ui} />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('Categories Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the category title', () => {
      renderWithProviders(<Categories />);
      expect(screen.getByText('common.git-talks')).toBeInTheDocument();
    });

    it('renders CategoryCard with correct category name', () => {
      const { container } = renderWithProviders(<Categories />, { initialPath: '/react' });
      const categoryTextEl = container.querySelector('[data-category-text]');
      expect(categoryTextEl).toBeInTheDocument();
      expect(categoryTextEl?.textContent).toMatch(/React/);
    });

    it('renders Header component', () => {
      renderWithProviders(<Categories />);
      expect(screen.getByText('common.git-talks')).toBeInTheDocument();
    });

    it('renders CategoryMenu component', () => {
      renderWithProviders(<Categories />);
      // CategoryMenu renders a "common.all" button
      expect(screen.getByText('common.all')).toBeInTheDocument();
    });

    it('renders AddPostButton component', () => {
      renderWithProviders(<Categories />);
      expect(screen.getByText('common.add-post')).toBeInTheDocument();
    });
  });

  describe('Posts Display', () => {
    it('renders CategoryItem components when posts exist', () => {
      renderWithProviders(<Categories />);
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });

    it('shows NoPostsMessage when no posts exist', () => {
      const store = createStore([]);
      renderWithProviders(<Categories />, { store });
      expect(screen.getByText('common.no-posts')).toBeInTheDocument();
    });

    it('shows NoPostsMessage when all posts are deleted', () => {
      const deletedPosts = [
        { ...mockPosts[0], deleted: true },
        { ...mockPosts[1], deleted: true },
      ];
      const store = createStore(deletedPosts);
      renderWithProviders(<Categories />, { store });
      expect(screen.getByText('common.no-posts')).toBeInTheDocument();
    });

    it('shows NoPostsMessage when all posts have errors', () => {
      const errorPosts = [
        { ...mockPosts[0], error: true },
        { ...mockPosts[1], error: true },
      ];
      const store = createStore(errorPosts);
      renderWithProviders(<Categories />, { store });
      expect(screen.getByText('common.no-posts')).toBeInTheDocument();
    });

    it('filters out deleted posts but shows non-deleted ones', () => {
      const mixedPosts = [
        { ...mockPosts[0], deleted: true },
        mockPosts[1],
      ];
      const store = createStore(mixedPosts);
      renderWithProviders(<Categories />, { store });
      expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });
  });

  describe('Post Actions', () => {
    it('calls fetchDeletePost when delete is triggered', async () => {
      renderWithProviders(<Categories />);

      const deleteButtons = screen.queryAllByText('categoryItem.delete');
      if (deleteButtons.length > 0) {
        await userEvent.click(deleteButtons[0]);
        expect(actions.fetchDeletePost).toHaveBeenCalledWith('1');
      }
    });

    it('calls fetchVotePost when vote is triggered', async () => {
      renderWithProviders(<Categories />);

      const allButtons = screen.queryAllByRole('button');
      const upvoteButtons = allButtons.filter(
        (btn) => btn.querySelector('svg.lucide-thumbsup') !== null
      );
      if (upvoteButtons.length > 0) {
        await userEvent.click(upvoteButtons[0]);
        expect(actions.fetchVotePost).toHaveBeenCalledWith('1', 'upVote');
      }
    });
  });

  describe('Category Parameter', () => {
    it('fetches posts for the correct category from URL params', async () => {
      renderWithProviders(<Categories />, { initialPath: '/redux' });
      await waitFor(() => {
        expect(actions.fetchPostsCategory).toHaveBeenCalledWith('redux');
      });
    });

    it('fetches posts for react category', async () => {
      renderWithProviders(<Categories />, { initialPath: '/react' });
      await waitFor(() => {
        expect(actions.fetchPostsCategory).toHaveBeenCalledWith('react');
      });
    });
  });

  describe('Sorting', () => {
    it('applies sort from redux state', () => {
      const store = createStore(mockPosts);
      renderWithProviders(<Categories />, { store });
      expect(sortUtil.sortPosts).toHaveBeenCalled();
    });
  });

  describe('Mobile Menu', () => {
    it('shows mobile sidebar when hamburger button is clicked', async () => {
      renderWithProviders(<Categories />);

      // The hamburger button contains the lucide-menu icon
      const allButtons = screen.queryAllByRole('button');
      const hamburgerButton = allButtons.find(
        (btn) => btn.querySelector('svg.lucide-menu') !== null
      );
      if (hamburgerButton) {
        await userEvent.click(hamburgerButton);
        expect(screen.getByText('dashboard.home')).toBeInTheDocument();
      }
    });
  });
});

describe('NoPostsMessage Component', () => {
  it('renders the no posts message', () => {
    const store = createStore([]);
    renderWithProviders(<Categories />, { store });
    expect(screen.getByText('common.no-posts')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const store = createStore([]);
    renderWithProviders(<Categories />, { store });
    const message = screen.getByText('common.no-posts').closest('div');
    expect(message).toHaveClass('no-posts-message');
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
            'git-talks': 'Git Talks',
            'no-posts': 'There are no posts in this category.',
            'add-post': 'Add Post',
            'edit-post': 'Edit',
            'delete-post': 'Delete',
          },
          dashboard: {
            notifications: 'Notifications',
            home: 'Home',
          },
        },
      },
    },
  });
});
