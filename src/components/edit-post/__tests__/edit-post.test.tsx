import React from 'react';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EditPost from '../edit-post';
import rootReducer from '../../../redux/reducers';
import * as actions from '../../../redux/actions';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ postId: '1' }),
  };
});

// Mock i18n
const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

// Mock GSAP
vi.mock('gsap', async () => {
  const actual = await vi.importActual<typeof import('gsap')>('gsap');
  return {
    ...actual,
    context: () => ({ revert: vi.fn() }),
    timeline: () => ({ fromTo: vi.fn() }),
    killTweensOf: vi.fn(),
  };
});

// Mock BackButton
vi.mock('@/components/ui/back-button', () => ({
  default: () => React.createElement('button', { 'data-testid': 'back-button' }),
}));

// Mock HamburgerButton
vi.mock('@/components/ui/hamburger-button', () => ({
  default: ({ onClick }: { onClick: () => void }) =>
    React.createElement('button', { 'data-testid': 'hamburger-button', onClick }),
}));

// Mock MobileSidebar
vi.mock('../../dashboard-page/sidebar/mobile-sidebar/mobile-sidebar', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    React.createElement('div', {
      'data-testid': 'mobile-sidebar',
      'data-open': isOpen,
      onClick: onClose,
    }),
}));

// Mock Loading
vi.mock('../../loading/loading', () => ({
  default: () => React.createElement('div', { 'data-testid': 'loading' }),
}));

// Mock redux actions
vi.mock('../../../redux/actions', async () => {
  const actual: any = await vi.importActual('../../../redux/actions');
  const thunk = () => () => Promise.resolve();
  return {
    ...actual,
    fetchSinglePost: vi.fn(() => thunk),
    fetchEditPost: vi.fn(() => thunk),
  };
});

// Mock EditPostForm to isolate tests
vi.mock('../edit-post-form', () => ({
  default: ({
    initialCategory,
    initialTitle,
    initialAuthor,
    initialContent,
    onSubmit,
  }: {
    initialCategory: string;
    initialTitle: string;
    initialAuthor: string;
    initialContent: string;
    onSubmit: (values: { postCategory: string; postTitle: string; postAuthor: string; postContent: string }) => void;
  }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        postCategory: initialCategory,
        postTitle: initialTitle,
        postAuthor: initialAuthor,
        postContent: initialContent,
      });
    };
    return (
      <form data-testid="edit-post-form" onSubmit={handleSubmit}>
        <input data-testid="category-input" defaultValue={initialCategory} readOnly />
        <input data-testid="title-input" defaultValue={initialTitle} readOnly />
        <input data-testid="author-input" defaultValue={initialAuthor} readOnly />
        <textarea data-testid="content-input" defaultValue={initialContent} readOnly />
        <button type="submit" data-testid="submit-button">Submit</button>
      </form>
    );
  },
}));

const mockPost = {
  id: '1',
  category: 'react',
  title: 'Test Post Title',
  author: 'Petra Vos',
  body: 'This is the post body content',
};

const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      posts: { posts: [mockPost] },
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

describe('EditPost Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the back button', async () => {
      renderWithProviders(<EditPost />);
      await waitFor(() => {
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
      });
    });

    it('renders the hamburger button', async () => {
      renderWithProviders(<EditPost />);
      await waitFor(() => {
        expect(screen.getByTestId('hamburger-button')).toBeInTheDocument();
      });
    });

    it('renders the mobile sidebar', async () => {
      renderWithProviders(<EditPost />);
      await waitFor(() => {
        expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
      });
    });

    it('renders the edit post form when post is loaded', async () => {
      renderWithProviders(<EditPost />);
      await waitFor(() => {
        expect(screen.getByTestId('edit-post-form')).toBeInTheDocument();
      });
    });

    it('calls fetchSinglePost with postId on mount', async () => {
      renderWithProviders(<EditPost />);
      await waitFor(() => {
        expect(actions.fetchSinglePost).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Form Interaction', () => {
    it('populates form inputs with post data when loaded', async () => {
      renderWithProviders(<EditPost />);
      await waitFor(() => {
        expect(screen.getByTestId('category-input')).toHaveValue('react');
      });
      await waitFor(() => {
        expect(screen.getByTestId('title-input')).toHaveValue('Test Post Title');
      });
      await waitFor(() => {
        expect(screen.getByTestId('author-input')).toHaveValue('Petra Vos');
      });
      await waitFor(() => {
        expect(screen.getByTestId('content-input')).toHaveValue('This is the post body content');
      });
    });

    it('submits the form with edited data', async () => {
      renderWithProviders(<EditPost />);
      await waitFor(() => {
        expect(screen.getByTestId('edit-post-form')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(actions.fetchEditPost).toHaveBeenCalledWith(
          {
            id: '1',
            title: 'Test Post Title',
            body: 'This is the post body content',
            author: 'Petra Vos',
            category: 'react',
          },
          '1'
        );
      });
    });
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
          editPost: {
            'edit-post': 'Edit Post',
            category: 'Category',
            'placeholder-category': 'Select a category',
            'label-title': 'Title',
            'label-author': 'Author',
            'label-content': 'Content',
            'placeholder-text-area': 'Write your post content here...',
            'button-edit': 'Edit',
          },
        },
      },
    },
  });
});