import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import VoteActions from '../vote-actions';
import rootReducer from '../../../redux/reducers';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockT = (key: string) => key;

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: mockT, i18n: { changeLanguage: vi.fn() } }),
  };
});

vi.mock('../../animations/vote-animations', () => ({
  animateVoteButton: vi.fn(),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({ reducer: rootReducer, preloadedState: { animations: { enabled: true } } });
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

describe('VoteActions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders upvote and downvote buttons', () => {
    renderWithProviders(<VoteActions id="post-1" voteScore={10} onUpvote={vi.fn()} onDownvote={vi.fn()} animationsEnabled={true} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('displays the vote score', () => {
    renderWithProviders(<VoteActions id="post-1" voteScore={10} onUpvote={vi.fn()} onDownvote={vi.fn()} animationsEnabled={true} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calls onUpvote with correct id when upvote button is clicked', () => {
    const onUpvote = vi.fn();
    renderWithProviders(<VoteActions id="post-1" voteScore={10} onUpvote={onUpvote} onDownvote={vi.fn()} animationsEnabled={true} />);
    const buttons = screen.getAllByRole('button');
    buttons[0].click();
    expect(onUpvote).toHaveBeenCalledWith('post-1');
  });

  it('calls onDownvote with correct id when downvote button is clicked', () => {
    const onDownvote = vi.fn();
    renderWithProviders(<VoteActions id="post-1" voteScore={10} onUpvote={vi.fn()} onDownvote={onDownvote} animationsEnabled={true} />);
    const buttons = screen.getAllByRole('button');
    buttons[1].click();
    expect(onDownvote).toHaveBeenCalledWith('post-1');
  });
});

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
});