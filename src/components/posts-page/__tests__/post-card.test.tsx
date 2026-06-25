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
import PostCard from '../post-card';
import rootReducer from '../../../redux/reducers';
import { Post } from '../../../types/post';

const mockT = (key: string) => key;

vi.mock('../../shared/vote-actions', () => ({
  default: ({ id, voteScore, onUpvote, onDownvote }: { id: string; voteScore: number; onUpvote: (id: string) => void; onDownvote: (id: string) => void }) => (
    <div data-testid="vote-actions">
      <button data-testid="upvote-btn" onClick={() => onUpvote(id)}>Upvote</button>
      <button data-testid="downvote-btn" onClick={() => onDownvote(id)}>Downvote</button>
      <span data-testid="vote-score">{voteScore}</span>
    </div>
  ),
}));

vi.mock('react-timestamp', () => ({
  default: ({ date }: { date: number }) => <span data-testid="timestamp">{String(date)}</span>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('lucide-react', () => ({
  MessageSquare: () => <span data-testid="icon-message-square" />,
  Trash2: () => <span data-testid="icon-trash2" />,
  Edit: () => <span data-testid="icon-edit" />,
  User: () => <span data-testid="icon-user" />,
  Clock: () => <span data-testid="icon-clock" />,
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

describe('PostCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the post title', () => {
    renderWithProviders(<PostCard post={mockPost()} onDelete={vi.fn()} onVote={vi.fn()} animationsEnabled={true} />);
    expect(screen.getByRole('link', { name: 'Test Post' })).toBeInTheDocument();
  });

  it('renders the post title as a link to the post detail page', () => {
    renderWithProviders(<PostCard post={mockPost()} onDelete={vi.fn()} onVote={vi.fn()} animationsEnabled={true} />);
    const link = screen.getByRole('link', { name: 'Test Post' });
    expect(link).toHaveAttribute('href', '/general/post-1');
  });

  it('renders the post author', () => {
    renderWithProviders(<PostCard post={mockPost()} onDelete={vi.fn()} onVote={vi.fn()} animationsEnabled={true} />);
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('renders the post timestamp', () => {
    renderWithProviders(<PostCard post={mockPost()} onDelete={vi.fn()} onVote={vi.fn()} animationsEnabled={true} />);
    expect(screen.getByTestId('timestamp')).toHaveTextContent('1700000000');
  });

  it('renders the category text', () => {
    renderWithProviders(<PostCard post={mockPost()} onDelete={vi.fn()} onVote={vi.fn()} animationsEnabled={true} />);
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('renders the vote score', () => {
    renderWithProviders(<PostCard post={mockPost()} onDelete={vi.fn()} onVote={vi.fn()} animationsEnabled={true} />);
    expect(screen.getByTestId('vote-score')).toHaveTextContent('10');
  });

  it('renders vote actions', () => {
    renderWithProviders(<PostCard post={mockPost()} onDelete={vi.fn()} onVote={vi.fn()} animationsEnabled={true} />);
    expect(screen.getByTestId('vote-actions')).toBeInTheDocument();
  });

  it('calls onVote with upVote when upvote is clicked', () => {
    const onVote = vi.fn();
    renderWithProviders(<PostCard post={mockPost()} onDelete={vi.fn()} onVote={onVote} animationsEnabled={true} />);
    screen.getByTestId('upvote-btn').click();
    expect(onVote).toHaveBeenCalledWith('post-1', 'upVote');
  });

  it('calls onVote with downVote when downvote is clicked', () => {
    const onVote = vi.fn();
    renderWithProviders(<PostCard post={mockPost()} onDelete={vi.fn()} onVote={onVote} animationsEnabled={true} />);
    screen.getByTestId('downvote-btn').click();
    expect(onVote).toHaveBeenCalledWith('post-1', 'downVote');
  });

  it('renders comment count', () => {
    renderWithProviders(
      <PostCard post={mockPost({ comments: [{ id: 'c1', body: '', author: '', voteScore: 0, timestamp: 0 }] })} onDelete={vi.fn()} onVote={vi.fn()} animationsEnabled={true} />,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders edit link', () => {
    renderWithProviders(<PostCard post={mockPost()} onDelete={vi.fn()} onVote={vi.fn()} animationsEnabled={true} />);
    const links = screen.getAllByRole('link');
    const editLink = links.find((link) => link.getAttribute('href')?.includes('/editpost/'));
    expect(editLink).toBeDefined();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    renderWithProviders(<PostCard post={mockPost()} onDelete={onDelete} onVote={vi.fn()} animationsEnabled={true} />);
    const deleteBtn = screen.getByRole('button', { name: 'common.delete-post' });
    deleteBtn.click();
    expect(onDelete).toHaveBeenCalledWith('post-1');
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
            'edit-post': 'Edit Post',
            'delete-post': 'Delete Post',
          },
        },
      },
    },
  });
});