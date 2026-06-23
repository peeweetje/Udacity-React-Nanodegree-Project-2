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
import EditComment from '../edit-comment';
import rootReducer from '../../../redux/reducers';
import * as actions from '../../../redux/actions';

const mockT = (key: string) => key;
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ commentId: 'c1' }),
  };
});
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

vi.mock('gsap', async () => {
  const actual = await vi.importActual<typeof import('gsap')>('gsap');
  return {
    ...actual,
    context: () => ({ revert: vi.fn() }),
    timeline: () => ({ fromTo: vi.fn() }),
    killTweensOf: vi.fn(),
  };
});

vi.mock('@/components/ui/back-button', () => ({
  default: () => React.createElement('button', { 'data-testid': 'back-button' }),
}));

vi.mock('../../../redux/actions', async () => {
  const actual: any = await vi.importActual('../../../redux/actions');
  const thunk = () => () => Promise.resolve();
  return {
    ...actual,
    fetchComment: vi.fn(() => thunk),
    fetchEditComment: vi.fn(() => thunk),
  };
});

vi.mock('../edit-comment-card', () => ({
  default: ({
    commentAuthor,
    commentContent,
    onInputChange,
    onSubmit,
  }: {
    commentAuthor: string;
    commentContent: string;
    containerRef: React.RefObject<HTMLDivElement | null>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onInputChange(e);
    };
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
      onSubmit(e);
    };
    return (
      <form data-testid="edit-comment-card" onSubmit={handleSubmit}>
        <input
          data-testid="author-input"
          name="commentAuthor"
          value={commentAuthor}
          onChange={handleChange}
        />
        <textarea
          data-testid="content-input"
          name="commentContent"
          value={commentContent}
          onChange={handleChange}
        />
      </form>
    );
  },
}));

const mockComment = {
  id: 'c1',
  author: 'Petra Vos',
  body: 'This is my edited comment',
};

const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      receiveComment: mockComment,
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

describe('EditComment Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the back button', () => {
      renderWithProviders(<EditComment />);
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    it('renders the edit comment card when comment is available', async () => {
      renderWithProviders(<EditComment />);
      await waitFor(() => {
        expect(screen.getByTestId('edit-comment-card')).toBeInTheDocument();
      });
    });

    it('calls fetchComment when commentId is available in params', async () => {
      renderWithProviders(<EditComment />);
      await waitFor(() => {
        expect(actions.fetchComment).toHaveBeenCalledWith('c1');
      });
    });
  });

  describe('Form Interaction', () => {
    it('populates form inputs when comment is received', async () => {
      renderWithProviders(<EditComment />);
      await waitFor(() => {
        expect(screen.getByTestId('author-input')).toHaveValue('Petra Vos');
      });
      await waitFor(() => {
        expect(screen.getByTestId('content-input')).toHaveValue('This is my edited comment');
      });
    });

    it('allows editing the author input', async () => {
      renderWithProviders(<EditComment />);
      const authorInput = await screen.findByTestId('author-input') as HTMLInputElement;
      fireEvent.change(authorInput, { target: { value: 'New Author' } });
      await waitFor(() => {
        expect(authorInput).toHaveValue('New Author');
      });
    });

    it('allows editing the content input', async () => {
      renderWithProviders(<EditComment />);
      const contentInput = await screen.findByTestId('content-input') as HTMLTextAreaElement;
      fireEvent.change(contentInput, { target: { value: 'New content' } });
      await waitFor(() => {
        expect(contentInput).toHaveValue('New content');
      });
    });

    it('submits the form with the current input values', async () => {
      renderWithProviders(<EditComment />);
      const authorInput = await screen.findByTestId('author-input') as HTMLInputElement;
      const contentInput = screen.getByTestId('content-input') as HTMLTextAreaElement;
      const form = screen.getByTestId('edit-comment-card');

      fireEvent.change(authorInput, { target: { value: 'Updated Author' } });
      fireEvent.change(contentInput, { target: { value: 'Updated content' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(actions.fetchEditComment).toHaveBeenCalledWith(
          {
            id: 'c1',
            author: 'Updated Author',
            body: 'Updated content',
          },
          'c1'
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
          editComment: {
            'edit-comment': 'Edit Comment',
            'edit-description': 'Edit your comment',
            'label-author': 'Author',
            'label-content': 'Content',
            'button-edit': 'Edit',
          },
        },
      },
    },
  });
});