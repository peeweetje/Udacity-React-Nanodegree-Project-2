import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import CategoryItem from '../catergory-item';
import rootReducer from '../../../redux/reducers';


const mockT = (key: string) => key;
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

vi.mock('../../animations/use-gsap-animation', () => ({
  useGsapContext: vi.fn(),
  useGsapCardHover: vi.fn(),
}));

vi.mock('../../animations/card-animations', () => ({
  animateCards: vi.fn(),
  animateCategoryText: vi.fn(),
}));

vi.mock('../../../redux/actions', async () => {
  const actual: any = await vi.importActual('../../../redux/actions');
  const thunk = () => () => Promise.resolve();
  return {
    ...actual,
    fetchDeletePost: vi.fn(() => thunk),
    fetchVotePost: vi.fn(() => thunk),
  };
});

const mockPost = {
  id: '1',
  title: 'Test Post',
  author: 'Test Author',
  body: 'Test content for the post.',
  category: 'react',
  timestamp: Date.now(),
  voteScore: 5,
  deleted: false,
  error: false,
  comments: [],
};

const createStore = () =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      posts: { posts: [mockPost] },
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

describe('CategoryItem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const post = mockPost;
  const onDelete = vi.fn();
  const onVote = vi.fn();

  describe('Rendering', () => {
    it('renders the post title', () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });

    it('renders the post author', () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });

    it('renders the post body', () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);
      expect(screen.getByText('Test content for the post.')).toBeInTheDocument();
    });

    it('renders the post category', () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('renders vote score', () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders comments count', () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);
      expect(screen.getByText('0 comments')).toBeInTheDocument();
    });

    it('renders edit button', () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);
      expect(screen.getByText('categoryItem.edit')).toBeInTheDocument();
    });

    it('renders delete button', () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);
      expect(screen.getByText('categoryItem.delete')).toBeInTheDocument();
    });
  });

  describe('Voting', () => {
    it('calls onVote with upVote when upvote is clicked', async () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);

      const upvoteButtons = screen.queryAllByRole('button');
      const upvoteButton = upvoteButtons.find(
        (btn) => btn.querySelector('svg.lucide-thumbsup') !== null
      );

      if (upvoteButton) {
        await userEvent.click(upvoteButton);
        expect(onVote).toHaveBeenCalledWith('1', 'upVote');
      }
    });

    it('calls onVote with downVote when downvote is clicked', async () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);

      const downvoteButtons = screen.queryAllByRole('button');
      const downvoteButton = downvoteButtons.find(
        (btn) => btn.querySelector('svg.lucide-thumbsdown') !== null
      );

      if (downvoteButton) {
        await userEvent.click(downvoteButton);
        expect(onVote).toHaveBeenCalledWith('1', 'downVote');
      }
    });
  });

  describe('Delete Action', () => {
    it('calls onDelete when delete button is clicked', async () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);

      const deleteButton = screen.getByText('categoryItem.delete');
      await userEvent.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith('1');
    });
  });

  describe('Navigation Links', () => {
    it('renders a link to the post page', () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);
      const link = screen.getByText('Test Post').closest('a');
      expect(link).toHaveAttribute('href', '/react/1');
    });

    it('renders a link to the edit post page', () => {
      renderWithProviders(<CategoryItem post={post} onDelete={onDelete} onVote={onVote} />);
      const editLink = screen.getByText('categoryItem.edit').closest('a');
      expect(editLink).toHaveAttribute('href', '/editpost/1');
    });
  });

  describe('Comments Display', () => {
    it('renders correct comments count', () => {
      const postWithComments = {
        ...post,
        comments: [{ id: 'c1' }, { id: 'c2' }],
      };
      renderWithProviders(<CategoryItem post={postWithComments} onDelete={onDelete} onVote={onVote} />);
      expect(screen.getByText('2 comments')).toBeInTheDocument();
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
          categoryItem: {
            edit: 'Edit',
            delete: 'Delete',
          },
        },
      },
    },
  });
});