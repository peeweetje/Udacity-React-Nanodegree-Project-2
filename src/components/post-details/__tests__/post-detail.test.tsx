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
import PostDetail from '../post-detail';
import rootReducer from '../../../redux/reducers';
import { Post } from '../../../types/post';

const mockT = (key: string) => key;

vi.mock('@/components/ui/hamburger-button', () => ({
  default: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="hamburger-button" onClick={onClick}>Menu</button>
  ),
}));

vi.mock('@/components/ui/back-button', () => ({
  default: () => <button data-testid="back-button">Back</button>,
}));

vi.mock('../../category-menu/category-menu', () => ({
  default: () => <div data-testid="category-menu">Category Menu</div>,
}));

vi.mock('../../dashboard-page/sidebar/mobile-sidebar/mobile-sidebar', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? <div data-testid="mobile-sidebar" onClick={onClose}>Mobile Sidebar</div> : null,
}));

vi.mock('../single-post', () => ({
  default: ({ post, onDelete }: { post: Post; onDelete: () => void }) => (
    <div data-testid="single-post" data-post-id={post.id}>
      <h2>{post.title}</h2>
      <button data-testid="delete-post-btn" onClick={onDelete}>Delete</button>
    </div>
  ),
}));

vi.mock('../single-comment', () => ({
  default: ({ comment, onDelete }: { comment: any; onDelete: () => void }) => (
    <div data-testid="single-comment" data-comment-id={comment.id}>
      <p>{comment.body}</p>
      <button data-testid="delete-comment-btn" onClick={onDelete}>Delete</button>
    </div>
  ),
}));

vi.mock('../add-comment-form', () => ({
  default: () => <div data-testid="add-comment-form">Add Comment Form</div>,
}));

vi.mock('../post-not-found', () => ({
  default: () => <div data-testid="post-not-found">Post Not Found</div>,
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
  ...overrides,
});

const mockComment = {
  id: 'comment-1',
  author: 'Commenter',
  body: 'A test comment',
  voteScore: 5,
  timestamp: 1700000001000,
};

const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      animations: { enabled: true },
      posts: {
        posts: [mockPost()],
      },
      getComments: {
        comments: [mockComment],
      },
      sort: {
        sort: { value: 'popular' },
      },
      ...preloadedState,
    },
  });

const renderWithProviders = (
  ui: React.ReactElement,
  { store = createStore(), route = '/posts/post-1' }: { store?: any; route?: string } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <I18nextProvider i18n={i18n}>
          {ui}
        </I18nextProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('PostDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the main heading', () => {
    renderWithProviders(<PostDetail />);
    expect(screen.getByText('common.git-talks')).toBeInTheDocument();
  });

  it('renders the back button', () => {
    renderWithProviders(<PostDetail />);
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });

  it('renders the category menu', () => {
    renderWithProviders(<PostDetail />);
    expect(screen.getByTestId('category-menu')).toBeInTheDocument();
  });

  it('renders the hamburger button for mobile menu', () => {
    renderWithProviders(<PostDetail />);
    expect(screen.getByTestId('hamburger-button')).toBeInTheDocument();
  });

  it('opens mobile sidebar when hamburger button is clicked', async () => {
    renderWithProviders(<PostDetail />);
    const hamburger = screen.getByTestId('hamburger-button');
    hamburger.click();
    expect(await screen.findByTestId('mobile-sidebar')).toBeInTheDocument();
  });

  it('renders a single post', () => {
    renderWithProviders(<PostDetail />);
    const post = screen.getByTestId('single-post');
    expect(post).toBeInTheDocument();
    expect(post).toHaveAttribute('data-post-id', 'post-1');
  });

  it('renders post title', () => {
    renderWithProviders(<PostDetail />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('renders a single comment', () => {
    renderWithProviders(<PostDetail />);
    const comment = screen.getByTestId('single-comment');
    expect(comment).toBeInTheDocument();
    expect(comment).toHaveAttribute('data-comment-id', 'comment-1');
  });

  it('renders comment body', () => {
    renderWithProviders(<PostDetail />);
    expect(screen.getByText('A test comment')).toBeInTheDocument();
  });

  it('renders the add comment form', () => {
    renderWithProviders(<PostDetail />);
    expect(screen.getByTestId('add-comment-form')).toBeInTheDocument();
  });

  it('does not render PostNotFound when there is a post', () => {
    renderWithProviders(<PostDetail />);
    expect(screen.queryByTestId('post-not-found')).not.toBeInTheDocument();
  });

  it('renders PostNotFound when there are no posts', () => {
    renderWithProviders(<PostDetail />, {
      store: createStore({
        posts: { posts: [] },
      }),
    });
    expect(screen.getByTestId('post-not-found')).toBeInTheDocument();
  });

  it('hides the add comment form when there are no posts', () => {
    renderWithProviders(<PostDetail />, {
      store: createStore({
        posts: { posts: [] },
      }),
    });
    expect(screen.queryByTestId('add-comment-form')).not.toBeInTheDocument();
  });

  it('does not render deleted posts', () => {
    renderWithProviders(<PostDetail />, {
      store: createStore({
        posts: {
          posts: [mockPost({ id: 'post-deleted', deleted: true })],
        },
      }),
    });
    expect(screen.queryByTestId('single-post')).not.toBeInTheDocument();
    expect(screen.getByTestId('post-not-found')).toBeInTheDocument();
  });

  it('does not render posts with errors', () => {
    renderWithProviders(<PostDetail />, {
      store: createStore({
      posts: {
        posts: [mockPost({ id: 'post-error', error: true })],
      },
      }),
    });
    expect(screen.queryByTestId('single-post')).not.toBeInTheDocument();
    expect(screen.getByTestId('post-not-found')).toBeInTheDocument();
  });

  it('does not render deleted comments', () => {
    renderWithProviders(<PostDetail />, {
      store: createStore({
        getComments: {
          comments: [{ ...mockComment, id: 'comment-deleted', deleted: true }],
        },
      }),
    });
    expect(screen.queryByTestId('single-comment')).not.toBeInTheDocument();
  });

  it('does not render parent-deleted comments', () => {
    renderWithProviders(<PostDetail />, {
      store: createStore({
        getComments: {
          comments: [{ ...mockComment, id: 'comment-parent-deleted', parentDeleted: true }],
        },
      }),
    });
    expect(screen.queryByTestId('single-comment')).not.toBeInTheDocument();
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
          },
          postDetails: {
            'add-comment': 'Add comment',
            'label-author': 'Author',
            'comment-content': 'Comment',
            'add-comment-button': 'Add Comment',
            'not-found': 'Post not found',
          },
          singlePost: {
            'edit-post': 'Edit Post',
            edit: 'Edit',
            'delete-post': 'Delete Post',
            delete: 'Delete',
          },
          singleComment: {
            'edit-comment': 'Edit Comment',
            edit: 'Edit',
            'delete-comment': 'Delete Comment',
            delete: 'Delete',
          },
        },
      },
    },
  });
});