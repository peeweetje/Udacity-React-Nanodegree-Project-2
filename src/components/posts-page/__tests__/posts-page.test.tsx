import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import PostsPage from '../posts-page';
import rootReducer from '../../../redux/reducers';
import { Post } from '../../../types/post';

const mockT = (key: string) => key;

vi.mock('@/components/ui/hamburger-button', () => ({
  default: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="hamburger-button" onClick={onClick}>Menu</button>
  ),
}));

vi.mock('@/components/header/header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../category-menu/category-menu', () => ({
  default: () => <div data-testid="category-menu">Category Menu</div>,
}));

vi.mock('../../dashboard-page/sidebar/mobile-sidebar/mobile-sidebar', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? <div data-testid="mobile-sidebar" onClick={onClose}>Mobile Sidebar</div> : null,
}));

vi.mock('../post-card', () => ({
  default: ({ post, onDelete, onVote }: { post: Post; onDelete: () => void; onVote: () => void }) => (
    <div data-testid="post-card" data-post-id={post.id}>
      <h2>{post.title}</h2>
      <button data-testid="delete-btn" onClick={onDelete}>Delete</button>
      <button data-testid="vote-btn" onClick={onVote}>Vote</button>
    </div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

const mockPost = (overrides?: Partial<Post>): Post => ({
  id: 'post-1',
  title: 'Test Post',
  author: 'Test Author',
  timestamp: 1700000000000,
  body: 'This is a test post body.',
  voteScore: 10,
  category: 'general',
  deleted: false,
  error: false,
  comments: [],
  ...overrides,
});

const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      animations: { enabled: true },
      posts: { posts: [mockPost()] },
      sort: { sort: { value: 'popular' } },
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

describe('PostsPage Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  it('renders the main heading', async () => {
    renderWithProviders(<PostsPage />);
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByText('common.git-talks')).toBeInTheDocument();
  });

  it('renders the category menu', async () => {
    renderWithProviders(<PostsPage />);
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByTestId('category-menu')).toBeInTheDocument();
  });

  it('renders post cards', async () => {
    renderWithProviders(<PostsPage />);
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByTestId('post-card')).toBeInTheDocument();
  });

  it('renders post title', async () => {
    renderWithProviders(<PostsPage />);
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('renders the add post button', async () => {
    renderWithProviders(<PostsPage />);
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByText('common.add-post')).toBeInTheDocument();
  });

  it('renders the header', async () => {
    renderWithProviders(<PostsPage />);
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the hamburger button', async () => {
    renderWithProviders(<PostsPage />);
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByTestId('hamburger-button')).toBeInTheDocument();
  });

  it('does not render deleted posts', async () => {
    renderWithProviders(<PostsPage />, {
      store: createStore({
        posts: { posts: [mockPost({ deleted: true })] },
      }),
    });
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.queryByTestId('post-card')).not.toBeInTheDocument();
  });

  it('renders post not found when no posts exist', async () => {
    renderWithProviders(<PostsPage />, {
      store: createStore({
        posts: { posts: [] },
      }),
    });
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.queryByTestId('post-card')).not.toBeInTheDocument();
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
            'add-post': 'Add Post',
          },
        },
      },
    },
  });
});