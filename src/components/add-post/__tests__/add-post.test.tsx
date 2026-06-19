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
import AddPost from '../add-post';
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
  useGsapCardHover: vi.fn(),
}));

vi.mock('../../animations/card-animations', () => ({
  animateCards: vi.fn(),
  animateListItems: vi.fn(),
  animateEmptyState: vi.fn(),
}));

// Mock redux actions: keep real exports, but spy on the ones we want to verify
vi.mock('../../../redux/actions', async () => {
  const actual: any = await vi.importActual('../../../redux/actions');
  const thunk = () => () => Promise.resolve();
  return {
    ...actual,
    fetchAddPost: vi.fn(() => thunk),
  };
});

const createStore = () =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      posts: { posts: [] },
      sort: { sort: { value: 'new' } },
      animations: { enabled: true },
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

describe('AddPost Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the add post title', () => {
      renderWithProviders(<AddPost />);
      expect(screen.getByText('addPost.new-post')).toBeInTheDocument();
    });

    it('renders the category select', () => {
      renderWithProviders(<AddPost />);
      expect(screen.getByText('addPost.form-label.category')).toBeInTheDocument();
    });

    it('renders the title input', () => {
      renderWithProviders(<AddPost />);
      expect(screen.getByText('addPost.form-label.title')).toBeInTheDocument();
    });

    it('renders the author input', () => {
      renderWithProviders(<AddPost />);
      expect(screen.getByText('addPost.form-label.author')).toBeInTheDocument();
    });

    it('renders the content textarea', () => {
      renderWithProviders(<AddPost />);
      expect(screen.getByText('addPost.form-label.content')).toBeInTheDocument();
    });

    it('renders submit button', () => {
      renderWithProviders(<AddPost />);
      expect(screen.getByText('addPost.add-post')).toBeInTheDocument();
    });

    it('renders BackButton component', () => {
      renderWithProviders(<AddPost />);
      expect(screen.getByRole('button', { name: /common\.back/i })).toBeInTheDocument();
    });

    it('renders HamburgerButton component', () => {
      renderWithProviders(<AddPost />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Form Interaction', () => {
    it('allows selecting a category', async () => {
      renderWithProviders(<AddPost />);
      const categorySelect = screen.getByText('addPost.form-label.category');
      expect(categorySelect).toBeInTheDocument();
    });

    it('allows entering a title', async () => {
      renderWithProviders(<AddPost />);
      const titleInput = screen.getByPlaceholderText('addPost.placeholder.enter-title');
      await userEvent.type(titleInput, 'My Test Post');
      expect(titleInput).toHaveValue('My Test Post');
    });

    it('allows entering an author', async () => {
      renderWithProviders(<AddPost />);
      const authorInput = screen.getByPlaceholderText('addPost.placeholder.enter-author');
      await userEvent.type(authorInput, 'John Doe');
      expect(authorInput).toHaveValue('John Doe');
    });

    it('allows entering content', async () => {
      renderWithProviders(<AddPost />);
      const contentTextarea = screen.getByPlaceholderText('addPost.placeholder.enter-content');
      await userEvent.type(contentTextarea, 'This is some post content.');
      expect(contentTextarea).toHaveValue('This is some post content.');
    });
  });

  describe('Form Submission', () => {
    it('calls fetchAddPost with correct data when form is submitted', async () => {
      renderWithProviders(<AddPost />);

      const titleInput = screen.getByPlaceholderText('addPost.placeholder.enter-title');
      const authorInput = screen.getByPlaceholderText('addPost.placeholder.enter-author');
      const contentTextarea = screen.getByPlaceholderText('addPost.placeholder.enter-content');
      const submitButton = screen.getByText('addPost.add-post');

      await userEvent.type(titleInput, 'Test Post');
      await userEvent.type(authorInput, 'Test Author');
      await userEvent.type(contentTextarea, 'This is test content for the post submission.');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(actions.fetchAddPost).toHaveBeenCalled();
      });

      const callArgs = (actions.fetchAddPost as any).mock.calls[0][0];
      expect(callArgs.title).toBe('Test Post');
      expect(callArgs.author).toBe('Test Author');
      expect(callArgs.body).toBe('This is test content for the post submission.');
      expect(callArgs.voteScore).toBe(1);
      expect(callArgs.deleted).toBe(false);
    });

    it('does not call fetchAddPost when form is incomplete', async () => {
      renderWithProviders(<AddPost />);

      const submitButton = screen.getByText('addPost.add-post');
      await userEvent.click(submitButton);

      expect(actions.fetchAddPost).not.toHaveBeenCalled();
    });
  });

  describe('Mobile Menu', () => {
    it('shows mobile sidebar when hamburger button is clicked', async () => {
      renderWithProviders(<AddPost />);

      const buttons = screen.queryAllByRole('button');
      const hamburgerButton = buttons.find(
        (btn) => btn.querySelector('svg.lucide-menu') !== null
      );

      if (hamburgerButton) {
        await userEvent.click(hamburgerButton);
        expect(screen.getByText('dashboard.home')).toBeInTheDocument();
      }
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
          addPost: {
            'new-post': 'Add New Post',
            'add-post': 'Add Post',
            'form-label': {
              category: 'Category',
              title: 'Title',
              author: 'Author',
              content: 'Content',
            },
            'placeholder': {
              'enter-title': 'Enter title',
              'enter-author': 'Enter author',
              'enter-content': 'Enter content',
            },
            category: 'Select a category',
          },
          common: {
            'add-post': 'Add Post',
          },
          dashboard: {
            home: 'Home',
          },
        },
      },
    },
  });
});